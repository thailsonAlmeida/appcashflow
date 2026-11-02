"use client";

import { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import {
  BusinessAsset,
  CashflowGameState,
  FastTrackBusiness,
  InterestItem,
  RealEstateAsset,
  StandardDebtKey,
  StockAsset,
  TransactionLog,
} from "@/types/cashflow";
import { getProfessionById } from "@/constants/professions";
import { getDreamById } from "@/constants/dreams";
import {
  calculateFastTrackMetrics,
  calculateFastTrackTransition,
  calculateRatRaceMetrics,
  createInitialGameState,
  formatCurrency,
} from "@/lib/cashflow-engine";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const ACTIVE_GAME_STORAGE_KEY = "cashflow_active_game_v1";
const SAVED_SLOTS_STORAGE_KEY = "cashflow_saved_slots_v1";
const MAX_UNDO_STEPS = 20;

const DEBT_LABELS: Record<StandardDebtKey, string> = {
  homeMortgage: "Hipoteca da Casa",
  schoolLoan: "Dívida Colégio",
  carLoan: "Empréstimo do Automóvel",
  creditCard: "Cartão de Crédito",
  retailDebt: "Dívidas Casas Comerciais",
  bankLoans: "Empréstimo do Banco",
};

export function useCashflowGame() {
  const {
    value: gameState,
    setValue: setGameState,
    isHydrated,
  } = useLocalStorage<CashflowGameState>(
    ACTIVE_GAME_STORAGE_KEY,
    createInitialGameState()
  );

  const { value: savedSlots, setValue: setSavedSlots } = useLocalStorage<
    CashflowGameState[]
  >(SAVED_SLOTS_STORAGE_KEY, []);

  const [undoStack, setUndoStack] = useState<CashflowGameState[]>([]);

  // Métricas calculadas em tempo real (Heurística 1 de Nielsen)
  const ratRaceMetrics = useMemo(
    () => calculateRatRaceMetrics(gameState),
    [gameState]
  );

  const fastTrackMetrics = useMemo(
    () => calculateFastTrackMetrics(gameState),
    [gameState]
  );

  // Helper interno para atualizar estado gravando no Undo Stack e no Histórico
  const commitState = useCallback(
    (
      updater: (prev: CashflowGameState) => CashflowGameState,
      logEntry?: Omit<TransactionLog, "id" | "timestamp">
    ) => {
      setGameState((prev) => {
        setUndoStack((stack) => [prev, ...stack.slice(0, MAX_UNDO_STEPS - 1)]);
        const next = updater(prev);
        const now = new Date().toISOString();

        const updatedHistory = logEntry
          ? [
              {
                id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
                timestamp: now,
                ...logEntry,
              },
              ...next.history.slice(0, 99),
            ]
          : next.history;

        return {
          ...next,
          updatedAt: now,
          history: updatedHistory,
        };
      });
    },
    [setGameState]
  );

  // Heurística 3: Desfazer última ação (Undo)
  const undo = useCallback(() => {
    if (undoStack.length === 0) {
      toast.info("Não há ações anteriores para desfazer.");
      return;
    }
    const [previousState, ...rest] = undoStack;
    setUndoStack(rest);
    setGameState(previousState);
    toast.info("Ação desfeita", {
      description: "O balanço retornou ao estado anterior.",
    });
  }, [undoStack, setGameState]);

  // Atualização de Perfil (Jogador e Auditor)
  const updateProfile = useCallback(
    (data: { playerName?: string; auditorName?: string }) => {
      commitState((prev) => ({
        ...prev,
        playerName: data.playerName ?? prev.playerName,
        auditorName: data.auditorName ?? prev.auditorName,
        slotName: `${data.playerName ?? prev.playerName} - ${prev.professionName}`,
      }));
    },
    [commitState]
  );

  // Seleção de Carta de Profissão (Heurística 6: Reconhecimento em vez de lembrança)
  const selectProfession = useCallback(
    (professionId: string, resetProgress = true) => {
      const card = getProfessionById(professionId);
      commitState(
        (prev) => {
          if (resetProgress) {
            const fresh = createInitialGameState(
              card,
              prev.playerName,
              prev.auditorName,
              new Date().toISOString()
            );
            return {
              ...fresh,
              id: `game_${Date.now()}`,
              selectedDreamId: prev.selectedDreamId,
              selectedDreamName: prev.selectedDreamName,
              selectedDreamCost: prev.selectedDreamCost,
            };
          }
          return {
            ...prev,
            professionId: card.id,
            professionName: card.name,
            slotName: `${prev.playerName} - ${card.name}`,
            ratRace: {
              ...prev.ratRace,
              salary: card.salary,
              savings: card.savings,
              perChildCost: card.perChildExpense,
              expenses: { ...card.expenses },
              liabilities: {
                ...card.liabilities,
                bankLoans: prev.ratRace.liabilities.bankLoans,
              },
            },
          };
        },
        {
          action: "Carta de Profissão Selecionada",
          amount: card.salary,
          details: `Profissão alterada para ${card.name} (Salário: ${formatCurrency(card.salary)})`,
          type: "system",
        }
      );
      toast.success(`Profissão definida: ${card.name}`, {
        description: `Salário: ${formatCurrency(card.salary)} | Caixa Inicial: ${formatCurrency(card.savings)}`,
      });
    },
    [commitState]
  );

  // Seleção de Sonho
  const selectDream = useCallback(
    (dreamId: string, customName?: string, customCost?: number) => {
      const dream = getDreamById(dreamId);
      const finalName = customName?.trim() || dream.name;
      const finalCost =
        typeof customCost === "number" && customCost > 0
          ? customCost
          : dream.cost;

      commitState(
        (prev) => ({
          ...prev,
          selectedDreamId: dream.id,
          selectedDreamName: finalName,
          selectedDreamCost: finalCost,
        }),
        {
          action: "Sonho Selecionado",
          amount: finalCost,
          details: `Sonho: ${finalName} (${formatCurrency(finalCost)})`,
          type: "system",
        }
      );
      toast.success(`Sonho escolhido: ${finalName}`);
    },
    [commitState]
  );

  // Dia de Pagamento (Payday) - Corrida dos Ratos ou Pista Rápida
  const receivePayday = useCallback(() => {
    if (gameState.phase === "RAT_RACE") {
      const amount = ratRaceMetrics.monthlyCashFlow;
      commitState(
        (prev) => ({
          ...prev,
          cashOnHand: prev.cashOnHand + amount,
        }),
        {
          action: "Dia de Pagamento (Payday)",
          amount,
          details:
            amount >= 0
              ? `Recebeu fluxo de caixa mensal de ${formatCurrency(amount)}`
              : `Fluxo negativo descontado: ${formatCurrency(amount)}`,
          type: amount >= 0 ? "income" : "expense",
        }
      );

      if (amount >= 0) {
        toast.success(`Dia de Pagamento! +${formatCurrency(amount)}`, {
          description: `Novo saldo em caixa: ${formatCurrency(gameState.cashOnHand + amount)}`,
        });
      } else {
        toast.warning(`Payday Negativo: ${formatCurrency(amount)}`, {
          description: `Valor descontado do caixa.`,
        });
      }
    } else {
      const amount = fastTrackMetrics.currentCashflowDayIncome;
      commitState(
        (prev) => ({
          ...prev,
          cashOnHand: prev.cashOnHand + amount,
        }),
        {
          action: "Dia de Cashflow (Pista Rápida)",
          amount,
          details: `Recebeu ${formatCurrency(amount)} na Pista Rápida`,
          type: "income",
        }
      );
      toast.success(`Dia de Cashflow! +${formatCurrency(amount)}`, {
        description: `Novo saldo em caixa: ${formatCurrency(gameState.cashOnHand + amount)}`,
      });
    }
  }, [gameState.phase, gameState.cashOnHand, ratRaceMetrics, fastTrackMetrics, commitState]);

  // Ajuste avulso de caixa (Doidices/Caprichos, bônus, presentes, etc.)
  const adjustCash = useCallback(
    (
      amount: number,
      mode: "add" | "subtract" | "set",
      reason = "Ajuste de Caixa"
    ) => {
      const cleanAmount = Math.round(Math.abs(amount));
      if (cleanAmount === 0 && mode !== "set") return;

      if (mode === "subtract" && gameState.cashOnHand < cleanAmount) {
        toast.error("Saldo em caixa insuficiente!", {
          description: `Você precisa de ${formatCurrency(cleanAmount)}, mas possui ${formatCurrency(gameState.cashOnHand)}. Contrate um empréstimo bancário se necessário.`,
        });
        return false;
      }

      commitState(
        (prev) => {
          const nextCash =
            mode === "add"
              ? prev.cashOnHand + cleanAmount
              : mode === "subtract"
              ? prev.cashOnHand - cleanAmount
              : cleanAmount;

          return {
            ...prev,
            cashOnHand: nextCash,
          };
        },
        {
          action: reason,
          amount: mode === "subtract" ? -cleanAmount : cleanAmount,
          details:
            mode === "add"
              ? `Entrada no caixa: +${formatCurrency(cleanAmount)} (${reason})`
              : mode === "subtract"
              ? `Saída do caixa: -${formatCurrency(cleanAmount)} (${reason})`
              : `Caixa ajustado para ${formatCurrency(cleanAmount)} (${reason})`,
          type: mode === "subtract" ? "expense" : "income",
        }
      );

      toast.success(reason, {
        description:
          mode === "add"
            ? `+${formatCurrency(cleanAmount)} adicionado ao caixa.`
            : mode === "subtract"
            ? `-${formatCurrency(cleanAmount)} pago do caixa.`
            : `Caixa definido para ${formatCurrency(cleanAmount)}.`,
      });
      return true;
    },
    [gameState.cashOnHand, commitState]
  );

  // Empréstimo Bancário (Múltiplos de $1.000 -> gera 10% nos gastos mensais)
  const takeBankLoan = useCallback(
    (amount: number) => {
      const loanAmount = Math.round(amount);
      if (loanAmount <= 0) return;

      const monthlyInterest = Math.round(loanAmount * 0.1);

      commitState(
        (prev) => ({
          ...prev,
          cashOnHand: prev.cashOnHand + loanAmount,
          ratRace: {
            ...prev.ratRace,
            liabilities: {
              ...prev.ratRace.liabilities,
              bankLoans: prev.ratRace.liabilities.bankLoans + loanAmount,
            },
          },
        }),
        {
          action: "Empréstimo Bancário",
          amount: loanAmount,
          details: `Pegou ${formatCurrency(loanAmount)} no banco (+${formatCurrency(monthlyInterest)}/mês nos gastos)`,
          type: "debt",
        }
      );

      toast.warning(`Empréstimo de ${formatCurrency(loanAmount)} contratado`, {
        description: `+${formatCurrency(loanAmount)} no caixa | +${formatCurrency(monthlyInterest)}/mês em gastos com banco.`,
      });
    },
    [commitState]
  );

  // Quitar ou Amortizar Dívidas
  const payOffDebt = useCallback(
    (debtKey: StandardDebtKey, customAmount?: number) => {
      const currentDebt = gameState.ratRace.liabilities[debtKey];
      if (currentDebt <= 0) {
        toast.info("Esta dívida já está quitada!");
        return false;
      }

      const amountToPay =
        debtKey === "bankLoans" && customAmount
          ? Math.min(currentDebt, Math.round(customAmount))
          : currentDebt;

      if (gameState.cashOnHand < amountToPay) {
        toast.error("Caixa insuficiente para quitar esta dívida", {
          description: `Necessário: ${formatCurrency(amountToPay)} | Seu Caixa: ${formatCurrency(gameState.cashOnHand)}`,
        });
        return false;
      }

      const label = DEBT_LABELS[debtKey];

      commitState(
        (prev) => {
          const remainingDebt = prev.ratRace.liabilities[debtKey] - amountToPay;
          const updatedExpenses = { ...prev.ratRace.expenses };

          // Quando uma dívida fixa (hipoteca, colégio, carro, cartão, lojas) é 100% quitada, seu gasto mensal zera
          if (debtKey !== "bankLoans" && remainingDebt <= 0) {
            updatedExpenses[debtKey] = 0;
          }

          return {
            ...prev,
            cashOnHand: prev.cashOnHand - amountToPay,
            ratRace: {
              ...prev.ratRace,
              expenses: updatedExpenses,
              liabilities: {
                ...prev.ratRace.liabilities,
                [debtKey]: Math.max(0, remainingDebt),
              },
            },
          };
        },
        {
          action: `Pagamento: ${label}`,
          amount: -amountToPay,
          details: `Pagou ${formatCurrency(amountToPay)} de ${label}`,
          type: "debt",
        }
      );

      toast.success(`${label} paga!`, {
        description: `-${formatCurrency(amountToPay)} do caixa. Seu Fluxo de Caixa Mensal aumentou!`,
      });
      return true;
    },
    [gameState.ratRace.liabilities, gameState.cashOnHand, commitState]
  );

  // Gerenciamento de Filhos (Heurística 5: Limite máximo de 3 filhos conforme regra do jogo)
  const addChild = useCallback(() => {
    if (gameState.ratRace.childrenCount >= 3) {
      toast.warning("Limite de 3 filhos atingido!", {
        description: "Pelas regras do Cashflow, o máximo são 3 filhos.",
      });
      return false;
    }

    commitState(
      (prev) => ({
        ...prev,
        ratRace: {
          ...prev.ratRace,
          childrenCount: Math.min(3, prev.ratRace.childrenCount + 1),
        },
      }),
      {
        action: "Nascimento de Filho (+1)",
        amount: -gameState.ratRace.perChildCost,
        details: `Novo filho! Gasto mensal aumentou em ${formatCurrency(gameState.ratRace.perChildCost)}`,
        type: "expense",
      }
    );

    toast.info("Parabéns pelo novo bebê!", {
      description: `Seus gastos mensais aumentaram em ${formatCurrency(gameState.ratRace.perChildCost)}.`,
    });
    return true;
  }, [
    gameState.ratRace.childrenCount,
    gameState.ratRace.perChildCost,
    commitState,
  ]);

  const removeChild = useCallback(() => {
    if (gameState.ratRace.childrenCount <= 0) return;
    commitState(
      (prev) => ({
        ...prev,
        ratRace: {
          ...prev.ratRace,
          childrenCount: Math.max(0, prev.ratRace.childrenCount - 1),
        },
      }),
      {
        action: "Ajuste no Número de Filhos (-1)",
        details: "Reduzido 1 filho da contagem.",
        type: "system",
      }
    );
  }, [gameState.ratRace.childrenCount, commitState]);

  // Evento de Tabuleiro: Demitido (Downsized) -> Paga Total de Gastos
  const payDownsized = useCallback(() => {
    const cost = ratRaceMetrics.totalExpenses;
    if (gameState.cashOnHand < cost) {
      toast.error("Caixa insuficiente para pagar a demissão!", {
        description: `Você precisa pagar seus Gastos Totais de ${formatCurrency(cost)}, mas tem ${formatCurrency(gameState.cashOnHand)}. Pegue um empréstimo no banco.`,
      });
      return false;
    }

    commitState(
      (prev) => ({
        ...prev,
        cashOnHand: prev.cashOnHand - cost,
      }),
      {
        action: "Demitido (Downsized)",
        amount: -cost,
        details: `Pagou o total de gastos mensais (${formatCurrency(cost)}) e perdeu 2 turnos.`,
        type: "expense",
      }
    );

    toast.error(`Demitido! -${formatCurrency(cost)}`, {
      description: "Você pagou seus Gastos Totais e perde 2 turnos.",
    });
    return true;
  }, [ratRaceMetrics.totalExpenses, gameState.cashOnHand, commitState]);

  // Evento de Tabuleiro: Caridade (10% do Ingresso Total)
  const payCharity = useCallback(() => {
    const cost = Math.round(ratRaceMetrics.totalIncome * 0.1);
    if (gameState.cashOnHand < cost) {
      toast.error("Caixa insuficiente para Caridade", {
        description: `10% do seu ingresso total equivale a ${formatCurrency(cost)}.`,
      });
      return false;
    }

    commitState(
      (prev) => ({
        ...prev,
        cashOnHand: prev.cashOnHand - cost,
      }),
      {
        action: "Doação para Caridade (10%)",
        amount: -cost,
        details: `Doou ${formatCurrency(cost)} (10% do Ingresso Total). Jogue com 2 dados por 3 turnos!`,
        type: "expense",
      }
    );

    toast.success(`Caridade realizada! -${formatCurrency(cost)}`, {
      description: "Você pode usar 1 ou 2 dados pelos próximos 3 turnos!",
    });
    return true;
  }, [ratRaceMetrics.totalIncome, gameState.cashOnHand, commitState]);

  // ==================== ATIVOS: AÇÕES / FUNDOS / CDs ====================
  const buyStock = useCallback(
    (data: Omit<StockAsset, "id"> & { deductFromCash?: boolean }) => {
      const totalCost = Math.round(data.shares * data.costPerShare);
      const shouldDeduct = data.deductFromCash !== false;

      if (shouldDeduct && gameState.cashOnHand < totalCost) {
        toast.error("Caixa insuficiente para comprar ações!", {
          description: `Custo total: ${formatCurrency(totalCost)} | Seu caixa: ${formatCurrency(gameState.cashOnHand)}`,
        });
        return false;
      }

      const newStock: StockAsset = {
        id: `stk_${Date.now()}`,
        symbol: data.symbol.toUpperCase().trim(),
        description: data.description || data.symbol.toUpperCase().trim(),
        shares: Number(data.shares),
        costPerShare: Number(data.costPerShare),
        dividendPerShare: Number(data.dividendPerShare) || 0,
      };

      commitState(
        (prev) => ({
          ...prev,
          cashOnHand: shouldDeduct
            ? prev.cashOnHand - totalCost
            : prev.cashOnHand,
          ratRace: {
            ...prev.ratRace,
            stocks: [...prev.ratRace.stocks, newStock],
          },
        }),
        {
          action: `Compra de Ações: ${newStock.symbol}`,
          amount: shouldDeduct ? -totalCost : 0,
          details: `${newStock.shares} ações de ${newStock.symbol} a ${formatCurrency(newStock.costPerShare)}/ação (Total: ${formatCurrency(totalCost)})`,
          type: "asset",
        }
      );

      toast.success(`Comprou ${newStock.shares}x ${newStock.symbol}`, {
        description: `Investimento total de ${formatCurrency(totalCost)}`,
      });
      return true;
    },
    [gameState.cashOnHand, commitState]
  );

  const sellStock = useCallback(
    (stockId: string, sellPricePerShare: number, sharesToSell?: number) => {
      const target = gameState.ratRace.stocks.find((s) => s.id === stockId);
      if (!target) return false;

      const qtyToSell =
        sharesToSell && sharesToSell > 0
          ? Math.min(target.shares, sharesToSell)
          : target.shares;

      const totalSaleValue = Math.round(qtyToSell * sellPricePerShare);
      const costBasis = Math.round(qtyToSell * target.costPerShare);
      const profit = totalSaleValue - costBasis;

      commitState(
        (prev) => ({
          ...prev,
          cashOnHand: prev.cashOnHand + totalSaleValue,
          ratRace: {
            ...prev.ratRace,
            stocks:
              qtyToSell >= target.shares
                ? prev.ratRace.stocks.filter((s) => s.id !== stockId)
                : prev.ratRace.stocks.map((s) =>
                    s.id === stockId
                      ? { ...s, shares: s.shares - qtyToSell }
                      : s
                  ),
          },
        }),
        {
          action: `Venda de Ações: ${target.symbol}`,
          amount: totalSaleValue,
          details: `Vendeu ${qtyToSell}x ${target.symbol} a ${formatCurrency(sellPricePerShare)} (Recebeu: ${formatCurrency(totalSaleValue)} | Lucro: ${formatCurrency(profit)})`,
          type: "asset",
        }
      );

      toast.success(`Venda de ${target.symbol}: +${formatCurrency(totalSaleValue)}`, {
        description: `Lucro/Resultado da operação: ${formatCurrency(profit)}`,
      });
      return true;
    },
    [gameState.ratRace.stocks, commitState]
  );

  // Desdobramento (Split 2 por 1) ou Grupamento (Reverse Split 1 por 2) de Ações
  const splitStock = useCallback(
    (stockId: string, type: "2-for-1" | "1-for-2") => {
      const target = gameState.ratRace.stocks.find((s) => s.id === stockId);
      if (!target) return;

      commitState(
        (prev) => ({
          ...prev,
          ratRace: {
            ...prev.ratRace,
            stocks: prev.ratRace.stocks.map((s) => {
              if (s.id !== stockId) return s;
              const newShares =
                type === "2-for-1"
                  ? s.shares * 2
                  : Math.max(1, Math.floor(s.shares / 2));
              return {
                ...s,
                shares: newShares,
              };
            }),
          },
        }),
        {
          action: `Split de Ações (${type}): ${target.symbol}`,
          details: `Quantidade de ${target.symbol} alterada de ${target.shares} para ${
            type === "2-for-1"
              ? target.shares * 2
              : Math.max(1, Math.floor(target.shares / 2))
          } ações`,
          type: "asset",
        }
      );

      toast.info(`Split ${type} aplicado em ${target.symbol}!`);
    },
    [gameState.ratRace.stocks, commitState]
  );

  // ==================== ATIVOS: BENS MATERIAIS (IMÓVEIS) ====================
  const buyRealEstate = useCallback(
    (data: Omit<RealEstateAsset, "id"> & { deductFromCash?: boolean }) => {
      const downPayment = Math.round(data.downPayment);
      const shouldDeduct = data.deductFromCash !== false;

      if (shouldDeduct && gameState.cashOnHand < downPayment) {
        toast.error("Caixa insuficiente para a entrada do imóvel!", {
          description: `Entrada: ${formatCurrency(downPayment)} | Seu caixa: ${formatCurrency(gameState.cashOnHand)}`,
        });
        return false;
      }

      const newAsset: RealEstateAsset = {
        id: `re_${Date.now()}`,
        description: data.description.trim(),
        downPayment,
        cost: Math.round(data.cost),
        mortgage: Math.round(data.mortgage),
        cashFlow: Math.round(data.cashFlow),
      };

      commitState(
        (prev) => ({
          ...prev,
          cashOnHand: shouldDeduct
            ? prev.cashOnHand - downPayment
            : prev.cashOnHand,
          ratRace: {
            ...prev.ratRace,
            realEstates: [...prev.ratRace.realEstates, newAsset],
          },
        }),
        {
          action: `Compra de Imóvel: ${newAsset.description}`,
          amount: shouldDeduct ? -downPayment : 0,
          details: `Entrada: ${formatCurrency(newAsset.downPayment)} | Custo: ${formatCurrency(newAsset.cost)} | Fluxo: +${formatCurrency(newAsset.cashFlow)}/mês`,
          type: "asset",
        }
      );

      toast.success(`Imóvel adquirido: ${newAsset.description}`, {
        description: `Fluxo de caixa passivo: ${formatCurrency(newAsset.cashFlow)}/mês`,
      });
      return true;
    },
    [gameState.cashOnHand, commitState]
  );

  const sellRealEstate = useCallback(
    (assetId: string, salePrice: number) => {
      const target = gameState.ratRace.realEstates.find(
        (r) => r.id === assetId
      );
      if (!target) return false;

      const netProceeds = Math.round(salePrice - target.mortgage);

      commitState(
        (prev) => ({
          ...prev,
          cashOnHand: prev.cashOnHand + netProceeds,
          ratRace: {
            ...prev.ratRace,
            realEstates: prev.ratRace.realEstates.filter(
              (r) => r.id !== assetId
            ),
          },
        }),
        {
          action: `Venda de Imóvel: ${target.description}`,
          amount: netProceeds,
          details: `Vendido por ${formatCurrency(salePrice)} - Hipoteca ${formatCurrency(target.mortgage)} = Recebeu líquido ${formatCurrency(netProceeds)}`,
          type: "asset",
        }
      );

      toast.success(`Imóvel vendido: ${target.description}`, {
        description: `Valor líquido recebido no caixa: ${formatCurrency(netProceeds)}`,
      });
      return true;
    },
    [gameState.ratRace.realEstates, commitState]
  );

  // ==================== ATIVOS: NEGÓCIOS ====================
  const buyBusiness = useCallback(
    (data: Omit<BusinessAsset, "id"> & { deductFromCash?: boolean }) => {
      const downPayment = Math.round(data.downPayment);
      const shouldDeduct = data.deductFromCash !== false;

      if (shouldDeduct && gameState.cashOnHand < downPayment) {
        toast.error("Caixa insuficiente para a entrada do negócio!", {
          description: `Entrada: ${formatCurrency(downPayment)} | Seu caixa: ${formatCurrency(gameState.cashOnHand)}`,
        });
        return false;
      }

      const newBiz: BusinessAsset = {
        id: `biz_${Date.now()}`,
        description: data.description.trim(),
        downPayment,
        cost: Math.round(data.cost),
        liability: Math.round(data.liability),
        cashFlow: Math.round(data.cashFlow),
      };

      commitState(
        (prev) => ({
          ...prev,
          cashOnHand: shouldDeduct
            ? prev.cashOnHand - downPayment
            : prev.cashOnHand,
          ratRace: {
            ...prev.ratRace,
            businesses: [...prev.ratRace.businesses, newBiz],
          },
        }),
        {
          action: `Compra de Negócio: ${newBiz.description}`,
          amount: shouldDeduct ? -downPayment : 0,
          details: `Entrada: ${formatCurrency(newBiz.downPayment)} | Fluxo Mensal: ${formatCurrency(newBiz.cashFlow)}`,
          type: "asset",
        }
      );

      toast.success(`Negócio adquirido: ${newBiz.description}`, {
        description: `Fluxo de caixa passivo: +${formatCurrency(newBiz.cashFlow)}/mês`,
      });
      return true;
    },
    [gameState.cashOnHand, commitState]
  );

  const sellBusiness = useCallback(
    (businessId: string, salePrice: number) => {
      const target = gameState.ratRace.businesses.find(
        (b) => b.id === businessId
      );
      if (!target) return false;

      const netProceeds = Math.round(salePrice - target.liability);

      commitState(
        (prev) => ({
          ...prev,
          cashOnHand: prev.cashOnHand + netProceeds,
          ratRace: {
            ...prev.ratRace,
            businesses: prev.ratRace.businesses.filter(
              (b) => b.id !== businessId
            ),
          },
        }),
        {
          action: `Venda de Negócio: ${target.description}`,
          amount: netProceeds,
          details: `Vendido por ${formatCurrency(salePrice)} - Passivo ${formatCurrency(target.liability)} = Líquido ${formatCurrency(netProceeds)}`,
          type: "asset",
        }
      );

      toast.success(`Negócio vendido: ${target.description}`, {
        description: `Recebeu líquido no caixa: ${formatCurrency(netProceeds)}`,
      });
      return true;
    },
    [gameState.ratRace.businesses, commitState]
  );

  // ==================== ATIVOS: JUROS / CDs ====================
  const addInterestItem = useCallback(
    (data: Omit<InterestItem, "id"> & { deductFromCash?: boolean }) => {
      const principal = Math.round(data.principal);
      const shouldDeduct = data.deductFromCash !== false;

      if (shouldDeduct && gameState.cashOnHand < principal) {
        toast.error("Caixa insuficiente para este título de juros!", {
          description: `Custo: ${formatCurrency(principal)} | Seu caixa: ${formatCurrency(gameState.cashOnHand)}`,
        });
        return false;
      }

      const item: InterestItem = {
        id: `int_${Date.now()}`,
        description: data.description.trim(),
        principal,
        cashFlow: Math.round(data.cashFlow),
      };

      commitState(
        (prev) => ({
          ...prev,
          cashOnHand: shouldDeduct
            ? prev.cashOnHand - principal
            : prev.cashOnHand,
          ratRace: {
            ...prev.ratRace,
            interests: [...prev.ratRace.interests, item],
          },
        }),
        {
          action: `Aplicação de Juros: ${item.description}`,
          amount: shouldDeduct ? -principal : 0,
          details: `Principal: ${formatCurrency(item.principal)} | Juros mensais: +${formatCurrency(item.cashFlow)}`,
          type: "asset",
        }
      );

      toast.success(`Adicionado: ${item.description}`);
      return true;
    },
    [gameState.cashOnHand, commitState]
  );

  const removeInterestItem = useCallback(
    (id: string, redeemToCash = true) => {
      const target = gameState.ratRace.interests.find((i) => i.id === id);
      if (!target) return;

      commitState(
        (prev) => ({
          ...prev,
          cashOnHand: redeemToCash
            ? prev.cashOnHand + target.principal
            : prev.cashOnHand,
          ratRace: {
            ...prev.ratRace,
            interests: prev.ratRace.interests.filter((i) => i.id !== id),
          },
        }),
        {
          action: `Resgate de Juros: ${target.description}`,
          amount: redeemToCash ? target.principal : 0,
          details: redeemToCash
            ? `Resgatou ${formatCurrency(target.principal)} para o caixa`
            : `Removido ${target.description}`,
          type: "asset",
        }
      );
      toast.info(`${target.description} removido.`);
    },
    [gameState.ratRace.interests, commitState]
  );

  // Edição Manual de Campos da Corrida dos Ratos (House Rules)
  const updateManualRatRaceFields = useCallback(
    (updates: {
      salary?: number;
      savings?: number;
      perChildCost?: number;
      expenses?: Partial<CashflowGameState["ratRace"]["expenses"]>;
      liabilities?: Partial<CashflowGameState["ratRace"]["liabilities"]>;
    }) => {
      commitState(
        (prev) => ({
          ...prev,
          ratRace: {
            ...prev.ratRace,
            salary: updates.salary ?? prev.ratRace.salary,
            savings: updates.savings ?? prev.ratRace.savings,
            perChildCost: updates.perChildCost ?? prev.ratRace.perChildCost,
            expenses: {
              ...prev.ratRace.expenses,
              ...(updates.expenses || {}),
            },
            liabilities: {
              ...prev.ratRace.liabilities,
              ...(updates.liabilities || {}),
            },
          },
        }),
        {
          action: "Edição Manual da Ficha",
          details: "Valores base do balanço ajustados manualmente pelo jogador.",
          type: "system",
        }
      );
      toast.success("Ficha atualizada com sucesso!");
    },
    [commitState]
  );

  // ==================== TRANSIÇÃO E PISTA RÁPIDA ====================
  const enterFastTrack = useCallback(() => {
    const {
      roundedPassiveIncome,
      initialCashflowDayIncome,
      targetIncomeToWin,
    } = calculateFastTrackTransition(ratRaceMetrics.passiveIncome);

    commitState(
      (prev) => ({
        ...prev,
        phase: "FAST_TRACK",
        cashOnHand: prev.cashOnHand + initialCashflowDayIncome,
        fastTrack: {
          ...prev.fastTrack,
          passiveIncomeFromRatRace: roundedPassiveIncome,
          initialCashflowDayIncome,
          targetIncomeToWin,
        },
      }),
      {
        action: "SAIU DA CORRIDA DOS RATOS!",
        amount: initialCashflowDayIncome,
        details: `Ingresso Passivo (${formatCurrency(roundedPassiveIncome)}) x 100 = Novo Ingresso de Dia de Cashflow: ${formatCurrency(initialCashflowDayIncome)}`,
        type: "milestone",
      }
    );

    toast.success("PARABÉNS! Você saiu da Corrida dos Ratos!", {
      description: `Seus ativos foram multiplicados por 100x! Você recebeu ${formatCurrency(initialCashflowDayIncome)}!`,
    });
  }, [ratRaceMetrics.passiveIncome, commitState]);

  const setPhase = useCallback(
    (phase: "RAT_RACE" | "FAST_TRACK") => {
      commitState((prev) => ({
        ...prev,
        phase,
      }));
    },
    [commitState]
  );

  const buyFastTrackBusiness = useCallback(
    (data: Omit<FastTrackBusiness, "id"> & { deductFromCash?: boolean }) => {
      const cost = Math.round(data.cost);
      const shouldDeduct = data.deductFromCash !== false;

      if (shouldDeduct && gameState.cashOnHand < cost) {
        toast.error("Caixa insuficiente para comprar este negócio na Pista Rápida!", {
          description: `Custo: ${formatCurrency(cost)} | Seu caixa: ${formatCurrency(gameState.cashOnHand)}`,
        });
        return false;
      }

      const newBiz: FastTrackBusiness = {
        id: `ft_biz_${Date.now()}`,
        description: data.description.trim(),
        cost,
        monthlyCashflow: Math.round(data.monthlyCashflow),
      };

      commitState(
        (prev) => ({
          ...prev,
          cashOnHand: shouldDeduct ? prev.cashOnHand - cost : prev.cashOnHand,
          fastTrack: {
            ...prev.fastTrack,
            businesses: [...prev.fastTrack.businesses, newBiz],
          },
        }),
        {
          action: `Negócio Pista Rápida: ${newBiz.description}`,
          amount: shouldDeduct ? -cost : 0,
          details: `Custo: ${formatCurrency(newBiz.cost)} | Novo Fluxo Mensal: +${formatCurrency(newBiz.monthlyCashflow)}`,
          type: "asset",
        }
      );

      toast.success(`Negócio adquirido na Pista Rápida!`, {
        description: `${newBiz.description} (+${formatCurrency(newBiz.monthlyCashflow)}/mês)`,
      });
      return true;
    },
    [gameState.cashOnHand, commitState]
  );

  const removeFastTrackBusiness = useCallback(
    (id: string) => {
      commitState(
        (prev) => ({
          ...prev,
          fastTrack: {
            ...prev.fastTrack,
            businesses: prev.fastTrack.businesses.filter((b) => b.id !== id),
          },
        }),
        {
          action: "Negócio Removido (Pista Rápida)",
          details: "Registro removido da tabela da Pista Rápida.",
          type: "system",
        }
      );
    },
    [commitState]
  );

  const purchaseDream = useCallback(
    (customCost?: number) => {
      const cost =
        typeof customCost === "number"
          ? Math.round(customCost)
          : gameState.selectedDreamCost;

      if (gameState.cashOnHand < cost) {
        toast.error("Caixa insuficiente para comprar seu Sonho!", {
          description: `Custo do Sonho: ${formatCurrency(cost)} | Seu caixa: ${formatCurrency(gameState.cashOnHand)}`,
        });
        return false;
      }

      commitState(
        (prev) => ({
          ...prev,
          cashOnHand: prev.cashOnHand - cost,
          fastTrack: {
            ...prev.fastTrack,
            dreamPurchased: true,
          },
        }),
        {
          action: `COMPROU O SONHO: ${gameState.selectedDreamName}!`,
          amount: -cost,
          details: `Conquistou o sonho "${gameState.selectedDreamName}" por ${formatCurrency(cost)} e VENCEU O JOGO!`,
          type: "milestone",
        }
      );

      toast.success(`VITÓRIA! Você comprou seu sonho: ${gameState.selectedDreamName}!`);
      return true;
    },
    [gameState.selectedDreamCost, gameState.selectedDreamName, gameState.cashOnHand, commitState]
  );

  // ==================== SLOTS, EXPORTAÇÃO, IMPORTAÇÃO & RESET ====================
  const resetGame = useCallback(
    (professionId?: string) => {
      const prof = getProfessionById(professionId || gameState.professionId);
      const fresh = createInitialGameState(
        prof,
        gameState.playerName,
        gameState.auditorName,
        new Date().toISOString()
      );
      fresh.id = `game_${Date.now()}`;
      setUndoStack((stack) => [gameState, ...stack.slice(0, MAX_UNDO_STEPS - 1)]);
      setGameState(fresh);
      toast.info("Partida reiniciada!", {
        description: `Nova ficha criada como ${prof.name}.`,
      });
    },
    [
      gameState,
      setGameState,
    ]
  );

  const saveCurrentToSlots = useCallback(
    (customSlotName?: string) => {
      const slotToSave: CashflowGameState = {
        ...gameState,
        slotName:
          customSlotName?.trim() ||
          `${gameState.playerName} (${gameState.professionName})`,
        updatedAt: new Date().toISOString(),
      };

      setSavedSlots((prev) => {
        const exists = prev.some((s) => s.id === slotToSave.id);
        if (exists) {
          return prev.map((s) => (s.id === slotToSave.id ? slotToSave : s));
        }
        return [slotToSave, ...prev];
      });

      toast.success("Partida salva nos slots locais!", {
        description: slotToSave.slotName,
      });
    },
    [gameState, setSavedSlots]
  );

  const loadSlot = useCallback(
    (slotId: string) => {
      const found = savedSlots.find((s) => s.id === slotId);
      if (!found) return;
      setUndoStack((stack) => [gameState, ...stack.slice(0, MAX_UNDO_STEPS - 1)]);
      setGameState(found);
      toast.success(`Partida carregada: ${found.slotName}`);
    },
    [savedSlots, gameState, setGameState]
  );

  const deleteSlot = useCallback(
    (slotId: string) => {
      setSavedSlots((prev) => prev.filter((s) => s.id !== slotId));
      toast.info("Partida removida dos salvos.");
    },
    [setSavedSlots]
  );

  const exportGameJson = useCallback(() => {
    const dataStr = JSON.stringify(gameState, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const safeName = gameState.playerName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_");
    link.href = url;
    link.download = `cashflow_${safeName}_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Arquivo JSON exportado com sucesso!");
  }, [gameState]);

  const importGameJson = useCallback(
    (jsonString: string) => {
      try {
        const parsed = JSON.parse(jsonString) as CashflowGameState;
        if (!parsed || !parsed.ratRace || !parsed.fastTrack) {
          throw new Error("Formato inválido");
        }
        setUndoStack((stack) => [gameState, ...stack.slice(0, MAX_UNDO_STEPS - 1)]);
        setGameState(parsed);
        toast.success("Partida importada com sucesso!", {
          description: `${parsed.playerName} - ${parsed.professionName}`,
        });
        return true;
      } catch {
        toast.error("Erro ao importar arquivo JSON", {
          description: "Certifique-se de que o arquivo foi exportado pelo App Cashflow.",
        });
        return false;
      }
    },
    [gameState, setGameState]
  );

  return {
    gameState,
    isHydrated,
    ratRaceMetrics,
    fastTrackMetrics,
    canUndo: undoStack.length > 0,
    savedSlots,
    actions: {
      undo,
      updateProfile,
      selectProfession,
      selectDream,
      receivePayday,
      adjustCash,
      takeBankLoan,
      payOffDebt,
      addChild,
      removeChild,
      payDownsized,
      payCharity,
      buyStock,
      sellStock,
      splitStock,
      buyRealEstate,
      sellRealEstate,
      buyBusiness,
      sellBusiness,
      addInterestItem,
      removeInterestItem,
      updateManualRatRaceFields,
      enterFastTrack,
      setPhase,
      buyFastTrackBusiness,
      removeFastTrackBusiness,
      purchaseDream,
      resetGame,
      saveCurrentToSlots,
      loadSlot,
      deleteSlot,
      exportGameJson,
      importGameJson,
    },
  };
}

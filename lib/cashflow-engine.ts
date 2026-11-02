import {
  CashflowGameState,
  ComputedFastTrackMetrics,
  ComputedRatRaceMetrics,
  ProfessionCard,
} from "@/types/cashflow";
import { PROFESSIONS } from "@/constants/professions";
import { DREAMS } from "@/constants/dreams";

export function formatCurrency(value: number): string {
  const isNegative = value < 0;
  const absVal = Math.abs(Math.round(value));
  const formatted = absVal.toLocaleString("pt-BR");
  return isNegative ? `-$ ${formatted}` : `$ ${formatted}`;
}

export function createInitialGameState(
  profession: ProfessionCard = PROFESSIONS[0],
  playerName = "Jogador 1",
  auditorName = "",
  timestamp = "2026-01-01T00:00:00.000Z"
): CashflowGameState {
  const defaultDream = DREAMS[1];

  return {
    id: `game_default_${profession.id}`,
    slotName: `${playerName} - ${profession.name}`,
    updatedAt: timestamp,
    playerName,
    auditorName,
    phase: "RAT_RACE",
    professionId: profession.id,
    professionName: profession.name,
    selectedDreamId: defaultDream.id,
    selectedDreamName: defaultDream.name,
    selectedDreamCost: defaultDream.cost,
    cashOnHand: profession.savings,
    ratRace: {
      salary: profession.salary,
      savings: profession.savings,
      childrenCount: 0,
      perChildCost: profession.perChildExpense,
      interests: [],
      stocks: [],
      realEstates: [],
      businesses: [],
      expenses: { ...profession.expenses },
      liabilities: {
        ...profession.liabilities,
        bankLoans: 0,
      },
    },
    fastTrack: {
      passiveIncomeFromRatRace: 0,
      initialCashflowDayIncome: 0,
      targetIncomeToWin: 50000,
      dreamPurchased: false,
      businesses: [],
    },
    history: [
      {
        id: `log_init_${profession.id}`,
        timestamp,
        action: "Início de Partida",
        amount: profession.savings,
        details: `Profissão: ${profession.name} | Salário: ${formatCurrency(profession.salary)} | Economias: ${formatCurrency(profession.savings)}`,
        type: "system",
      },
    ],
  };
}

export function calculateRatRaceMetrics(
  state: CashflowGameState
): ComputedRatRaceMetrics {
  const { ratRace } = state;

  const interestIncome = ratRace.interests.reduce(
    (acc, item) => acc + (Number(item.cashFlow) || 0),
    0
  );

  const dividendIncome = ratRace.stocks.reduce(
    (acc, stock) =>
      acc + (Number(stock.shares) || 0) * (Number(stock.dividendPerShare) || 0),
    0
  );

  const realEstateIncome = ratRace.realEstates.reduce(
    (acc, item) => acc + (Number(item.cashFlow) || 0),
    0
  );

  const businessIncome = ratRace.businesses.reduce(
    (acc, item) => acc + (Number(item.cashFlow) || 0),
    0
  );

  const passiveIncome =
    interestIncome + dividendIncome + realEstateIncome + businessIncome;

  const totalIncome = (Number(ratRace.salary) || 0) + passiveIncome;

  const childrenExpense =
    (Number(ratRace.childrenCount) || 0) * (Number(ratRace.perChildCost) || 0);

  const bankLoanExpense = Math.round(
    (Number(ratRace.liabilities.bankLoans) || 0) * 0.1
  );

  const fixedExpenses =
    (Number(ratRace.expenses.taxes) || 0) +
    (Number(ratRace.expenses.homeMortgage) || 0) +
    (Number(ratRace.expenses.schoolLoan) || 0) +
    (Number(ratRace.expenses.carLoan) || 0) +
    (Number(ratRace.expenses.creditCard) || 0) +
    (Number(ratRace.expenses.retailDebt) || 0) +
    (Number(ratRace.expenses.otherExpenses) || 0);

  const totalExpenses = fixedExpenses + childrenExpense + bankLoanExpense;

  const monthlyCashFlow = totalIncome - totalExpenses;

  const freedomPercentage =
    totalExpenses > 0
      ? Math.min(100, Math.max(0, Math.round((passiveIncome / totalExpenses) * 100)))
      : 100;

  const canExitRatRace = passiveIncome > totalExpenses;

  const stocksValue = ratRace.stocks.reduce(
    (acc, s) => acc + (Number(s.shares) || 0) * (Number(s.costPerShare) || 0),
    0
  );
  const interestsValue = ratRace.interests.reduce(
    (acc, i) => acc + (Number(i.principal) || 0),
    0
  );
  const realEstateValue = ratRace.realEstates.reduce(
    (acc, r) => acc + (Number(r.cost) || 0),
    0
  );
  const businessValue = ratRace.businesses.reduce(
    (acc, b) => acc + (Number(b.cost) || 0),
    0
  );

  const totalAssetsCost =
    (Number(ratRace.savings) || 0) +
    stocksValue +
    interestsValue +
    realEstateValue +
    businessValue;

  const realEstateMortgages = ratRace.realEstates.reduce(
    (acc, r) => acc + (Number(r.mortgage) || 0),
    0
  );
  const businessLiabilities = ratRace.businesses.reduce(
    (acc, b) => acc + (Number(b.liability) || 0),
    0
  );

  const totalLiabilities =
    (Number(ratRace.liabilities.homeMortgage) || 0) +
    (Number(ratRace.liabilities.schoolLoan) || 0) +
    (Number(ratRace.liabilities.carLoan) || 0) +
    (Number(ratRace.liabilities.creditCard) || 0) +
    (Number(ratRace.liabilities.retailDebt) || 0) +
    (Number(ratRace.liabilities.bankLoans) || 0) +
    realEstateMortgages +
    businessLiabilities;

  return {
    interestIncome,
    dividendIncome,
    realEstateIncome,
    businessIncome,
    passiveIncome,
    totalIncome,
    childrenExpense,
    bankLoanExpense,
    totalExpenses,
    monthlyCashFlow,
    freedomPercentage,
    canExitRatRace,
    totalAssetsCost,
    totalLiabilities,
  };
}

export function calculateFastTrackMetrics(
  state: CashflowGameState
): ComputedFastTrackMetrics {
  const { fastTrack } = state;

  const businessesCashflow = fastTrack.businesses.reduce(
    (acc, b) => acc + (Number(b.monthlyCashflow) || 0),
    0
  );

  const currentCashflowDayIncome =
    (Number(fastTrack.initialCashflowDayIncome) || 0) + businessesCashflow;

  const cashflowGainProgress = businessesCashflow;
  const cashflowGainPercentage = Math.min(
    100,
    Math.max(0, Math.round((businessesCashflow / 50000) * 100))
  );
  const remainingToWinByCashflow = Math.max(0, 50000 - businessesCashflow);

  const hasWonByCashflow = businessesCashflow >= 50000;
  const hasWonByDream = Boolean(fastTrack.dreamPurchased);
  const hasWonGame = hasWonByCashflow || hasWonByDream;

  return {
    businessesCashflow,
    currentCashflowDayIncome,
    cashflowGainProgress,
    cashflowGainPercentage,
    remainingToWinByCashflow,
    hasWonByCashflow,
    hasWonByDream,
    hasWonGame,
  };
}

/**
 * Conforme a ficha `saida-corrida-dos-ratos.jpeg`:
 * "Seu Ingresso Passivo (do outro lado) - Aproxime-o a Milhares de Dólares"
 * Multiplicador de Compra: x 100
 */
export function calculateFastTrackTransition(passiveIncome: number): {
  roundedPassiveIncome: number;
  initialCashflowDayIncome: number;
  targetIncomeToWin: number;
} {
  const roundedPassiveIncome = Math.round(passiveIncome / 1000) * 1000;
  const effectivePassive =
    roundedPassiveIncome > 0 ? roundedPassiveIncome : passiveIncome;
  const initialCashflowDayIncome = effectivePassive * 100;
  const targetIncomeToWin = initialCashflowDayIncome + 50000;

  return {
    roundedPassiveIncome: effectivePassive,
    initialCashflowDayIncome,
    targetIncomeToWin,
  };
}

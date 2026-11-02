"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CashflowGameState, StandardDebtKey } from "@/types/cashflow";
import { formatCurrency } from "@/lib/cashflow-engine";
import { useLanguage } from "@/context/LanguageContext";
import { CheckCircle2, CreditCard, ShieldCheck } from "lucide-react";

interface PayDebtModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gameState: CashflowGameState;
  onPayDebt: (debtKey: StandardDebtKey, customAmount?: number) => boolean;
}

interface DebtItemConfig {
  key: StandardDebtKey;
  label: string;
  labelEn: string;
  liabilityAmount: number;
  monthlyExpenseSaved: number;
  allowPartial?: boolean;
}

export function PayDebtModal({
  open,
  onOpenChange,
  gameState,
  onPayDebt,
}: PayDebtModalProps) {
  const { language, t } = useLanguage();
  const { liabilities, expenses } = gameState.ratRace;
  const [bankPayAmount, setBankPayAmount] = React.useState(1000);

  React.useEffect(() => {
    if (open && liabilities.bankLoans > 0) {
      setBankPayAmount(Math.min(liabilities.bankLoans, 1000));
    }
  }, [open, liabilities.bankLoans]);

  const debtItems: DebtItemConfig[] = [
    {
      key: "bankLoans",
      label: "Empréstimo do Banco (Permite Amortização)",
      labelEn: "Bank Loan (Allows Partial Payoff)",
      liabilityAmount: liabilities.bankLoans,
      monthlyExpenseSaved: Math.round(liabilities.bankLoans * 0.1),
      allowPartial: true,
    },
    {
      key: "retailDebt",
      label: "Dívidas Casas Comerciais",
      labelEn: "Retail Store Debt",
      liabilityAmount: liabilities.retailDebt,
      monthlyExpenseSaved: expenses.retailDebt,
    },
    {
      key: "creditCard",
      label: "Cartões de Crédito",
      labelEn: "Credit Card Debt",
      liabilityAmount: liabilities.creditCard,
      monthlyExpenseSaved: expenses.creditCard,
    },
    {
      key: "carLoan",
      label: "Empréstimo do Automóvel",
      labelEn: "Car Loan",
      liabilityAmount: liabilities.carLoan,
      monthlyExpenseSaved: expenses.carLoan,
    },
    {
      key: "schoolLoan",
      label: "Dívidas Colégio / Faculdade",
      labelEn: "School / Student Loans",
      liabilityAmount: liabilities.schoolLoan,
      monthlyExpenseSaved: expenses.schoolLoan,
    },
    {
      key: "homeMortgage",
      label: "Hipoteca da Casa",
      labelEn: "Home Mortgage",
      liabilityAmount: liabilities.homeMortgage,
      monthlyExpenseSaved: expenses.homeMortgage,
    },
  ];

  const activeDebts = debtItems.filter((d) => d.liabilityAmount > 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between pr-6">
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-500" />
              {t.payDebtsBtn}
            </DialogTitle>
            <Badge variant="success">
              {t.cashOnHand}: {formatCurrency(gameState.cashOnHand)}
            </Badge>
          </div>
          <DialogDescription>
            {language === "en"
              ? "Paying off liabilities removes their monthly expense payment, reducing your Total Expenses and accelerating your exit from the Rat Race!"
              : "Ao quitar uma obrigação, o gasto mensal correspondente é eliminado, reduzindo seus Gastos Totais e aproximando você da saída da Corrida!"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2 max-h-[60vh] overflow-y-auto pr-1">
          {activeDebts.length === 0 ? (
            <div className="text-center py-8 space-y-2">
              <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto" />
              <h4 className="font-bold text-base">
                {language === "en"
                  ? "Congratulations! All personal debts are paid off!"
                  : "Parabéns! Todas as dívidas pessoais foram quitadas!"}
              </h4>
              <p className="text-xs text-muted-foreground">
                {language === "en"
                  ? "You have zero bank or personal financing obligations remaining."
                  : "Você não possui mais obrigações bancárias ou financiamentos pessoais."}
              </p>
            </div>
          ) : (
            activeDebts.map((debt) => {
              const canAffordFull =
                gameState.cashOnHand >= debt.liabilityAmount;
              const debtLabel = language === "en" ? debt.labelEn : debt.label;

              return (
                <div
                  key={debt.key}
                  className="p-3 sm:p-3.5 rounded-xl border bg-card flex flex-col gap-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="font-semibold text-xs sm:text-sm">{debtLabel}</div>
                      <div className="text-[11px] sm:text-xs text-muted-foreground">
                        {language === "en" ? "Principal Balance: " : "Saldo Devedor: "}
                        <strong className="text-rose-600 dark:text-rose-400">
                          {formatCurrency(debt.liabilityAmount)}
                        </strong>{" "}
                        • {language === "en" ? "Saves: " : "Economiza: "}
                        <strong className="text-emerald-600 dark:text-emerald-400">
                          +{formatCurrency(debt.monthlyExpenseSaved)}{t.perMonth}
                        </strong>
                      </div>
                    </div>

                    {!debt.allowPartial && (
                      <Button
                        size="sm"
                        variant={canAffordFull ? "cashflow" : "outline"}
                        disabled={!canAffordFull}
                        onClick={() => onPayDebt(debt.key)}
                        className="text-xs shrink-0 self-start sm:self-auto"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {language === "en" ? "Pay Off" : "Quitar"} ({formatCurrency(debt.liabilityAmount)})
                      </Button>
                    )}
                  </div>

                  {debt.allowPartial && (
                    <div className="flex flex-wrap items-center gap-2 pt-1 border-t">
                      <Input
                        type="number"
                        step={1000}
                        min={1000}
                        max={debt.liabilityAmount}
                        value={bankPayAmount}
                        onChange={(e) =>
                          setBankPayAmount(Number(e.target.value))
                        }
                        className="w-28 sm:w-32 h-8 text-xs"
                      />
                      <Button
                        size="sm"
                        variant="cashflow"
                        disabled={
                          gameState.cashOnHand < bankPayAmount ||
                          bankPayAmount <= 0
                        }
                        onClick={() => onPayDebt("bankLoans", bankPayAmount)}
                        className="text-xs h-8"
                      >
                        {language === "en" ? "Pay" : "Pagar"} {formatCurrency(bankPayAmount)}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={!canAffordFull}
                        onClick={() =>
                          onPayDebt("bankLoans", debt.liabilityAmount)
                        }
                        className="text-xs h-8"
                      >
                        {language === "en" ? "Pay All" : "Quitar Tudo"} ({formatCurrency(debt.liabilityAmount)})
                      </Button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t.close}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

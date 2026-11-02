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
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/cashflow-engine";
import { useLanguage } from "@/context/LanguageContext";
import { Landmark, Plus } from "lucide-react";

interface LoanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentBankLoan: number;
  cashOnHand: number;
  onTakeLoan: (amount: number) => void;
}

const LOAN_PRESETS = [1000, 2000, 3000, 5000, 10000, 20000];

export function LoanModal({
  open,
  onOpenChange,
  currentBankLoan,
  cashOnHand,
  onTakeLoan,
}: LoanModalProps) {
  const { language, t } = useLanguage();
  const [amount, setAmount] = React.useState(1000);

  const monthlyCost = Math.round(amount * 0.1);

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;
    onTakeLoan(amount);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between pr-6">
            <DialogTitle className="flex items-center gap-2">
              <Landmark className="w-5 h-5 text-amber-500" />
              {t.bankLoanBtn}
            </DialogTitle>
            <Badge variant="outline">
              {language === "en" ? "Current Loan: " : "Dívida Atual: "}
              {formatCurrency(currentBankLoan)}
            </Badge>
          </div>
          <DialogDescription>
            {language === "en"
              ? "In Cashflow, loans are taken in multiples of $1,000 at a 10% monthly interest rate added to expenses."
              : "No Cashflow, os empréstimos são concedidos em múltiplos de $ 1.000 com custo mensal de 10% nos gastos."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleConfirm} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">
              {language === "en" ? "Quick amount selection:" : "Escolha um valor rápido:"}
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {LOAN_PRESETS.map((preset) => (
                <Button
                  key={preset}
                  type="button"
                  variant={amount === preset ? "gold" : "outline"}
                  size="sm"
                  onClick={() => setAmount(preset)}
                  className="text-xs"
                >
                  <Plus className="w-3 h-3" />
                  {formatCurrency(preset)}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="loanAmount">{language === "en" ? "Loan Principal ($)" : "Valor do Empréstimo ($)"}</Label>
            <Input
              id="loanAmount"
              type="number"
              step={1000}
              min={1000}
              value={amount}
              onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
            />
          </div>

          <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-3.5 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {language === "en" ? "You receive in Cash on Hand:" : "Você recebe agora no Caixa:"}
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                +{formatCurrency(amount)} ({t.cashOnHand}: {formatCurrency(cashOnHand + amount)})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {language === "en" ? "Added to Monthly Expenses (10%):" : "Aumento nos Gastos Mensais (10%):"}
              </span>
              <span className="font-bold text-rose-600 dark:text-rose-400">
                +{formatCurrency(monthlyCost)} {t.perMonth}
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t.cancel}
            </Button>
            <Button type="submit" variant="gold">
              {language === "en" ? "Confirm Loan" : "Confirmar Empréstimo"} (+{formatCurrency(amount)})
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

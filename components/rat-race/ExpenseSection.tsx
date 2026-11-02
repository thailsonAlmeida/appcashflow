"use client";

import * as React from "react";
import { CashflowGameState, ComputedRatRaceMetrics } from "@/types/cashflow";
import { formatCurrency } from "@/lib/cashflow-engine";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Baby,
  CheckCircle2,
  Coins,
  HelpCircle,
  Minus,
  Plus,
} from "lucide-react";

interface ExpenseSectionProps {
  gameState: CashflowGameState;
  metrics: ComputedRatRaceMetrics;
  onAddChild: () => void;
  onRemoveChild: () => void;
  onReceivePayday: () => void;
  onOpenPayDebt: () => void;
}

export function ExpenseSection({
  gameState,
  metrics,
  onAddChild,
  onRemoveChild,
  onReceivePayday,
  onOpenPayDebt,
}: ExpenseSectionProps) {
  const { t } = useLanguage();
  const { expenses, liabilities, childrenCount, perChildCost } =
    gameState.ratRace;

  const expenseRows = [
    {
      label: t.taxes,
      tooltip: t.taxesHelp,
      amount: expenses.taxes,
      paidOff: false,
    },
    {
      label: t.homeMortgage,
      tooltip: t.homeMortgageHelp,
      amount: expenses.homeMortgage,
      paidOff: liabilities.homeMortgage === 0 && expenses.homeMortgage === 0,
    },
    {
      label: t.schoolLoan,
      tooltip: t.schoolLoanHelp,
      amount: expenses.schoolLoan,
      paidOff: liabilities.schoolLoan === 0 && expenses.schoolLoan === 0,
    },
    {
      label: t.carLoan,
      tooltip: t.carLoanHelp,
      amount: expenses.carLoan,
      paidOff: liabilities.carLoan === 0 && expenses.carLoan === 0,
    },
    {
      label: t.creditCard,
      tooltip: t.creditCardHelp,
      amount: expenses.creditCard,
      paidOff: liabilities.creditCard === 0 && expenses.creditCard === 0,
    },
    {
      label: t.retailDebt,
      tooltip: t.retailDebtHelp,
      amount: expenses.retailDebt,
      paidOff: liabilities.retailDebt === 0 && expenses.retailDebt === 0,
    },
    {
      label: t.otherExpenses,
      tooltip: t.otherExpensesHelp,
      amount: expenses.otherExpenses,
      paidOff: false,
    },
    {
      label: `${t.childExpenses} (${childrenCount}x ${formatCurrency(perChildCost)}):`,
      tooltip: t.childExpensesHelp.replace("{cost}", formatCurrency(perChildCost)),
      amount: metrics.childrenExpense,
      paidOff: false,
    },
    {
      label: `${t.bankLoanExpense}:`,
      tooltip: t.bankLoanExpenseHelp,
      amount: metrics.bankLoanExpense,
      paidOff: false,
      highlightBank: metrics.bankLoanExpense > 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
      {/* Coluna Esquerda: Tabela de GASTOS (Fiel a balanco-economico.jpeg) */}
      <div className="lg:col-span-7 border-2 border-slate-800 dark:border-purple-700 rounded-xl overflow-hidden bg-card shadow-xs">
        <div className="bg-cashflow-purple text-white px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <h3 className="font-black text-sm sm:text-base tracking-wide uppercase">
              {t.expensesTitle}
            </h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-3.5 h-3.5 text-purple-200 cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-xs">
                {t.totalExpensesHelp}
              </TooltipContent>
            </Tooltip>
          </div>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={onOpenPayDebt}
            className="h-6 px-2 text-xs text-amber-300 hover:text-amber-200 hover:bg-white/10 no-print truncate max-w-[200px] sm:max-w-none"
          >
            <span className="hidden sm:inline">{t.payDebtToReduceExpenses}</span>
            <span className="sm:hidden">{t.payDebtsBtn} →</span>
          </Button>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-purple-900/40 text-sm">
          {expenseRows.map((row) => (
            <div
              key={row.label}
              className={`grid grid-cols-12 items-center px-3 sm:px-4 py-2 ${
                row.highlightBank ? "bg-red-500/10" : ""
              }`}
            >
              <div className="col-span-8 flex items-center gap-1.5 min-w-0">
                <span
                  className={`truncate ${
                    row.paidOff
                      ? "line-through text-muted-foreground text-xs"
                      : "font-medium text-xs sm:text-sm"
                  }`}
                >
                  {row.label}
                </span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-3 h-3 text-muted-foreground cursor-pointer shrink-0" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-xs">{row.tooltip}</TooltipContent>
                </Tooltip>
                {row.paidOff && (
                  <Badge variant="success" className="text-[10px] py-0 px-1.5 ml-1 shrink-0">
                    <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" />
                    {t.paidOffBadge}
                  </Badge>
                )}
              </div>
              <div
                className={`col-span-4 text-right font-semibold text-xs sm:text-sm ${
                  row.amount > 0
                    ? "text-red-600 dark:text-red-400"
                    : "text-muted-foreground"
                }`}
              >
                {formatCurrency(row.amount)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coluna Direita: Caixa Número de Filhos, Total Gastos e Fluxo de Caixa Mensal */}
      <div className="lg:col-span-5 flex flex-col justify-between gap-4 border-2 border-slate-800 dark:border-purple-700 rounded-xl p-4 sm:p-5 bg-card shadow-xs">
        {/* Caixa: Número de Filhos (Idêntico ao retângulo na folha física) */}
        <div className="border-2 border-slate-700 dark:border-purple-600 rounded-xl p-3.5 sm:p-4 space-y-3 bg-muted/20">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-xs sm:text-sm font-black uppercase flex items-center gap-1.5">
                <Baby className="w-4 h-4 text-cyan-500 shrink-0" />
                <span>{t.numberOfChildren}:</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-pointer shrink-0" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-xs">
                    {t.childrenSubtext}
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="text-[10px] sm:text-[11px] text-muted-foreground">
                {t.childrenSubtext}
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 no-print shrink-0">
              <Button
                type="button"
                size="icon"
                variant="outline"
                disabled={childrenCount <= 0}
                onClick={onRemoveChild}
                className="h-7 w-7 sm:h-8 sm:w-8"
                aria-label="Remover filho"
              >
                <Minus className="w-3.5 h-3.5" />
              </Button>
              <span className="text-lg sm:text-xl font-black w-6 sm:w-8 text-center">
                {childrenCount}
              </span>
              <Button
                type="button"
                size="icon"
                variant="outline"
                disabled={childrenCount >= 3}
                onClick={onAddChild}
                className="h-7 w-7 sm:h-8 sm:w-8"
                aria-label="Adicionar filho"
              >
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-300 dark:border-purple-800 text-xs">
            <span className="font-semibold text-muted-foreground">
              {t.costPerChild}:
            </span>
            <span className="font-bold text-xs sm:text-sm">
              {formatCurrency(perChildCost)} / {t.addChildBtn.replace("+1 ", "").toLowerCase()}
            </span>
          </div>
        </div>

        {/* Total Gastos */}
        <div className="py-2 border-b-2 border-slate-800 dark:border-purple-700 flex items-baseline justify-between gap-2">
          <div className="text-sm sm:text-base font-black uppercase flex items-center gap-1.5">
            {t.totalExpenses}:
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-pointer shrink-0" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-xs">
                {t.totalExpensesHelp}
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400 shrink-0">
            {formatCurrency(metrics.totalExpenses)}
          </div>
        </div>

        {/* Fluxo de Caixa Mensal (Dia de Pagamento) */}
        <div className="rounded-xl bg-gradient-to-br from-amber-500/15 via-emerald-500/10 to-amber-500/15 border-2 border-amber-500/60 p-3.5 sm:p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-xs sm:text-sm font-black uppercase tracking-tight flex items-center gap-1">
                {t.monthlyCashflow}:
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-pointer shrink-0" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-xs">
                    {t.monthlyCashflowHelp.replace("{income}", formatCurrency(metrics.totalIncome)).replace("{expenses}", formatCurrency(metrics.totalExpenses))}
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="text-[11px] sm:text-xs font-semibold text-amber-700 dark:text-amber-300">
                {t.monthlyCashflowSubtext}
              </div>
            </div>

            <div
              className={`text-xl sm:text-2xl md:text-3xl font-black shrink-0 ${
                metrics.monthlyCashFlow >= 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {formatCurrency(metrics.monthlyCashFlow)}
            </div>
          </div>

          <Button
            type="button"
            variant="gold"
            size="sm"
            onClick={onReceivePayday}
            className="w-full gap-2 no-print font-bold text-xs sm:text-sm h-9"
          >
            <Coins className="w-4 h-4 shrink-0" />
            <span className="truncate">
              {t.receivePayday} ({formatCurrency(metrics.monthlyCashFlow)})
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}

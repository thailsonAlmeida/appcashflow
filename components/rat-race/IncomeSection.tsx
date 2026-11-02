"use client";

import * as React from "react";
import { CashflowGameState, ComputedRatRaceMetrics } from "@/types/cashflow";
import { formatCurrency } from "@/lib/cashflow-engine";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle, Plus, Trash2 } from "lucide-react";

interface IncomeSectionProps {
  gameState: CashflowGameState;
  metrics: ComputedRatRaceMetrics;
  onOpenAddAsset: (
    tab: "stock" | "realEstate" | "business" | "interest"
  ) => void;
  onRemoveInterest: (id: string) => void;
}

export function IncomeSection({
  gameState,
  metrics,
  onOpenAddAsset,
  onRemoveInterest,
}: IncomeSectionProps) {
  const { t } = useLanguage();
  const { ratRace, auditorName, professionName } = gameState;

  const dividendStocks = ratRace.stocks.filter(
    (s) => (s.dividendPerShare || 0) > 0
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
      {/* Coluna Esquerda: Tabela de INGRESSO (Idêntica à folha balanco-economico.jpeg) */}
      <div className="lg:col-span-7 border-2 border-slate-800 dark:border-purple-700 rounded-xl overflow-hidden bg-card shadow-xs">
        <div className="bg-cashflow-purple text-white px-3 sm:px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-black text-sm sm:text-base tracking-wide uppercase">
              {t.incomeTitle}
            </h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-3.5 h-3.5 text-purple-200 cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-xs">
                {t.totalIncomeHelp}
              </TooltipContent>
            </Tooltip>
          </div>
          <span className="text-[11px] sm:text-xs text-purple-200 font-medium">
            {t.incomeSubtitle}
          </span>
        </div>

        {/* Subcabeçalho */}
        <div className="grid grid-cols-12 bg-slate-100 dark:bg-purple-950/50 border-b border-slate-300 dark:border-purple-800 px-3 sm:px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <div className="col-span-8">{t.descriptionCol}</div>
          <div className="col-span-4 text-right">{t.cashflowCol}</div>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-purple-900/40 text-sm">
          {/* SALÁRIO */}
          <div className="grid grid-cols-12 items-center px-3 sm:px-4 py-2.5 bg-emerald-500/5">
            <div className="col-span-8 font-semibold flex items-center gap-1.5 text-xs sm:text-sm">
              <span className="truncate">
                {t.salary} ({professionName}):
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="w-3 h-3 text-muted-foreground cursor-pointer shrink-0" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs text-xs">
                  {t.salaryHelp}
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="col-span-4 text-right font-bold text-xs sm:text-sm text-emerald-600 dark:text-emerald-400">
              {formatCurrency(ratRace.salary)}
            </div>
          </div>

          {/* JUROS */}
          <div className="px-3 sm:px-4 py-2 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                {t.interest}:
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-3 h-3 text-muted-foreground cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-xs">
                    {t.interestHelp}
                  </TooltipContent>
                </Tooltip>
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onOpenAddAsset("interest")}
                className="h-6 px-2 text-xs text-cashflow-purple dark:text-amber-400 no-print"
              >
                <Plus className="w-3 h-3 mr-1" />
                {t.addInterest}
              </Button>
            </div>
            {ratRace.interests.length === 0 ? (
              <div className="grid grid-cols-12 text-xs text-muted-foreground italic py-0.5">
                <div className="col-span-8">{t.noInterestActive}</div>
                <div className="col-span-4 text-right">$ 0</div>
              </div>
            ) : (
              ratRace.interests.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 items-center text-xs py-1 bg-muted/30 rounded px-2"
                >
                  <div className="col-span-7 font-medium truncate">
                    {item.description}
                  </div>
                  <div className="col-span-4 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                    +{formatCurrency(item.cashFlow)}
                  </div>
                  <div className="col-span-1 text-right no-print">
                    <button
                      type="button"
                      onClick={() => onRemoveInterest(item.id)}
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                      title={t.delete}
                    >
                      <Trash2 className="w-3.5 h-3.5 inline" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* DIVIDENDOS */}
          <div className="px-3 sm:px-4 py-2 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                {t.dividends}:
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-3 h-3 text-muted-foreground cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-xs">
                    {t.dividendsHelp}
                  </TooltipContent>
                </Tooltip>
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onOpenAddAsset("stock")}
                className="h-6 px-2 text-xs text-cashflow-purple dark:text-amber-400 no-print"
              >
                <Plus className="w-3 h-3 mr-1" />
                {t.addStock}
              </Button>
            </div>
            {dividendStocks.length === 0 ? (
              <div className="grid grid-cols-12 text-xs text-muted-foreground italic py-0.5">
                <div className="col-span-8">{t.noDividendsActive}</div>
                <div className="col-span-4 text-right">$ 0</div>
              </div>
            ) : (
              dividendStocks.map((stk) => {
                const monthlyDiv = stk.shares * (stk.dividendPerShare || 0);
                return (
                  <div
                    key={stk.id}
                    className="grid grid-cols-12 items-center text-xs py-1 bg-muted/30 rounded px-2"
                  >
                    <div className="col-span-8 font-medium truncate">
                      {stk.symbol} ({stk.shares} {t.sharesLabel} ×{" "}
                      {formatCurrency(stk.dividendPerShare)}{t.perMonth})
                    </div>
                    <div className="col-span-4 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                      +{formatCurrency(monthlyDiv)}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* BENS MATERIAIS (IMÓVEIS) */}
          <div className="px-3 sm:px-4 py-2 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                {t.realEstate}:
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-3 h-3 text-muted-foreground cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-xs">
                    {t.realEstateHelp}
                  </TooltipContent>
                </Tooltip>
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onOpenAddAsset("realEstate")}
                className="h-6 px-2 text-xs text-cashflow-purple dark:text-amber-400 no-print"
              >
                <Plus className="w-3 h-3 mr-1" />
                {t.addRealEstate}
              </Button>
            </div>
            {ratRace.realEstates.length === 0 ? (
              <div className="grid grid-cols-12 text-xs text-muted-foreground italic py-0.5">
                <div className="col-span-8">{t.noRealEstateActive}</div>
                <div className="col-span-4 text-right">$ 0</div>
              </div>
            ) : (
              ratRace.realEstates.map((re) => (
                <div
                  key={re.id}
                  className="grid grid-cols-12 items-center text-xs py-1 bg-muted/30 rounded px-2"
                >
                  <div className="col-span-8 font-medium truncate">
                    {re.description}
                  </div>
                  <div
                    className={`col-span-4 text-right font-semibold ${
                      re.cashFlow >= 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {re.cashFlow >= 0 ? "+" : ""}
                    {formatCurrency(re.cashFlow)}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* NEGÓCIOS */}
          <div className="px-3 sm:px-4 py-2 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                {t.businesses}:
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-3 h-3 text-muted-foreground cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-xs">
                    {t.businessesHelp}
                  </TooltipContent>
                </Tooltip>
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onOpenAddAsset("business")}
                className="h-6 px-2 text-xs text-cashflow-purple dark:text-amber-400 no-print"
              >
                <Plus className="w-3 h-3 mr-1" />
                {t.addBusiness}
              </Button>
            </div>
            {ratRace.businesses.length === 0 ? (
              <div className="grid grid-cols-12 text-xs text-muted-foreground italic py-0.5">
                <div className="col-span-8">{t.noBusinessesActive}</div>
                <div className="col-span-4 text-right">$ 0</div>
              </div>
            ) : (
              ratRace.businesses.map((biz) => (
                <div
                  key={biz.id}
                  className="grid grid-cols-12 items-center text-xs py-1 bg-muted/30 rounded px-2"
                >
                  <div className="col-span-8 font-medium truncate">
                    {biz.description}
                  </div>
                  <div
                    className={`col-span-4 text-right font-semibold ${
                      biz.cashFlow >= 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {biz.cashFlow >= 0 ? "+" : ""}
                    {formatCurrency(biz.cashFlow)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Coluna Direita: Auditor, Ingresso Passivo e Total Ingressos (Fiel à folha balanco-economico.jpeg) */}
      <div className="lg:col-span-5 flex flex-col justify-between gap-4 border-2 border-slate-800 dark:border-purple-700 rounded-xl p-4 sm:p-5 bg-card shadow-xs">
        {/* Bloco Auditor */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="bg-cashflow-purple text-white text-xs font-black uppercase px-2.5 py-1 rounded">
              {t.auditor}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {t.auditorPersonAtRight}
            </span>
          </div>
          <div className="border-b-2 border-slate-400 dark:border-purple-600 py-1 px-1 text-sm font-semibold">
            {auditorName ? (
              auditorName
            ) : (
              <span className="text-muted-foreground italic font-normal text-xs">
                {t.auditorNotSet}
              </span>
            )}
          </div>
        </div>

        {/* Bloco Ingresso Passivo */}
        <div className="space-y-1.5 bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3.5 sm:p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
              {t.passiveIncomeLabel} =
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-pointer shrink-0" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs text-xs">
                  {t.passiveIncomeCalcHelp}
                </TooltipContent>
              </Tooltip>
            </span>
            <span className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 px-2">
              {formatCurrency(metrics.passiveIncome)}
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-muted-foreground leading-relaxed">
            ({t.interest} + {t.dividends} + {t.realEstate} + {t.businesses})
          </p>
        </div>

        {/* Bloco Total Ingressos */}
        <div className="pt-2 border-t border-dashed border-slate-300 dark:border-purple-800">
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <div className="text-[11px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                {t.salary} + {t.passiveIncomeLabel}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-3 h-3 text-muted-foreground cursor-pointer shrink-0" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-xs">
                    {t.totalIncomeHelp}
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="text-sm sm:text-base font-black uppercase tracking-tight">
                {t.totalIncome}:
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 border-b-4 border-double border-slate-800 dark:border-amber-400 px-2 shrink-0">
              {formatCurrency(metrics.totalIncome)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

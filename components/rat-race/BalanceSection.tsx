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
import { ArrowLeftRight, CreditCard, HelpCircle, Landmark, Plus } from "lucide-react";

interface BalanceSectionProps {
  gameState: CashflowGameState;
  metrics: ComputedRatRaceMetrics;
  onOpenAddAsset: (
    tab: "stock" | "realEstate" | "business" | "interest"
  ) => void;
  onOpenSellAsset: () => void;
  onOpenPayDebt: () => void;
  onOpenLoan: () => void;
}

export function BalanceSection({
  gameState,
  metrics,
  onOpenAddAsset,
  onOpenSellAsset,
  onOpenPayDebt,
  onOpenLoan,
}: BalanceSectionProps) {
  const { t } = useLanguage();
  const { ratRace } = gameState;
  const { liabilities } = ratRace;

  return (
    <div className="space-y-2">
      <div className="text-center">
        <h3 className="text-base sm:text-lg font-black uppercase tracking-widest text-cashflow-purple dark:text-amber-400">
          {t.balanceTitle}
        </h3>
      </div>

      <div className="border-2 border-slate-800 dark:border-purple-700 rounded-xl overflow-hidden bg-card shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x-2 divide-slate-800 dark:divide-purple-700">
          {/* COLUNA ESQUERDA: ATIVOS */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="bg-cashflow-purple text-white px-3 sm:px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-black text-sm sm:text-base uppercase tracking-wide">
                    {t.assetsTitle}
                  </h4>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="w-3.5 h-3.5 text-purple-200 cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs text-xs">
                      {t.assetsHelp}
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex items-center gap-1.5 no-print">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={onOpenSellAsset}
                    className="h-6 px-2 text-xs text-cyan-300 hover:text-cyan-200 hover:bg-white/10"
                  >
                    <ArrowLeftRight className="w-3 h-3 mr-1" />
                    {t.marketSellBtn}
                  </Button>
                </div>
              </div>

              <div className="divide-y divide-slate-200 dark:divide-purple-900/40 text-xs sm:text-sm">
                {/* Economias */}
                <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 bg-slate-50/60 dark:bg-purple-950/20">
                  <span className="font-semibold flex items-center gap-1">
                    {t.savingsLabel}:
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="w-3 h-3 text-muted-foreground cursor-pointer shrink-0" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs text-xs">
                        {t.savingsHelp}
                      </TooltipContent>
                    </Tooltip>
                  </span>
                  <span className="font-bold text-muted-foreground">
                    {formatCurrency(ratRace.savings)}
                  </span>
                </div>

                {/* Ações / Mútuos / CDs */}
                <div className="p-3 sm:p-4 space-y-2">
                  {/* Desktop header */}
                  <div className="hidden sm:grid grid-cols-12 items-center font-bold text-xs uppercase text-muted-foreground border-b pb-1">
                    <div className="col-span-5 flex items-center gap-1">
                      <span>{t.stocksCDsLabel}</span>
                      <button
                        type="button"
                        onClick={() => onOpenAddAsset("stock")}
                        className="text-cashflow-purple dark:text-amber-400 hover:underline ml-1 cursor-pointer no-print"
                      >
                        [+{t.buyAssetBtn}]
                      </button>
                    </div>
                    <div className="col-span-3 text-center">{t.numSharesLabel}</div>
                    <div className="col-span-4 text-right">{t.costPerShareLabel}</div>
                  </div>

                  {/* Mobile header */}
                  <div className="flex sm:hidden items-center justify-between font-bold text-xs uppercase text-muted-foreground border-b pb-1">
                    <span>{t.stocksCDsLabel}</span>
                    <button
                      type="button"
                      onClick={() => onOpenAddAsset("stock")}
                      className="text-cashflow-purple dark:text-amber-400 text-xs hover:underline cursor-pointer no-print"
                    >
                      +{t.buyAssetBtn}
                    </button>
                  </div>

                  {ratRace.stocks.length === 0 ? (
                    <div className="text-xs text-muted-foreground italic py-1">
                      {t.noStocksActive}
                    </div>
                  ) : (
                    ratRace.stocks.map((stk) => (
                      <div
                        key={stk.id}
                        className="p-2 sm:p-1 sm:grid sm:grid-cols-12 items-center text-xs bg-muted/30 rounded"
                      >
                        {/* Mobile stacked view */}
                        <div className="sm:hidden flex items-center justify-between gap-2">
                          <span className="font-bold text-foreground text-xs">{stk.symbol}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-muted-foreground">
                              {stk.shares} {t.sharesLabel}
                            </span>
                            <span className="font-semibold text-foreground text-xs">
                              {formatCurrency(stk.costPerShare)}
                            </span>
                          </div>
                        </div>

                        {/* Desktop row view */}
                        <div className="hidden sm:block col-span-5 font-bold truncate">{stk.symbol}</div>
                        <div className="hidden sm:block col-span-3 text-center font-medium">
                          {stk.shares}
                        </div>
                        <div className="hidden sm:block col-span-4 text-right font-semibold">
                          {formatCurrency(stk.costPerShare)}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Bens Materiais */}
                <div className="p-3 sm:p-4 space-y-2">
                  {/* Desktop header */}
                  <div className="hidden sm:grid grid-cols-12 items-center font-bold text-xs uppercase text-muted-foreground border-b pb-1">
                    <div className="col-span-5 flex items-center gap-1">
                      <span>{t.realEstateLabel}</span>
                      <button
                        type="button"
                        onClick={() => onOpenAddAsset("realEstate")}
                        className="text-cashflow-purple dark:text-amber-400 hover:underline ml-1 cursor-pointer no-print"
                      >
                        [+{t.buyAssetBtn}]
                      </button>
                    </div>
                    <div className="col-span-3 text-center">{t.downPaymentLabel}</div>
                    <div className="col-span-4 text-right">{t.totalCostLabel}</div>
                  </div>

                  {/* Mobile header */}
                  <div className="flex sm:hidden items-center justify-between font-bold text-xs uppercase text-muted-foreground border-b pb-1">
                    <span>{t.realEstateLabel}</span>
                    <button
                      type="button"
                      onClick={() => onOpenAddAsset("realEstate")}
                      className="text-cashflow-purple dark:text-amber-400 text-xs hover:underline cursor-pointer no-print"
                    >
                      +{t.buyAssetBtn}
                    </button>
                  </div>

                  {ratRace.realEstates.length === 0 ? (
                    <div className="text-xs text-muted-foreground italic py-1">
                      {t.noRealEstateRecorded}
                    </div>
                  ) : (
                    ratRace.realEstates.map((re) => (
                      <div
                        key={re.id}
                        className="p-2 sm:p-1 sm:grid sm:grid-cols-12 items-center text-xs bg-muted/30 rounded"
                      >
                        {/* Mobile stacked view */}
                        <div className="sm:hidden flex flex-col gap-1">
                          <div className="font-semibold text-foreground truncate">{re.description}</div>
                          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                            <span>
                              {t.downPaymentLabel}: <strong className="text-foreground">{formatCurrency(re.downPayment)}</strong>
                            </span>
                            <span>
                              {t.totalCostLabel}: <strong className="text-foreground">{formatCurrency(re.cost)}</strong>
                            </span>
                          </div>
                        </div>

                        {/* Desktop row view */}
                        <div className="hidden sm:block col-span-5 font-semibold truncate">
                          {re.description}
                        </div>
                        <div className="hidden sm:block col-span-3 text-center">
                          {formatCurrency(re.downPayment)}
                        </div>
                        <div className="hidden sm:block col-span-4 text-right font-semibold">
                          {formatCurrency(re.cost)}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Negócios */}
                <div className="p-3 sm:p-4 space-y-2">
                  {/* Desktop header */}
                  <div className="hidden sm:grid grid-cols-12 items-center font-bold text-xs uppercase text-muted-foreground border-b pb-1">
                    <div className="col-span-5 flex items-center gap-1">
                      <span>{t.businessesLabel}</span>
                      <button
                        type="button"
                        onClick={() => onOpenAddAsset("business")}
                        className="text-cashflow-purple dark:text-amber-400 hover:underline ml-1 cursor-pointer no-print"
                      >
                        [+{t.buyAssetBtn}]
                      </button>
                    </div>
                    <div className="col-span-3 text-center">{t.downPaymentLabel}</div>
                    <div className="col-span-4 text-right">{t.totalCostLabel}</div>
                  </div>

                  {/* Mobile header */}
                  <div className="flex sm:hidden items-center justify-between font-bold text-xs uppercase text-muted-foreground border-b pb-1">
                    <span>{t.businessesLabel}</span>
                    <button
                      type="button"
                      onClick={() => onOpenAddAsset("business")}
                      className="text-cashflow-purple dark:text-amber-400 text-xs hover:underline cursor-pointer no-print"
                    >
                      +{t.buyAssetBtn}
                    </button>
                  </div>

                  {ratRace.businesses.length === 0 ? (
                    <div className="text-xs text-muted-foreground italic py-1">
                      {t.noBusinessesRecorded}
                    </div>
                  ) : (
                    ratRace.businesses.map((biz) => (
                      <div
                        key={biz.id}
                        className="p-2 sm:p-1 sm:grid sm:grid-cols-12 items-center text-xs bg-muted/30 rounded"
                      >
                        {/* Mobile stacked view */}
                        <div className="sm:hidden flex flex-col gap-1">
                          <div className="font-semibold text-foreground truncate">{biz.description}</div>
                          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                            <span>
                              {t.downPaymentLabel}: <strong className="text-foreground">{formatCurrency(biz.downPayment)}</strong>
                            </span>
                            <span>
                              {t.totalCostLabel}: <strong className="text-foreground">{formatCurrency(biz.cost)}</strong>
                            </span>
                          </div>
                        </div>

                        {/* Desktop row view */}
                        <div className="hidden sm:block col-span-5 font-semibold truncate">
                          {biz.description}
                        </div>
                        <div className="hidden sm:block col-span-3 text-center">
                          {formatCurrency(biz.downPayment)}
                        </div>
                        <div className="hidden sm:block col-span-4 text-right font-semibold">
                          {formatCurrency(biz.cost)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Rodapé Soma de Ativos */}
            <div className="bg-slate-100 dark:bg-purple-950/60 px-3 sm:px-4 py-2.5 border-t flex items-center justify-between text-xs font-bold">
              <span>{t.totalAssetsCost}:</span>
              <span className="text-emerald-600 dark:text-emerald-400 text-sm">
                {formatCurrency(metrics.totalAssetsCost)}
              </span>
            </div>
          </div>

          {/* COLUNA DIREITA: OBRIGAÇÕES */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="bg-cashflow-purple text-white px-3 sm:px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-black text-sm sm:text-base uppercase tracking-wide">
                    {t.liabilitiesTitle}
                  </h4>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="w-3.5 h-3.5 text-purple-200 cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs text-xs">
                      {t.liabilitiesHelp}
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex items-center gap-1.5 no-print">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={onOpenPayDebt}
                    className="h-6 px-2 text-xs text-emerald-300 hover:text-emerald-200 hover:bg-white/10"
                  >
                    <CreditCard className="w-3 h-3 mr-1" />
                    {t.payDebtsBtn}
                  </Button>
                </div>
              </div>

              <div className="divide-y divide-slate-200 dark:divide-purple-900/40 text-xs sm:text-sm">
                <div className="flex items-center justify-between px-3 sm:px-4 py-2">
                  <span>{t.homeMortgage}</span>
                  <span className="font-semibold">
                    {formatCurrency(liabilities.homeMortgage)}
                  </span>
                </div>

                <div className="flex items-center justify-between px-3 sm:px-4 py-2">
                  <span>{t.schoolLoan}</span>
                  <span className="font-semibold">
                    {formatCurrency(liabilities.schoolLoan)}
                  </span>
                </div>

                <div className="flex items-center justify-between px-3 sm:px-4 py-2">
                  <span>{t.carLoan}</span>
                  <span className="font-semibold">
                    {formatCurrency(liabilities.carLoan)}
                  </span>
                </div>

                <div className="flex items-center justify-between px-3 sm:px-4 py-2">
                  <span>{t.creditCard}</span>
                  <span className="font-semibold">
                    {formatCurrency(liabilities.creditCard)}
                  </span>
                </div>

                <div className="flex items-center justify-between px-3 sm:px-4 py-2">
                  <span>{t.retailDebt}</span>
                  <span className="font-semibold">
                    {formatCurrency(liabilities.retailDebt)}
                  </span>
                </div>

                {/* Hipotecas de Bens Materiais */}
                <div className="px-3 sm:px-4 py-2.5 space-y-1">
                  <div className="font-bold text-xs uppercase text-muted-foreground">
                    {t.mortgageLiabilitiesLabel}:
                  </div>
                  {ratRace.realEstates.length === 0 ? (
                    <div className="text-xs text-muted-foreground italic">
                      {t.noMortgagesActive}
                    </div>
                  ) : (
                    ratRace.realEstates.map((re) => (
                      <div
                        key={re.id}
                        className="flex justify-between text-xs py-0.5"
                      >
                        <span className="truncate pr-2">{re.description}:</span>
                        <span className="font-semibold shrink-0">
                          {formatCurrency(re.mortgage)}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {/* Obrigações (Negócios) */}
                <div className="px-3 sm:px-4 py-2.5 space-y-1">
                  <div className="font-bold text-xs uppercase text-muted-foreground">
                    {t.businessLiabilitiesLabel}:
                  </div>
                  {ratRace.businesses.length === 0 ? (
                    <div className="text-xs text-muted-foreground italic">
                      {t.noBusinessLiabilities}
                    </div>
                  ) : (
                    ratRace.businesses.map((biz) => (
                      <div
                        key={biz.id}
                        className="flex justify-between text-xs py-0.5"
                      >
                        <span className="truncate pr-2">
                          {biz.description}:
                        </span>
                        <span className="font-semibold shrink-0">
                          {formatCurrency(biz.liability)}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {/* Empréstimo do Banco */}
                <div className="flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 py-2.5 bg-amber-500/5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm">{t.bankLoanLiability}:</span>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={onOpenLoan}
                      className="h-6 px-2 text-[11px] no-print"
                    >
                      <Landmark className="w-3 h-3 mr-1 text-amber-500" />
                      <Plus className="w-2.5 h-2.5" />
                      {t.bankLoanBtn}
                    </Button>
                  </div>
                  <Badge
                    variant={
                      liabilities.bankLoans > 0 ? "destructive" : "outline"
                    }
                  >
                    {formatCurrency(liabilities.bankLoans)}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Rodapé Soma de Obrigações */}
            <div className="bg-slate-100 dark:bg-purple-950/60 px-3 sm:px-4 py-2.5 border-t flex items-center justify-between text-xs font-bold">
              <span>{t.totalLiabilities}:</span>
              <span className="text-rose-600 dark:text-rose-400 text-sm">
                {formatCurrency(metrics.totalLiabilities)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Nota de Rodapé Original da Folha Física */}
      <div className="text-[11px] text-muted-foreground px-1">
        <strong>Nota:</strong> {t.cdNote}
      </div>
    </div>
  );
}

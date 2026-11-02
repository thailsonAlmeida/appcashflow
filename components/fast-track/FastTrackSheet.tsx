"use client";

import * as React from "react";
import {
  CashflowGameState,
  ComputedFastTrackMetrics,
  ComputedRatRaceMetrics,
} from "@/types/cashflow";
import { formatCurrency } from "@/lib/cashflow-engine";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { VictoryCelebration } from "@/components/fast-track/VictoryCelebration";
import { FastTrackBusinessModal } from "@/components/fast-track/FastTrackBusinessModal";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Coins,
  Plus,
  Rocket,
  Scale,
  Sparkles,
  Trash2,
} from "lucide-react";

interface FastTrackSheetProps {
  gameState: CashflowGameState;
  ratRaceMetrics: ComputedRatRaceMetrics;
  fastTrackMetrics: ComputedFastTrackMetrics;
  onReceivePayday: () => void;
  onBuyFastTrackBusiness: (data: {
    description: string;
    cost: number;
    monthlyCashflow: number;
    deductFromCash?: boolean;
  }) => boolean;
  onRemoveFastTrackBusiness: (id: string) => void;
  onPurchaseDream: (cost?: number) => boolean;
  onAdjustCash: (
    amount: number,
    mode: "add" | "subtract" | "set",
    reason: string
  ) => boolean | undefined;
  onBackToRatRace: () => void;
}

export function FastTrackSheet({
  gameState,
  ratRaceMetrics,
  fastTrackMetrics,
  onReceivePayday,
  onBuyFastTrackBusiness,
  onRemoveFastTrackBusiness,
  onPurchaseDream,
  onAdjustCash,
  onBackToRatRace,
}: FastTrackSheetProps) {
  const { t } = useLanguage();
  const [bizModalOpen, setBizModalOpen] = React.useState(false);

  const { fastTrack, playerName, auditorName } = gameState;

  const passiveFromRatRace =
    fastTrack.passiveIncomeFromRatRace > 0
      ? fastTrack.passiveIncomeFromRatRace
      : Math.round(ratRaceMetrics.passiveIncome / 1000) * 1000 ||
        ratRaceMetrics.passiveIncome;

  const initialIncome =
    fastTrack.initialCashflowDayIncome > 0
      ? fastTrack.initialCashflowDayIncome
      : passiveFromRatRace * 100;

  const targetToWin = initialIncome + 50000;

  // Cálculo acumulado linha a linha igual na folha física
  let runningTotal = initialIncome;
  const rowsWithRunningTotal = fastTrack.businesses.map((biz) => {
    runningTotal += biz.monthlyCashflow;
    return {
      ...biz,
      accumulatedIncome: runningTotal,
    };
  });

  const canAffordDream = gameState.cashOnHand >= gameState.selectedDreamCost;

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Banner de Celebração de Vitória (se venceu por Sonho ou +$50.000) */}
      <VictoryCelebration
        gameState={gameState}
        metrics={fastTrackMetrics}
      />

      {/* Barra de Ações Rápidas da Pista Rápida */}
      <div className="rounded-xl border bg-card p-2.5 sm:p-3.5 shadow-xs flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 sm:pb-3.5 sm:flex-wrap no-scrollbar">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-1 shrink-0 hidden md:inline">
          {t.phaseFastTrack}:
        </span>

        <Button
          size="sm"
          variant="gold"
          onClick={() => setBizModalOpen(true)}
          className="text-xs gap-1.5 shrink-0 h-8"
        >
          <Plus className="w-3.5 h-3.5 shrink-0" />
          <span>{t.addFastTrackBusinessBtn}</span>
        </Button>

        <Button
          size="sm"
          variant="cashflow"
          onClick={onReceivePayday}
          className="text-xs gap-1.5 shrink-0 h-8"
        >
          <Coins className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>
            {t.receivePayday} (
            {formatCurrency(
              fastTrackMetrics.currentCashflowDayIncome || initialIncome
            )}
            )
          </span>
        </Button>

        {/* Comprar o Sonho */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="sm"
              variant={fastTrack.dreamPurchased ? "secondary" : "cyan"}
              disabled={fastTrack.dreamPurchased}
              className="text-xs gap-1.5 shrink-0 h-8"
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>
                {fastTrack.dreamPurchased
                  ? `${t.dream} 🏆`
                  : `${t.buyDreamBtn}: ${gameState.selectedDreamName}`}
              </span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {gameState.selectedDreamName} ({formatCurrency(gameState.selectedDreamCost)})
              </AlertDialogTitle>
              <AlertDialogDescription>
                {formatCurrency(gameState.selectedDreamCost)} | {t.cashOnHand}:{" "}
                <strong>{formatCurrency(gameState.cashOnHand)}</strong>.
                {!canAffordDream && (
                  <span className="block mt-2 text-rose-500 font-semibold">
                    {t.noUndo}
                  </span>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
              <AlertDialogAction
                disabled={!canAffordDream}
                onClick={() => onPurchaseDream()}
                className="bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold"
              >
                {t.confirm}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Casas de Revés: Auditoria / Processo (Perde metade do caixa) */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="text-xs gap-1.5 shrink-0 h-8 text-amber-700 dark:text-amber-300"
            >
              <Scale className="w-3.5 h-3.5 shrink-0" />
              <span>{t.taxAuditBtn}</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t.taxAuditBtn}
              </AlertDialogTitle>
              <AlertDialogDescription>
                <strong>{formatCurrency(Math.floor(gameState.cashOnHand / 2))}</strong>.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  onAdjustCash(
                    Math.floor(gameState.cashOnHand / 2),
                    "subtract",
                    "Auditoria / Processo Judicial (-50% do Caixa)"
                  )
                }
              >
                {t.confirm}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Divórcio (Perde 100% do caixa) */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="text-xs gap-1.5 shrink-0 h-8 text-rose-600 dark:text-rose-400"
            >
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>{t.divorceBtn}</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t.divorceBtn}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {formatCurrency(gameState.cashOnHand)}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  onAdjustCash(0, "set", "Divórcio na Pista Rápida (Caixa zerado)")
                }
              >
                {t.confirm}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button
          size="sm"
          variant="ghost"
          onClick={onBackToRatRace}
          className="text-xs gap-1 shrink-0 h-8 sm:ml-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
          <span>{t.backToRatRaceBtn}</span>
        </Button>
      </div>

      {/* FOLHA FÍSICA 1:1 DA PISTA RÁPIDA (saida-corrida-dos-ratos.jpeg) */}
      <div className="rounded-2xl border-2 border-slate-300 dark:border-purple-800 bg-white dark:bg-[#220c29] p-4 sm:p-8 shadow-md space-y-6 sm:space-y-8">
        {/* SEÇÃO SUPERIOR: Parabéns + Nome/Auditor + Compra de seus Ativos */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Coluna Esquerda: Parabéns & Objetivos */}
          <div className="lg:col-span-6 space-y-3 sm:space-y-4">
            <div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-cashflow-purple dark:text-amber-400">
                {t.congratulations}
              </h2>
              <p className="text-sm sm:text-lg font-extrabold text-foreground mt-0.5">
                {t.escapedRatRace}
              </p>
            </div>

            <div className="space-y-1.5 text-xs sm:text-sm">
              <div className="font-bold italic underline">{t.newObjectives}:</div>
              <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
                <li>
                  {t.objective1.replace("{dream}", gameState.selectedDreamName)}
                </li>
                <li>
                  {t.objective2}
                </li>
              </ol>
            </div>

            <div className="space-y-1 text-xs sm:text-sm pt-1">
              <div className="font-bold italic underline">{t.youWinIf}</div>
              <div className="space-y-1 text-muted-foreground">
                <p>{t.winConditionA}</p>
                <p className="text-center font-bold text-foreground py-0.5">
                  - {t.orDivider} -
                </p>
                <p>
                  {t.winConditionB}
                </p>
              </div>
            </div>
          </div>

          {/* Coluna Direita: Nome, Auditor e Quadro "Compra de seus Ativos" */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <span className="bg-cashflow-purple text-white text-xs font-black uppercase px-2.5 py-1 rounded inline-block mb-1">
                  {t.name}
                </span>
                <div className="border-b-2 border-slate-800 dark:border-purple-600 py-1 font-bold text-sm">
                  {playerName}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="bg-cashflow-purple text-white text-xs font-black uppercase px-2.5 py-1 rounded">
                    {t.auditor}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {t.auditorPersonAtRight}
                  </span>
                </div>
                <div className="border-b-2 border-slate-800 dark:border-purple-600 py-1 font-bold text-sm">
                  {auditorName || "—"}
                </div>
              </div>
            </div>

            {/* Quadro: Compra de seus Ativos */}
            <div className="border-2 border-slate-900 dark:border-purple-600 rounded-xl overflow-hidden">
              <div className="bg-cashflow-purple text-white text-center py-2 px-3 sm:px-4 font-black text-xs sm:text-sm uppercase tracking-wider">
                {t.assetPurchaseTitle}
              </div>
              <div className="p-3.5 sm:p-4 space-y-3 text-xs sm:text-sm bg-card">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <div>
                    <div className="font-semibold text-xs sm:text-sm">
                      {t.passiveIncomeFromOtherSide}
                    </div>
                    <div className="text-[10px] sm:text-[11px] italic text-muted-foreground">
                      {t.roundToThousands}
                    </div>
                  </div>
                  <div className="font-bold text-sm sm:text-base border-b-2 border-slate-800 dark:border-purple-500 px-2 sm:px-3 text-right">
                    {formatCurrency(passiveFromRatRace)}
                  </div>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="font-semibold text-xs sm:text-sm">{t.purchaseMultiplier}</span>
                  <Badge variant="gold" className="text-xs sm:text-sm font-black px-2.5 sm:px-3">
                    × 100
                  </Badge>
                </div>

                <div className="pt-2 border-t flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <div>
                    <div className="font-bold text-xs sm:text-sm">
                      {t.initialCashflowDayIncome}
                    </div>
                    <div className="text-[10px] sm:text-[11px] italic text-muted-foreground">
                      {t.receiveNowAndEveryPayday}
                    </div>
                  </div>
                  <div className="font-black text-base sm:text-lg text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 px-2 text-right">
                    {formatCurrency(initialIncome)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEÇÃO DO MEIO: Quadro "Como GANHAR ?" + Texto Explicativo 100x */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Quadro Como GANHAR ? */}
          <div className="lg:col-span-6 border-2 border-slate-900 dark:border-purple-600 rounded-xl overflow-hidden">
            <div className="bg-cashflow-purple text-white text-center py-2 px-3 sm:px-4 font-black text-xs sm:text-sm uppercase tracking-wider">
              {t.howToWinTitle}
            </div>
            <div className="p-3.5 sm:p-4 space-y-3 text-xs sm:text-sm bg-card">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs sm:text-sm">{t.initialCashflowIncomeLine}</span>
                <span className="font-bold border-b border-slate-400 px-2 text-xs sm:text-sm shrink-0">
                  = {formatCurrency(initialIncome)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-xs sm:text-sm">{t.cashflowRequiredToWin}</span>
                <span className="font-bold text-amber-600 dark:text-amber-400 border-b border-slate-400 px-2 text-xs sm:text-sm shrink-0">
                  + $ 50.000
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pt-2 border-t">
                <div className="font-bold text-xs sm:text-sm">
                  {t.targetIncomeToWinLine}
                </div>
                <div className="font-black text-base sm:text-lg text-cashflow-purple dark:text-amber-400 border-b-2 border-slate-800 dark:border-amber-400 px-2 text-right shrink-0">
                  = {formatCurrency(targetToWin)}
                </div>
              </div>

              {/* Barra de Progresso dos +$50.000 */}
              <div className="pt-2 space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span>
                    {t.progressLabel} (+{formatCurrency(fastTrackMetrics.businessesCashflow)}{" "}
                    / $ 50.000)
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {fastTrackMetrics.cashflowGainPercentage}%
                  </span>
                </div>
                <Progress value={fastTrackMetrics.cashflowGainPercentage} />
              </div>
            </div>
          </div>

          {/* Texto Motivacional da Folha Original */}
          <div className="lg:col-span-6 space-y-2 sm:space-y-3 text-xs sm:text-sm bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 sm:p-5">
            <div className="font-black text-xs sm:text-sm uppercase text-cashflow-purple dark:text-amber-400">
              {t.receive100xReasonTitle}
            </div>
            <p className="font-bold text-foreground">
              {t.provedFinancialIntelligence}
            </p>
            <p className="text-muted-foreground leading-relaxed text-xs sm:text-sm">
              {t.investmentsProsperedDesc}
            </p>
          </div>
        </div>

        {/* SEÇÃO INFERIOR: Tabela "Registro do seu Ingresso para o Dia de Cashflow" */}
        <div className="border-2 border-slate-900 dark:border-purple-600 rounded-xl overflow-hidden">
          <div className="bg-cashflow-purple text-white py-2.5 px-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="font-black text-xs sm:text-base uppercase tracking-wide">
              {t.cashflowDayLogTitle}
            </h3>
            <Button
              type="button"
              size="sm"
              variant="gold"
              onClick={() => setBizModalOpen(true)}
              className="h-7 text-xs gap-1 w-full sm:w-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.addFastTrackBusinessBtn}</span>
            </Button>
          </div>

          <div className="p-3 sm:p-6 space-y-3 sm:space-y-4 bg-card">
            <div className="flex items-center justify-between border-b-2 border-slate-300 dark:border-purple-800 pb-2.5 sm:pb-3">
              <span className="font-bold text-xs sm:text-sm">
                {t.initialCashflowDayIncomeHeader}:
              </span>
              <span className="font-black text-base sm:text-lg text-emerald-600 dark:text-emerald-400">
                {formatCurrency(initialIncome)}
              </span>
            </div>

            {/* Cabeçalho das 3 colunas (visível no desktop) */}
            <div className="hidden sm:grid grid-cols-12 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b pb-2">
              <div className="col-span-5">{t.businessCol}</div>
              <div className="col-span-3 text-right">{t.monthlyCashflowCol}</div>
              <div className="col-span-4 text-right">
                {t.newCashflowDayIncomeCol}
              </div>
            </div>

            {/* Linhas de Negócios */}
            {rowsWithRunningTotal.length === 0 ? (
              <div className="py-6 sm:py-8 text-center text-xs text-muted-foreground italic space-y-2">
                <Rocket className="w-7 h-7 sm:w-8 sm:h-8 text-muted-foreground/40 mx-auto" />
                <p>
                  {t.noFastTrackBusinesses}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-purple-900/40">
                {rowsWithRunningTotal.map((row) => (
                  <div
                    key={row.id}
                    className="py-2.5 text-xs sm:text-sm"
                  >
                    {/* Mobile stacked card view */}
                    <div className="sm:hidden flex flex-col gap-1.5 p-2 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-semibold flex items-center gap-1.5 text-foreground truncate">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="truncate">{row.description}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveFastTrackBusiness(row.id)}
                          className="text-red-500 hover:text-red-700 cursor-pointer shrink-0"
                          title={t.delete}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-border/50">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          +{formatCurrency(row.monthlyCashflow)}/mês
                        </span>
                        <span className="text-muted-foreground">
                          {t.newCashflowDayIncomeCol}: <strong className="text-foreground font-black">{formatCurrency(row.accumulatedIncome)}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Desktop 12-col table view */}
                    <div className="hidden sm:grid grid-cols-12 items-center">
                      <div className="col-span-5 font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className="truncate">{row.description}</span>
                      </div>
                      <div className="col-span-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                        +{formatCurrency(row.monthlyCashflow)}
                      </div>
                      <div className="col-span-4 text-right font-black flex items-center justify-end gap-2">
                        <span>{formatCurrency(row.accumulatedIncome)}</span>
                        <button
                          type="button"
                          onClick={() => onRemoveFastTrackBusiness(row.id)}
                          className="text-red-500 hover:text-red-700 cursor-pointer ml-1"
                          title={t.delete}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Rodapé Explicativo Original da Folha */}
            <div className="pt-3 sm:pt-4 border-t text-center text-[11px] sm:text-xs text-muted-foreground italic">
              {t.fastTrackFooterNote}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Compra de Negócio da Pista Rápida */}
      <FastTrackBusinessModal
        open={bizModalOpen}
        onOpenChange={setBizModalOpen}
        cashOnHand={gameState.cashOnHand}
        onBuyBusiness={onBuyFastTrackBusiness}
      />
    </div>
  );
}


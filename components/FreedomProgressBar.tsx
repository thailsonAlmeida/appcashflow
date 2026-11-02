"use client";

import * as React from "react";
import { ComputedRatRaceMetrics, GamePhase } from "@/types/cashflow";
import { formatCurrency } from "@/lib/cashflow-engine";
import { useLanguage } from "@/context/LanguageContext";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowRight,
  Eye,
  HelpCircle,
  Rocket,
  Sparkles,
  TrendingUp,
} from "lucide-react";

interface FreedomProgressBarProps {
  metrics: ComputedRatRaceMetrics;
  phase: GamePhase;
  onEnterFastTrack: () => void;
  onSwitchPhaseView: (phase: GamePhase) => void;
}

export function FreedomProgressBar({
  metrics,
  phase,
  onEnterFastTrack,
  onSwitchPhaseView,
}: FreedomProgressBarProps) {
  const { t } = useLanguage();
  const {
    passiveIncome,
    totalExpenses,
    freedomPercentage,
    canExitRatRace,
  } = metrics;

  const remainingNeeded = Math.max(0, totalExpenses - passiveIncome + 1);

  return (
    <div
      className={`rounded-2xl border p-3.5 sm:p-4 transition-all shadow-xs ${
        canExitRatRace
          ? "bg-gradient-to-r from-amber-500/20 via-emerald-500/15 to-amber-500/20 border-amber-500 shadow-md ring-1 ring-amber-500/30"
          : "bg-card border-border"
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div className="flex-1 space-y-2">
          {/* Header Row: Title & Percentage */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <div
                className={`p-1.5 rounded-lg ${
                  canExitRatRace
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                    : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                }`}
              >
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-bold tracking-tight text-foreground">
                {t.freedomMeterTitle}
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    aria-label={t.rules}
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs text-xs">
                  {t.freedomMeterHelp}
                </TooltipContent>
              </Tooltip>
              {canExitRatRace && (
                <Badge variant="gold" className="animate-bounce text-[10px] sm:text-xs font-bold py-0.5">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {t.targetReached}
                </Badge>
              )}
            </div>

            <div className="shrink-0">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs sm:text-sm font-black bg-cashflow-purple/10 text-cashflow-purple dark:bg-amber-400/15 dark:text-amber-400">
                {freedomPercentage}%
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <Progress value={freedomPercentage} className="h-3 sm:h-3.5" />

          {/* Metrics summary row - clean wrap on mobile */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] sm:text-xs">
            <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 font-medium">
              <span className="text-muted-foreground">
                {t.passiveIncomeLabel}:{" "}
                <strong className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {formatCurrency(passiveIncome)}
                </strong>
              </span>
              <span className="text-muted-foreground hidden sm:inline">•</span>
              <span className="text-muted-foreground">
                {t.totalExpensesLabel}:{" "}
                <strong className="text-rose-600 dark:text-rose-400 font-bold">
                  {formatCurrency(totalExpenses)}
                </strong>
              </span>
            </div>

            <div className="text-muted-foreground">
              {canExitRatRace ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  🎉 {t.freedomSuccessDesc.replace("{amount}", formatCurrency(passiveIncome - totalExpenses))}
                </span>
              ) : (
                <span>
                  {t.freedomRemainingDesc.replace("{amount}", formatCurrency(remainingNeeded))}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Button: Full width on mobile, auto on desktop */}
        <div className="shrink-0 w-full md:w-auto pt-1 md:pt-0">
          {phase === "RAT_RACE" && canExitRatRace && (
            <Button
              variant="gold"
              size="lg"
              onClick={onEnterFastTrack}
              className="w-full md:w-auto gap-2 shadow-lg animate-pulse font-bold"
            >
              <Rocket className="w-5 h-5 shrink-0" />
              <span>{t.exitRatRaceBtn}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </Button>
          )}

          {phase === "RAT_RACE" && !canExitRatRace && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSwitchPhaseView("FAST_TRACK")}
              className="w-full md:w-auto text-xs gap-1.5 h-8.5 bg-background/80 hover:bg-accent"
            >
              <Eye className="w-3.5 h-3.5 text-muted-foreground" />
              <span>{t.peekFastTrackBtn}</span>
            </Button>
          )}

          {phase === "FAST_TRACK" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSwitchPhaseView("RAT_RACE")}
              className="w-full md:w-auto text-xs gap-1.5 h-8.5 bg-background/80 hover:bg-accent"
            >
              <Eye className="w-3.5 h-3.5 text-muted-foreground" />
              <span>{t.backToRatRaceBtn}</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}


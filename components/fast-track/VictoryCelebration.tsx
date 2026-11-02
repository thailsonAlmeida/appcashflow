"use client";

import * as React from "react";
import { CashflowGameState, ComputedFastTrackMetrics } from "@/types/cashflow";
import { formatCurrency } from "@/lib/cashflow-engine";
import { useLanguage } from "@/context/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Crown, Sparkles, Trophy } from "lucide-react";

interface VictoryCelebrationProps {
  gameState: CashflowGameState;
  metrics: ComputedFastTrackMetrics;
}

export function VictoryCelebration({
  gameState,
  metrics,
}: VictoryCelebrationProps) {
  const { t } = useLanguage();
  if (!metrics.hasWonGame) return null;

  return (
    <div className="rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 p-4 sm:p-6 shadow-2xl border-2 border-white animate-in fade-in zoom-in-95 duration-300">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center gap-3 sm:gap-4">
          <div className="p-3 sm:p-4 rounded-2xl bg-slate-950 text-amber-400 shadow-lg">
            <Trophy className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2">
              <Badge className="bg-slate-950 text-amber-400 font-black uppercase text-xs">
                <Crown className="w-3.5 h-3.5 mr-1" />
                {t.winnerTitle}
              </Badge>
              {metrics.hasWonByDream && (
                <Badge className="bg-emerald-900 text-white text-xs">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {t.wonByDreamDesc.replace("{dream}", gameState.selectedDreamName)}
                </Badge>
              )}
              {metrics.hasWonByCashflow && (
                <Badge className="bg-purple-900 text-white text-xs">
                  +$ 50.000
                </Badge>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight uppercase">
              {t.winnerCongrats.replace("{player}", gameState.playerName || t.player)}
            </h2>
            <p className="text-xs sm:text-sm font-medium text-slate-900">
              {metrics.hasWonByDream
                ? t.wonByDreamDesc.replace("{dream}", gameState.selectedDreamName)
                : t.wonByCashflowDesc.replace("{amount}", formatCurrency(metrics.businessesCashflow))}
            </p>
          </div>
        </div>

        <div className="bg-slate-950/90 text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-center shrink-0 w-full sm:w-auto">
          <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-amber-300 font-bold">
            {t.finalCashflowIncome}
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-400">
            {formatCurrency(metrics.currentCashflowDayIncome)} {t.perMonth}
          </div>
        </div>
      </div>
    </div>
  );
}


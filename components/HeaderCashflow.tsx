"use client";

import * as React from "react";
import { CashflowGameState } from "@/types/cashflow";
import { PROFESSIONS } from "@/constants/professions";
import { DREAMS } from "@/constants/dreams";
import { formatCurrency } from "@/lib/cashflow-engine";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BookOpen,
  Coins,
  Download,
  History,
  Keyboard,
  RotateCcw,
  Sparkles,
  Undo2,
  Upload,
  User,
  UserCheck,
  Wallet,
} from "lucide-react";

interface HeaderCashflowProps {
  gameState: CashflowGameState;
  paydayAmount: number;
  canUndo: boolean;
  onUndo: () => void;
  onReceivePayday: () => void;
  onUpdateProfile: (data: { playerName?: string; auditorName?: string }) => void;
  onSelectProfession: (professionId: string, resetProgress: boolean) => void;
  onSelectDream: (dreamId: string) => void;
  onResetGame: () => void;
  onExportJson: () => void;
  onImportJson: (json: string) => void;
  onOpenHistoryDrawer?: () => void;
  onOpenRulesDrawer?: () => void;
  onOpenShortcutsModal?: () => void;
}

export function HeaderCashflow({
  gameState,
  paydayAmount,
  canUndo,
  onUndo,
  onReceivePayday,
  onUpdateProfile,
  onSelectProfession,
  onSelectDream,
  onResetGame,
  onExportJson,
  onImportJson,
  onOpenHistoryDrawer,
  onOpenRulesDrawer,
  onOpenShortcutsModal,
}: HeaderCashflowProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { language, setLanguage, t } = useLanguage();

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result;
      if (typeof content === "string") {
        onImportJson(content);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <header className="rounded-2xl bg-gradient-to-r from-cashflow-purple-dark via-cashflow-purple to-cashflow-purple-light text-white shadow-xl border border-purple-700/60 p-4 sm:p-5 md:p-6 space-y-4">
      {/* Linha Superior: Logo, Seletor de Idioma, Fase */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center justify-between sm:justify-start gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-amber-400 drop-shadow-xs font-sans">
              CA$HFLOW
            </span>

            {/* Seletor de Idioma Moderno (Pill) */}
            <div className="flex items-center rounded-full bg-black/40 p-0.5 border border-white/20 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setLanguage("pt")}
                className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                  language === "pt"
                    ? "bg-amber-400 text-slate-950 font-black shadow-xs"
                    : "text-purple-200 hover:text-white"
                }`}
                title="Português"
              >
                PT
              </button>
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                  language === "en"
                    ? "bg-amber-400 text-slate-950 font-black shadow-xs"
                    : "text-purple-200 hover:text-white"
                }`}
                title="English"
              >
                EN
              </button>
            </div>
          </div>

          <Badge
            className={`uppercase tracking-wider text-[10px] sm:text-xs font-bold shrink-0 ${
              gameState.phase === "RAT_RACE"
                ? "bg-cyan-500/25 text-cyan-200 border-cyan-400/50"
                : "bg-amber-500/25 text-amber-200 border-amber-400/50"
            }`}
          >
            {gameState.phase === "RAT_RACE"
              ? t.phaseRatRace
              : t.phaseFastTrack}
          </Badge>
        </div>

        {/* HUD Financeiro Principal: Caixa em Mãos + Botão Payday + Undo */}
        <div className="grid grid-cols-12 gap-2 sm:flex sm:items-center sm:gap-2.5">
          <div className="col-span-6 sm:col-auto bg-black/35 backdrop-blur-xs px-3 sm:px-4 py-2 rounded-xl border border-white/15 flex items-center gap-2.5">
            <div className="p-1.5 sm:p-2 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
              <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-purple-200 font-medium truncate">
                {t.cashOnHand}
              </div>
              <div className="text-base sm:text-2xl font-black text-emerald-400 leading-tight truncate">
                {formatCurrency(gameState.cashOnHand)}
              </div>
            </div>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="gold"
                size="lg"
                onClick={onReceivePayday}
                className="col-span-5 sm:col-auto h-auto py-2 sm:h-12 px-3 sm:px-4 shadow-lg gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold flex-1"
              >
                <Coins className="w-4 h-4 shrink-0" />
                <span className="truncate">
                  Payday ({paydayAmount >= 0 ? "+" : ""}
                  {formatCurrency(paydayAmount)})
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {language === "pt"
                ? "Adiciona o Fluxo de Caixa Mensal ao seu Caixa em Mãos"
                : "Collect your monthly cashflow into your cash on hand"}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                disabled={!canUndo}
                onClick={onUndo}
                className="col-span-1 sm:col-auto h-10 w-full sm:h-12 sm:w-12 bg-white/10 text-white border-white/20 hover:bg-white/20 shrink-0"
              >
                <Undo2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t.undo} (Ctrl+Z)</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <p className="text-xs text-purple-200 hidden sm:block">
        {gameState.phase === "RAT_RACE"
          ? t.objectiveRatRace
          : t.objectiveFastTrack}
      </p>

      {/* Linha Inferior: Controles de Ficha (Profissão, Jogador, Auditor, Sonho, Ações Auxiliares) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5 sm:gap-3 pt-3 border-t border-white/15 items-end">
        {/* Carta de Profissão */}
        <div className="lg:col-span-3 space-y-1">
          <label className="text-[10px] sm:text-[11px] uppercase tracking-wider text-amber-300 font-bold block">
            {t.profession}
          </label>
          <Select
            value={gameState.professionId}
            onValueChange={(val) => onSelectProfession(val, true)}
          >
            <SelectTrigger className="bg-black/30 border-white/20 text-white h-9 text-xs w-full">
              <SelectValue placeholder={t.profession} />
            </SelectTrigger>
            <SelectContent>
              {PROFESSIONS.map((prof) => (
                <SelectItem key={prof.id} value={prof.id}>
                  {language === "en" && prof.nameEn ? prof.nameEn : prof.name}{" "}
                  (Sal: {formatCurrency(prof.salary)})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Nome do Jogador */}
        <div className="lg:col-span-2 space-y-1">
          <label className="text-[10px] sm:text-[11px] uppercase tracking-wider text-purple-200 font-semibold flex items-center gap-1">
            <User className="w-3 h-3 text-amber-400" />
            {t.player}
          </label>
          <Input
            value={gameState.playerName}
            onChange={(e) => onUpdateProfile({ playerName: e.target.value })}
            placeholder={t.player}
            className="bg-black/30 border-white/20 text-white placeholder:text-purple-300/50 h-9 text-xs"
          />
        </div>

        {/* Nome do Auditor */}
        <div className="lg:col-span-2 space-y-1">
          <label className="text-[10px] sm:text-[11px] uppercase tracking-wider text-purple-200 font-semibold flex items-center gap-1">
            <UserCheck className="w-3 h-3 text-cyan-400" />
            {t.auditor}
          </label>
          <Input
            value={gameState.auditorName}
            onChange={(e) => onUpdateProfile({ auditorName: e.target.value })}
            placeholder={t.auditorPersonAtRight}
            className="bg-black/30 border-white/20 text-white placeholder:text-purple-300/50 h-9 text-xs"
          />
        </div>

        {/* Sonho Escolhido */}
        <div className="lg:col-span-3 space-y-1">
          <label className="text-[10px] sm:text-[11px] uppercase tracking-wider text-amber-300 font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            {t.dream}
          </label>
          <Select
            value={gameState.selectedDreamId}
            onValueChange={(val) => onSelectDream(val)}
          >
            <SelectTrigger className="bg-black/30 border-white/20 text-white h-9 text-xs w-full">
              <SelectValue placeholder={t.dream} />
            </SelectTrigger>
            <SelectContent>
              {DREAMS.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {language === "en" && d.nameEn ? d.nameEn : d.name} (
                  {formatCurrency(d.cost)})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Toolbar de Ações Rápidas do Cabeçalho */}
        <div className="lg:col-span-2 flex items-center justify-between sm:justify-end gap-1.5 pt-1 sm:pt-0">
          {onOpenHistoryDrawer && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onOpenHistoryDrawer}
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20 h-8 w-8 sm:h-9 sm:w-9"
                >
                  <History className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t.history} (H)</TooltipContent>
            </Tooltip>
          )}

          {onOpenRulesDrawer && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onOpenRulesDrawer}
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20 h-8 w-8 sm:h-9 sm:w-9"
                >
                  <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t.rules} (R)</TooltipContent>
            </Tooltip>
          )}

          {onOpenShortcutsModal && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onOpenShortcutsModal}
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20 h-8 w-8 sm:h-9 sm:w-9"
                >
                  <Keyboard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t.shortcuts} (?)</TooltipContent>
            </Tooltip>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={onExportJson}
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 h-8 w-8 sm:h-9 sm:w-9"
              >
                <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t.exportJson}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 h-8 w-8 sm:h-9 sm:w-9"
              >
                <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t.importJson}</TooltipContent>
          </Tooltip>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleFileImport}
          />

          {/* Confirmação de Reinício */}
          <AlertDialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8 sm:h-9 sm:w-9"
                  >
                    <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Button>
                </AlertDialogTrigger>
              </TooltipTrigger>
              <TooltipContent>{t.resetGame}</TooltipContent>
            </Tooltip>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t.resetConfirmTitle}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t.resetConfirmDesc}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                <AlertDialogAction onClick={onResetGame}>
                  {t.resetConfirmAction}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </header>
  );
}

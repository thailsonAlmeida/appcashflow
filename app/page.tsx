"use client";

import * as React from "react";
import { useCashflowGame } from "@/hooks/useCashflowGame";
import { useLanguage } from "@/context/LanguageContext";
import { HeaderCashflow } from "@/components/HeaderCashflow";
import { FreedomProgressBar } from "@/components/FreedomProgressBar";
import { QuickActionBar } from "@/components/QuickActionBar";
import { IncomeSection } from "@/components/rat-race/IncomeSection";
import { ExpenseSection } from "@/components/rat-race/ExpenseSection";
import { BalanceSection } from "@/components/rat-race/BalanceSection";
import { FastTrackSheet } from "@/components/fast-track/FastTrackSheet";
import { AddAssetModal } from "@/components/rat-race/modals/AddAssetModal";
import { LoanModal } from "@/components/rat-race/modals/LoanModal";
import { PayDebtModal } from "@/components/rat-race/modals/PayDebtModal";
import { SellAssetModal } from "@/components/rat-race/modals/SellAssetModal";
import { CashAdjustmentModal } from "@/components/rat-race/modals/CashAdjustmentModal";
import { HistoryDrawer } from "@/components/drawer/HistoryDrawer";
import { GameRulesDrawer } from "@/components/drawer/GameRulesDrawer";
import { KeyboardShortcutsModal } from "@/components/KeyboardShortcutsModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/cashflow-engine";
import {
  FileSpreadsheet,
  Keyboard,
  LayoutGrid,
  Printer,
} from "lucide-react";

export default function Home() {
  const { language, t } = useLanguage();
  const {
    gameState,
    isHydrated,
    ratRaceMetrics,
    fastTrackMetrics,
    canUndo,
    savedSlots,
    actions,
  } = useCashflowGame();

  // Estados de abertura dos Modais e Gavetas
  const [addAssetOpen, setAddAssetOpen] = React.useState(false);
  const [addAssetTab, setAddAssetTab] = React.useState<
    "stock" | "realEstate" | "business" | "interest"
  >("realEstate");
  const [sellAssetOpen, setSellAssetOpen] = React.useState(false);
  const [loanOpen, setLoanOpen] = React.useState(false);
  const [payDebtOpen, setPayDebtOpen] = React.useState(false);
  const [cashAdjustOpen, setCashAdjustOpen] = React.useState(false);
  const [cashAdjustTab, setCashAdjustTab] = React.useState<
    "doodad" | "bonus" | "manual"
  >("doodad");
  const [historyOpen, setHistoryOpen] = React.useState(false);
  const [rulesOpen, setRulesOpen] = React.useState(false);
  const [shortcutsOpen, setShortcutsOpen] = React.useState(false);

  const handleOpenAddAsset = React.useCallback(
    (tab: "stock" | "realEstate" | "business" | "interest" = "realEstate") => {
      setAddAssetTab(tab);
      setAddAssetOpen(true);
    },
    []
  );

  const handleOpenCashAdjust = React.useCallback(
    (tab: "doodad" | "bonus" | "manual" = "doodad") => {
      setCashAdjustTab(tab);
      setCashAdjustOpen(true);
    },
    []
  );

  // Atalhos de Teclado Globais (Heurística 7 de Nielsen)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (isInput) return;

      // Desfazer (Ctrl+Z / Cmd+Z)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        actions.undo();
        return;
      }

      // Atalhos de tecla única
      const key = e.key.toLowerCase();
      if (e.key === " " || key === "spacebar") {
        e.preventDefault();
        actions.receivePayday();
      } else if (key === "a") {
        e.preventDefault();
        handleOpenAddAsset("realEstate");
      } else if (key === "e") {
        e.preventDefault();
        setLoanOpen(true);
      } else if (key === "q") {
        e.preventDefault();
        setPayDebtOpen(true);
      } else if (key === "m") {
        e.preventDefault();
        setSellAssetOpen(true);
      } else if (key === "d") {
        e.preventDefault();
        handleOpenCashAdjust("doodad");
      } else if (key === "h") {
        e.preventDefault();
        setHistoryOpen(true);
      } else if (key === "r") {
        e.preventDefault();
        setRulesOpen(true);
      } else if (e.key === "?" || key === "/") {
        e.preventDefault();
        setShortcutsOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [actions, handleOpenAddAsset, handleOpenCashAdjust]);

  const currentPaydayAmount =
    gameState.phase === "RAT_RACE"
      ? ratRaceMetrics.monthlyCashFlow
      : fastTrackMetrics.currentCashflowDayIncome ||
        (Math.round(ratRaceMetrics.passiveIncome / 1000) * 1000 ||
          ratRaceMetrics.passiveIncome) * 100;

  const charityCost = Math.round(ratRaceMetrics.totalIncome * 0.1);

  return (
    <div className="flex-1 w-full bg-background text-foreground p-3 sm:p-5 md:p-8">
      <div className="max-w-6xl mx-auto space-y-5">
        {/* Cabeçalho exclusivo para impressão (A4) */}
        <div className="hidden print-only mb-4 border-b-2 border-black pb-2">
          <div className="flex justify-between items-baseline">
            <h1 className="text-xl font-black uppercase">
              CASHFLOW • {language === "en" ? "Official Financial Statement" : "Balanço Econômico Oficial"}
            </h1>
            <span className="text-xs font-semibold">
              {language === "en" ? "Date: " : "Data: "}
              {isHydrated
                ? new Date().toLocaleDateString(language === "en" ? "en-US" : "pt-BR")
                : ""}
            </span>
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span>
              {t.player}: <strong>{gameState.playerName}</strong>
            </span>
            <span>
              {t.profession}: <strong>{gameState.professionName}</strong>
            </span>
            <span>
              {t.auditor}: <strong>{gameState.auditorName || "—"}</strong>
            </span>
            <span>
              {t.cashOnHand}: <strong>{formatCurrency(gameState.cashOnHand)}</strong>
            </span>
          </div>
        </div>

        {/* 1. HUD Superior (HeaderCashflow) */}
        <div className="no-print">
          <HeaderCashflow
            gameState={gameState}
            paydayAmount={currentPaydayAmount}
            canUndo={canUndo}
            onUndo={actions.undo}
            onReceivePayday={actions.receivePayday}
            onUpdateProfile={actions.updateProfile}
            onSelectProfession={actions.selectProfession}
            onSelectDream={actions.selectDream}
            onResetGame={() => actions.resetGame()}
            onExportJson={actions.exportGameJson}
            onImportJson={actions.importGameJson}
            onOpenHistoryDrawer={() => setHistoryOpen(true)}
            onOpenRulesDrawer={() => setRulesOpen(true)}
            onOpenShortcutsModal={() => setShortcutsOpen(true)}
          />
        </div>

        {/* 2. Termômetro de Liberdade Financeira (Heurística 1) */}
        <div className="no-print">
          <FreedomProgressBar
            metrics={ratRaceMetrics}
            phase={gameState.phase}
            onEnterFastTrack={actions.enterFastTrack}
            onSwitchPhaseView={actions.setPhase}
          />
        </div>

        {gameState.phase === "RAT_RACE" ? (
          <>
            {/* 3. Barra de Ações Rápidas de 1 Toque (Heurística 7) */}
            <div className="no-print">
              <QuickActionBar
                childrenCount={gameState.ratRace.childrenCount}
                perChildCost={gameState.ratRace.perChildCost}
                totalExpenses={ratRaceMetrics.totalExpenses}
                charityCost={charityCost}
                onOpenAddAsset={handleOpenAddAsset}
                onOpenSellAsset={() => setSellAssetOpen(true)}
                onOpenLoan={() => setLoanOpen(true)}
                onOpenPayDebt={() => setPayDebtOpen(true)}
                onOpenCashAdjust={handleOpenCashAdjust}
                onAddChild={actions.addChild}
                onPayDownsized={actions.payDownsized}
                onPayCharity={actions.payCharity}
              />
            </div>

            {/* 4. Alternador de Visualização: Ficha Completa vs Por Seção (Mobile) */}
            <Tabs defaultValue="sheet" className="w-full">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3 no-print">
                <TabsList>
                  <TabsTrigger value="sheet" className="text-xs gap-1.5">
                    <FileSpreadsheet className="w-3.5 h-3.5 shrink-0" />
                    <span className="hidden sm:inline">{t.fullSheetView}</span>
                    <span className="sm:hidden">{t.mobileSheetShort}</span>
                  </TabsTrigger>
                  <TabsTrigger value="cards" className="text-xs gap-1.5">
                    <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
                    <span className="hidden sm:inline">{t.tabbedView}</span>
                    <span className="sm:hidden">{t.mobileTabsShort}</span>
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShortcutsOpen(true)}
                    className="text-xs gap-1.5 text-muted-foreground hidden sm:inline-flex"
                  >
                    <Keyboard className="w-3.5 h-3.5" />
                    {t.shortcuts} (?)
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.print()}
                    className="text-xs gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    {t.printSheet}
                  </Button>
                </div>
              </div>

              {/* MODO 1: FICHA DE PAPEL COMPLETA (Idêntico a balanco-economico.jpeg) */}
              <TabsContent value="sheet" className="space-y-6">
                <div className="rounded-2xl border-2 border-slate-300 dark:border-purple-800 bg-white dark:bg-[#220c29] p-3.5 sm:p-6 shadow-md space-y-5 sm:space-y-6">
                  {/* Título Central da Folha */}
                  <div className="border-b-2 border-slate-800 dark:border-purple-600 pb-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-2">
                    <h2 className="text-lg sm:text-2xl font-black italic tracking-wider uppercase text-slate-900 dark:text-amber-400">
                      {t.appTitle} • {t.phaseRatRace}
                    </h2>
                    <span className="text-xs text-muted-foreground">
                      {t.profession}: <strong>{gameState.professionName}</strong> |{" "}
                      {t.player}: <strong>{gameState.playerName}</strong>
                    </span>
                  </div>

                  {/* Seção Superior: Ingresso + Auditor + Ingresso Passivo */}
                  <IncomeSection
                    gameState={gameState}
                    metrics={ratRaceMetrics}
                    onOpenAddAsset={handleOpenAddAsset}
                    onRemoveInterest={(id) =>
                      actions.removeInterestItem(id, true)
                    }
                  />

                  {/* Seção Intermediária: Gastos + Filhos + Fluxo de Caixa Mensal */}
                  <ExpenseSection
                    gameState={gameState}
                    metrics={ratRaceMetrics}
                    onAddChild={actions.addChild}
                    onRemoveChild={actions.removeChild}
                    onReceivePayday={actions.receivePayday}
                    onOpenPayDebt={() => setPayDebtOpen(true)}
                  />

                  {/* Seção Inferior: Balanço Patrimonial (Ativos e Obrigações) */}
                  <BalanceSection
                    gameState={gameState}
                    metrics={ratRaceMetrics}
                    onOpenAddAsset={handleOpenAddAsset}
                    onOpenSellAsset={() => setSellAssetOpen(true)}
                    onOpenPayDebt={() => setPayDebtOpen(true)}
                    onOpenLoan={() => setLoanOpen(true)}
                  />
                </div>
              </TabsContent>

              {/* MODO 2: VISÃO POR ABAS COMPACTAS (Ideal para telas menores) */}
              <TabsContent value="cards" className="no-print">
                <Tabs defaultValue="income" className="w-full">
                  <TabsList className="grid grid-cols-3 w-full mb-4">
                    <TabsTrigger value="income" className="text-xs">
                      1. {t.incomeTitle.split(" ")[0]} ({formatCurrency(ratRaceMetrics.totalIncome)})
                    </TabsTrigger>
                    <TabsTrigger value="expenses" className="text-xs">
                      2. {t.expensesTitle.split(" ")[0]} ({formatCurrency(ratRaceMetrics.totalExpenses)})
                    </TabsTrigger>
                    <TabsTrigger value="balance" className="text-xs">
                      3. {t.assetsTitle}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="income">
                    <IncomeSection
                      gameState={gameState}
                      metrics={ratRaceMetrics}
                      onOpenAddAsset={handleOpenAddAsset}
                      onRemoveInterest={(id) =>
                        actions.removeInterestItem(id, true)
                      }
                    />
                  </TabsContent>

                  <TabsContent value="expenses">
                    <ExpenseSection
                      gameState={gameState}
                      metrics={ratRaceMetrics}
                      onAddChild={actions.addChild}
                      onRemoveChild={actions.removeChild}
                      onReceivePayday={actions.receivePayday}
                      onOpenPayDebt={() => setPayDebtOpen(true)}
                    />
                  </TabsContent>

                  <TabsContent value="balance">
                    <BalanceSection
                      gameState={gameState}
                      metrics={ratRaceMetrics}
                      onOpenAddAsset={handleOpenAddAsset}
                      onOpenSellAsset={() => setSellAssetOpen(true)}
                      onOpenPayDebt={() => setPayDebtOpen(true)}
                      onOpenLoan={() => setLoanOpen(true)}
                    />
                  </TabsContent>
                </Tabs>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          /* FASE 2 DO JOGO: FOLHA DA PISTA RÁPIDA (saida-corrida-dos-ratos.jpeg) */
          <FastTrackSheet
            gameState={gameState}
            ratRaceMetrics={ratRaceMetrics}
            fastTrackMetrics={fastTrackMetrics}
            onReceivePayday={actions.receivePayday}
            onBuyFastTrackBusiness={actions.buyFastTrackBusiness}
            onRemoveFastTrackBusiness={actions.removeFastTrackBusiness}
            onPurchaseDream={actions.purchaseDream}
            onAdjustCash={actions.adjustCash}
            onBackToRatRace={() => actions.setPhase("RAT_RACE")}
          />
        )}

        {/* MODAIS DA CORRIDA DOS RATOS */}
        <AddAssetModal
          open={addAssetOpen}
          onOpenChange={setAddAssetOpen}
          defaultTab={addAssetTab}
          cashOnHand={gameState.cashOnHand}
          onTakeBankLoan={actions.takeBankLoan}
          onBuyStock={actions.buyStock}
          onBuyRealEstate={actions.buyRealEstate}
          onBuyBusiness={actions.buyBusiness}
          onAddInterest={actions.addInterestItem}
        />

        <LoanModal
          open={loanOpen}
          onOpenChange={setLoanOpen}
          currentBankLoan={gameState.ratRace.liabilities.bankLoans}
          cashOnHand={gameState.cashOnHand}
          onTakeLoan={actions.takeBankLoan}
        />

        <PayDebtModal
          open={payDebtOpen}
          onOpenChange={setPayDebtOpen}
          gameState={gameState}
          onPayDebt={actions.payOffDebt}
        />

        <SellAssetModal
          open={sellAssetOpen}
          onOpenChange={setSellAssetOpen}
          gameState={gameState}
          onSellStock={actions.sellStock}
          onSplitStock={actions.splitStock}
          onSellRealEstate={actions.sellRealEstate}
          onSellBusiness={actions.sellBusiness}
        />

        <CashAdjustmentModal
          open={cashAdjustOpen}
          onOpenChange={setCashAdjustOpen}
          defaultTab={cashAdjustTab}
          gameState={gameState}
          onAdjustCash={actions.adjustCash}
          onUpdateManualFields={actions.updateManualRatRaceFields}
        />

        {/* GAVETAS LATERAIS (Histórico/Slots & Regras) */}
        <HistoryDrawer
          open={historyOpen}
          onOpenChange={setHistoryOpen}
          gameState={gameState}
          savedSlots={savedSlots}
          onSaveSlot={actions.saveCurrentToSlots}
          onLoadSlot={actions.loadSlot}
          onDeleteSlot={actions.deleteSlot}
        />

        <GameRulesDrawer open={rulesOpen} onOpenChange={setRulesOpen} />

        {/* MODAL DE ATALHOS DE TECLADO (Heurística 7) */}
        <KeyboardShortcutsModal
          open={shortcutsOpen}
          onOpenChange={setShortcutsOpen}
        />
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CashflowGameState } from "@/types/cashflow";
import { formatCurrency } from "@/lib/cashflow-engine";
import { useLanguage } from "@/context/LanguageContext";
import {
  FolderOpen,
  History,
  Save,
  Trash2,
} from "lucide-react";

interface HistoryDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gameState: CashflowGameState;
  savedSlots: CashflowGameState[];
  onSaveSlot: (slotName?: string) => void;
  onLoadSlot: (slotId: string) => void;
  onDeleteSlot: (slotId: string) => void;
}

export function HistoryDrawer({
  open,
  onOpenChange,
  gameState,
  savedSlots,
  onSaveSlot,
  onLoadSlot,
  onDeleteSlot,
}: HistoryDrawerProps) {
  const { language, t } = useLanguage();
  const [slotName, setSlotName] = React.useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSlot(slotName);
    setSlotName("");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <History className="w-5 h-5 text-amber-500" />
            {t.historyDrawerTitle}
          </SheetTitle>
          <SheetDescription>
            {t.historyDrawerDesc}
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="history" className="flex-1 flex flex-col mt-2">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="history" className="text-xs">
              {t.tabStatement} ({gameState.history.length})
            </TabsTrigger>
            <TabsTrigger value="slots" className="text-xs">
              {t.tabSavedSlots} ({savedSlots.length})
            </TabsTrigger>
          </TabsList>

          {/* EXTRATO DE AUDITORIA */}
          <TabsContent
            value="history"
            className="flex-1 overflow-y-auto space-y-2 pt-2 pr-1 max-h-[72vh]"
          >
            {gameState.history.map((log) => (
              <div
                key={log.id}
                className="p-2.5 rounded-lg border bg-card text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">
                    {log.action}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(log.timestamp).toLocaleTimeString(language === "en" ? "en-US" : "pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-muted-foreground">{log.details}</p>
                {typeof log.amount === "number" && log.amount !== 0 && (
                  <div
                    className={`font-bold ${
                      log.amount > 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {log.amount > 0 ? "+" : ""}
                    {formatCurrency(log.amount)}
                  </div>
                )}
              </div>
            ))}
          </TabsContent>

          {/* PARTIDAS SALVAS (SLOTS) */}
          <TabsContent value="slots" className="space-y-4 pt-2">
            <form onSubmit={handleSave} className="flex gap-2">
              <Input
                placeholder={t.saveNamePlaceholder}
                value={slotName}
                onChange={(e) => setSlotName(e.target.value)}
                className="text-xs"
              />
              <Button type="submit" size="sm" variant="cashflow">
                <Save className="w-3.5 h-3.5 mr-1" />
                {t.saveSlot}
              </Button>
            </form>

            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {savedSlots.length === 0 ? (
                <div className="text-center py-8 text-xs text-muted-foreground">
                  {t.noSavedGames}
                </div>
              ) : (
                savedSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="p-3 rounded-xl border bg-card flex items-center justify-between gap-2"
                  >
                    <div className="text-xs space-y-0.5">
                      <div className="font-bold">{slot.slotName}</div>
                      <div className="text-muted-foreground">
                        {t.cashOnHand}: {formatCurrency(slot.cashOnHand)} •{" "}
                        <Badge variant="outline" className="text-[10px] py-0">
                          {slot.phase === "RAT_RACE"
                            ? t.phaseRatRace
                            : t.phaseFastTrack}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 text-xs"
                        onClick={() => {
                          onLoadSlot(slot.id);
                          onOpenChange(false);
                        }}
                      >
                        <FolderOpen className="w-3.5 h-3.5 mr-1" />
                        {t.load}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-red-500"
                        onClick={() => onDeleteSlot(slot.id)}
                        aria-label={t.delete}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}


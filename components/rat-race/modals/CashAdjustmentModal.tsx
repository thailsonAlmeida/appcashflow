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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CashflowGameState } from "@/types/cashflow";
import { formatCurrency } from "@/lib/cashflow-engine";
import { useLanguage } from "@/context/LanguageContext";
import { Edit3, ShoppingBag, Wallet } from "lucide-react";

interface CashAdjustmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "doodad" | "bonus" | "manual";
  gameState: CashflowGameState;
  onAdjustCash: (
    amount: number,
    mode: "add" | "subtract" | "set",
    reason: string
  ) => boolean | undefined;
  onUpdateManualFields: (updates: {
    salary?: number;
    savings?: number;
    perChildCost?: number;
    expenses?: Partial<CashflowGameState["ratRace"]["expenses"]>;
    liabilities?: Partial<CashflowGameState["ratRace"]["liabilities"]>;
  }) => void;
}

const DOODAD_PRESETS = [
  { label: "TV de Tela Grande", labelEn: "Big Screen TV", amount: 500 },
  { label: "Jantar com Amigos", labelEn: "Dinner with Friends", amount: 100 },
  { label: "Tacos de Golfe Novos", labelEn: "New Golf Clubs", amount: 300 },
  { label: "Relógio de Luxo", labelEn: "Luxury Watch", amount: 400 },
  { label: "Conserto do Carro", labelEn: "Car Repair", amount: 600 },
  { label: "Férias em Família", labelEn: "Family Vacation", amount: 1500 },
];

export function CashAdjustmentModal({
  open,
  onOpenChange,
  defaultTab = "doodad",
  gameState,
  onAdjustCash,
  onUpdateManualFields,
}: CashAdjustmentModalProps) {
  const { language, t } = useLanguage();
  const [tab, setTab] = React.useState<string>(defaultTab);

  // Doodad / Bonus state
  const [amount, setAmount] = React.useState("200");
  const [reason, setReason] = React.useState(
    language === "en" ? "Doodad Expense" : "Doidice / Capricho"
  );

  // Manual sheet fields
  const [salary, setSalary] = React.useState(String(gameState.ratRace.salary));
  const [perChildCost, setPerChildCost] = React.useState(
    String(gameState.ratRace.perChildCost)
  );
  const [taxes, setTaxes] = React.useState(
    String(gameState.ratRace.expenses.taxes)
  );
  const [otherExpenses, setOtherExpenses] = React.useState(
    String(gameState.ratRace.expenses.otherExpenses)
  );

  React.useEffect(() => {
    if (open) {
      setTab(defaultTab);
      setSalary(String(gameState.ratRace.salary));
      setPerChildCost(String(gameState.ratRace.perChildCost));
      setTaxes(String(gameState.ratRace.expenses.taxes));
      setOtherExpenses(String(gameState.ratRace.expenses.otherExpenses));
      setReason(language === "en" ? "Doodad Expense" : "Doidice / Capricho");
    }
  }, [open, defaultTab, gameState, language]);

  const handleDoodadPay = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(amount) || 0;
    if (val <= 0) return;
    const ok = onAdjustCash(
      val,
      "subtract",
      reason || (language === "en" ? "Doodad Expense" : "Doidice / Capricho")
    );
    if (ok) onOpenChange(false);
  };

  const handleBonusAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(amount) || 0;
    if (val <= 0) return;
    const ok = onAdjustCash(
      val,
      "add",
      reason || (language === "en" ? "Extra Cash Inflow" : "Entrada Extra no Caixa")
    );
    if (ok) onOpenChange(false);
  };

  const handleManualSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateManualFields({
      salary: Number(salary) || 0,
      perChildCost: Number(perChildCost) || 0,
      expenses: {
        taxes: Number(taxes) || 0,
        otherExpenses: Number(otherExpenses) || 0,
      },
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between pr-6">
            <DialogTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-amber-500" />
              {language === "en"
                ? "Doodads, Cash Adjustments & Free Editing"
                : "Caprichos, Ajustes de Caixa & Edição Livre"}
            </DialogTitle>
            <Badge variant="success">
              {t.cashOnHand}: {formatCurrency(gameState.cashOnHand)}
            </Badge>
          </div>
          <DialogDescription>
            {language === "en"
              ? "Record Doodad expense cards, unexpected windfalls, or edit manual balance sheet entries."
              : "Registre cartas de Doidices/Caprichos, entradas avulsas ou edite valores da sua ficha."}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="doodad" className="text-xs gap-1">
              <ShoppingBag className="w-3.5 h-3.5" />
              {language === "en" ? "Doodad" : "Doidice"}
            </TabsTrigger>
            <TabsTrigger value="bonus" className="text-xs gap-1">
              <Wallet className="w-3.5 h-3.5" />
              {language === "en" ? "Receive Extra" : "Receber Extra"}
            </TabsTrigger>
            <TabsTrigger value="manual" className="text-xs gap-1">
              <Edit3 className="w-3.5 h-3.5" />
              {language === "en" ? "Edit Sheet" : "Editar Ficha"}
            </TabsTrigger>
          </TabsList>

          {/* DOIDICES / CAPRICHOS */}
          <TabsContent value="doodad">
            <form onSubmit={handleDoodadPay} className="space-y-4 pt-2">
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">
                  {language === "en" ? "Board Doodad Presets:" : "Exemplos de Doidices do Tabuleiro:"}
                </Label>
                <div className="flex flex-wrap gap-1.5">
                  {DOODAD_PRESETS.map((item) => {
                    const itemLabel = language === "en" ? item.labelEn : item.label;
                    return (
                      <button
                        type="button"
                        key={item.label}
                        onClick={() => {
                          setReason(`${language === "en" ? "Doodad" : "Doidice"}: ${itemLabel}`);
                          setAmount(String(item.amount));
                        }}
                        className="text-xs px-2.5 py-1 rounded-md border bg-muted/50 hover:bg-rose-500/15 hover:border-rose-500 transition-colors cursor-pointer"
                      >
                        {itemLabel} ({formatCurrency(item.amount)})
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="doodadReason">{language === "en" ? "Expense Description" : "Descrição do Gasto"}</Label>
                <Input
                  id="doodadReason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="doodadAmount">{language === "en" ? "Amount to Pay from Cash ($)" : "Valor a Pagar do Caixa ($)"}</Label>
                <Input
                  id="doodadAmount"
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <DialogFooter>
                <Button type="submit" variant="destructive">
                  {language === "en" ? "Pay" : "Pagar"} {formatCurrency(Number(amount) || 0)}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>

          {/* RECEBER EXTRA */}
          <TabsContent value="bonus">
            <form onSubmit={handleBonusAdd} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="bonusReason">{language === "en" ? "Income Reason" : "Motivo do Recebimento"}</Label>
                <Input
                  id="bonusReason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Ex: Inheritance, Side Hustle, Bonus..."
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="bonusAmount">{language === "en" ? "Amount Received ($)" : "Valor Recebido ($)"}</Label>
                <Input
                  id="bonusAmount"
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <DialogFooter>
                <Button type="submit" variant="gold">
                  {language === "en" ? "Add" : "Adicionar"} +{formatCurrency(Number(amount) || 0)}{" "}
                  {language === "en" ? "to Cash" : "ao Caixa"}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>

          {/* EDIÇÃO LIVRE (HOUSE RULES) */}
          <TabsContent value="manual">
            <form onSubmit={handleManualSave} className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="manSalary">{t.salary} ($)</Label>
                  <Input
                    id="manSalary"
                    type="number"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="manChild">{t.costPerChild} ($)</Label>
                  <Input
                    id="manChild"
                    type="number"
                    value={perChildCost}
                    onChange={(e) => setPerChildCost(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="manTaxes">{t.taxes} ($)</Label>
                  <Input
                    id="manTaxes"
                    type="number"
                    value={taxes}
                    onChange={(e) => setTaxes(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="manOther">{t.otherExpenses} ($)</Label>
                  <Input
                    id="manOther"
                    type="number"
                    value={otherExpenses}
                    onChange={(e) => setOtherExpenses(e.target.value)}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="submit" variant="cashflow">
                  {language === "en" ? "Save Sheet Changes" : "Salvar Alterações na Ficha"}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

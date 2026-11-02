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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/cashflow-engine";
import { useLanguage } from "@/context/LanguageContext";
import { Rocket } from "lucide-react";

interface FastTrackBusinessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cashOnHand: number;
  onBuyBusiness: (data: {
    description: string;
    cost: number;
    monthlyCashflow: number;
    deductFromCash?: boolean;
  }) => boolean;
}

const FAST_TRACK_PRESETS = [
  {
    description: "Franquia de Sanduíches (60 Lojas)",
    descriptionEn: "Sandwich Franchise (60 Stores)",
    cost: 120000,
    monthlyCashflow: 5000,
  },
  {
    description: "Rede de Lava-Rápidos Automáticos",
    descriptionEn: "Automated Car Wash Chain",
    cost: 150000,
    monthlyCashflow: 6000,
  },
  {
    description: "Complexo Residencial (60 Apts)",
    descriptionEn: "Residential Complex (60 Apts)",
    cost: 200000,
    monthlyCashflow: 8000,
  },
  {
    description: "Fábrica de Peças Automotivas",
    descriptionEn: "Auto Parts Factory",
    cost: 250000,
    monthlyCashflow: 10000,
  },
  {
    description: "Centro Médico Diagnóstico",
    descriptionEn: "Medical Diagnostic Center",
    cost: 300000,
    monthlyCashflow: 12000,
  },
  {
    description: "Empresa de Software Internacional",
    descriptionEn: "Global Software Company",
    cost: 400000,
    monthlyCashflow: 20000,
  },
  {
    description: "Poços de Petróleo em Operação",
    descriptionEn: "Active Oil Wells",
    cost: 750000,
    monthlyCashflow: 35000,
  },
];

export function FastTrackBusinessModal({
  open,
  onOpenChange,
  cashOnHand,
  onBuyBusiness,
}: FastTrackBusinessModalProps) {
  const { language, t } = useLanguage();
  const [description, setDescription] = React.useState(
    language === "en" ? "Sandwich Franchise (60 Stores)" : "Franquia de Sanduíches (60 Lojas)"
  );
  const [cost, setCost] = React.useState("120000");
  const [monthlyCashflow, setMonthlyCashflow] = React.useState("5000");
  const [deductFromCash, setDeductFromCash] = React.useState(true);

  React.useEffect(() => {
    setDescription(language === "en" ? "Sandwich Franchise (60 Stores)" : "Franquia de Sanduíches (60 Lojas)");
  }, [language]);

  const numericCost = Number(cost) || 0;
  const canAfford = !deductFromCash || cashOnHand >= numericCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    const ok = onBuyBusiness({
      description,
      cost: numericCost,
      monthlyCashflow: Number(monthlyCashflow) || 0,
      deductFromCash,
    });
    if (ok) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between pr-6">
            <DialogTitle className="flex items-center gap-2">
              <Rocket className="w-5 h-5 text-amber-500" />
              {t.addFastTrackBusinessBtn}
            </DialogTitle>
            <Badge variant="gold">{t.cashOnHand}: {formatCurrency(cashOnHand)}</Badge>
          </div>
          <DialogDescription>
            {t.objectiveFastTrack}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">
              {language === "en" ? "Fast Track Board Presets:" : "Negócios Clássicos do Tabuleiro da Pista Rápida:"}
            </Label>
            <div className="flex flex-wrap gap-1.5">
              {FAST_TRACK_PRESETS.map((preset) => {
                const name = language === "en" ? preset.descriptionEn : preset.description;
                return (
                  <button
                    type="button"
                    key={preset.description}
                    onClick={() => {
                      setDescription(name);
                      setCost(String(preset.cost));
                      setMonthlyCashflow(String(preset.monthlyCashflow));
                    }}
                    className="text-xs px-2.5 py-1 rounded-md border bg-muted/50 hover:bg-amber-500/20 hover:border-amber-500 transition-colors cursor-pointer text-left"
                  >
                    <strong>{name.split(" (")[0]}</strong> (+
                    {formatCurrency(preset.monthlyCashflow)}{t.perMonth})
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ftBizDesc">{language === "en" ? "Business Name" : "Nome do Negócio"}</Label>
            <Input
              id="ftBizDesc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Franquia de Restaurantes, Mina de Ouro..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="ftBizCost">{language === "en" ? "Purchase Cost ($)" : "Custo de Aquisição ($)"}</Label>
              <Input
                id="ftBizCost"
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="ftBizCashflow"
                className="text-emerald-600 dark:text-emerald-400 font-semibold"
              >
                {language === "en" ? "Monthly Cashflow (+$)" : "Fluxo de Caixa Mensal (+$)"}
              </Label>
              <Input
                id="ftBizCashflow"
                type="number"
                value={monthlyCashflow}
                onChange={(e) => setMonthlyCashflow(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="ftDeduct"
              checked={deductFromCash}
              onChange={(e) => setDeductFromCash(e.target.checked)}
              className="rounded border-input h-4 w-4 accent-amber-500 cursor-pointer"
            />
            <Label htmlFor="ftDeduct" className="text-xs cursor-pointer">
              {language === "en"
                ? `Deduct ${formatCurrency(numericCost)} from Cash on Hand`
                : `Descontar ${formatCurrency(numericCost)} do Caixa em Mãos`}
            </Label>
          </div>

          {!canAfford && (
            <div className="text-xs text-rose-600 dark:text-rose-400 font-medium bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/30">
              {language === "en"
                ? "Insufficient cash! There are no bank loans on the Fast Track — wait for your next Cashflow Day."
                : "Saldo insuficiente! Na Pista Rápida não há empréstimos bancários — aguarde o próximo Dia de Cashflow para juntar o valor."}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t.cancel}
            </Button>
            <Button type="submit" variant="gold" disabled={!canAfford}>
              {language === "en" ? "Add Business" : "Registrar Negócio"} (+{formatCurrency(Number(monthlyCashflow) || 0)}
              {t.perMonth})
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


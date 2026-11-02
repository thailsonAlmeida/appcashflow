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
import { formatCurrency } from "@/lib/cashflow-engine";
import { useLanguage } from "@/context/LanguageContext";
import {
  AlertTriangle,
  Building2,
  Briefcase,
  Landmark,
  Percent,
  TrendingUp,
} from "lucide-react";

interface AddAssetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "stock" | "realEstate" | "business" | "interest";
  cashOnHand: number;
  onTakeBankLoan: (amount: number) => void;
  onBuyStock: (data: {
    symbol: string;
    description?: string;
    shares: number;
    costPerShare: number;
    dividendPerShare: number;
    deductFromCash?: boolean;
  }) => boolean;
  onBuyRealEstate: (data: {
    description: string;
    downPayment: number;
    cost: number;
    mortgage: number;
    cashFlow: number;
    deductFromCash?: boolean;
  }) => boolean;
  onBuyBusiness: (data: {
    description: string;
    downPayment: number;
    cost: number;
    liability: number;
    cashFlow: number;
    deductFromCash?: boolean;
  }) => boolean;
  onAddInterest: (data: {
    description: string;
    principal: number;
    cashFlow: number;
    deductFromCash?: boolean;
  }) => boolean;
}

const STOCK_PRESETS = [
  { symbol: "ON2U", name: "Entretenimento", price: 5, div: 0 },
  { symbol: "MYT4U", name: "Eletrônicos", price: 10, div: 0 },
  { symbol: "OK4U", name: "Farmacêutica", price: 20, div: 0 },
  { symbol: "GRO4US", name: "Fundo Mútuo", price: 30, div: 0 },
  { symbol: "2BIG", name: "Energia (Dividendos)", price: 1200, div: 10 },
  { symbol: "CD-BANC", name: "Certificado Depósito", price: 4000, div: 20 },
];

const REAL_ESTATE_PRESETS = [
  {
    description: "Casa 3/2 (3 Quartos / 2 Banheiros)",
    cost: 65000,
    downPayment: 5000,
    mortgage: 60000,
    cashFlow: 200,
  },
  {
    description: "Condomínio 2/1 (2 Quartos / 1 Banheiro)",
    cost: 40000,
    downPayment: 4000,
    mortgage: 36000,
    cashFlow: 140,
  },
  {
    description: "Duplex (2 Unidades)",
    cost: 75000,
    downPayment: 7000,
    mortgage: 68000,
    cashFlow: 300,
  },
  {
    description: "4-Plex (4 Unidades)",
    cost: 100000,
    downPayment: 15000,
    mortgage: 85000,
    cashFlow: 600,
  },
  {
    description: "8-Plex (8 Unidades)",
    cost: 220000,
    downPayment: 32000,
    mortgage: 188000,
    cashFlow: 1600,
  },
  {
    description: "Complexo 24 Apartamentos",
    cost: 550000,
    downPayment: 50000,
    mortgage: 500000,
    cashFlow: 2800,
  },
];

export function AddAssetModal({
  open,
  onOpenChange,
  defaultTab = "realEstate",
  cashOnHand,
  onTakeBankLoan,
  onBuyStock,
  onBuyRealEstate,
  onBuyBusiness,
  onAddInterest,
}: AddAssetModalProps) {
  const { language, t } = useLanguage();
  const [tab, setTab] = React.useState<string>(defaultTab);
  const [deductCash, setDeductCash] = React.useState(true);

  // Stock State
  const [symbol, setSymbol] = React.useState("OK4U");
  const [shares, setShares] = React.useState("100");
  const [costPerShare, setCostPerShare] = React.useState("10");
  const [dividendPerShare, setDividendPerShare] = React.useState("0");

  // Real Estate State
  const [reDesc, setReDesc] = React.useState("Casa 3/2");
  const [reCost, setReCost] = React.useState("65000");
  const [reDown, setReDown] = React.useState("5000");
  const [reMortgage, setReMortgage] = React.useState("60000");
  const [reCashflow, setReCashflow] = React.useState("200");

  // Business State
  const [bizDesc, setBizDesc] = React.useState("Lavanderia Automática");
  const [bizCost, setBizCost] = React.useState("30000");
  const [bizDown, setBizDown] = React.useState("5000");
  const [bizLiability, setBizLiability] = React.useState("25000");
  const [bizCashflow, setBizCashflow] = React.useState("500");

  // Interest State
  const [intDesc, setIntDesc] = React.useState("Certificado de Depósito (CD)");
  const [intPrincipal, setIntPrincipal] = React.useState("4000");
  const [intCashflow, setIntCashflow] = React.useState("20");

  React.useEffect(() => {
    if (open) {
      setTab(defaultTab);
    }
  }, [open, defaultTab]);

  // Auto-calculate mortgage when cost or downpayment changes
  const handleReCostOrDownChange = (newCost: string, newDown: string) => {
    setReCost(newCost);
    setReDown(newDown);
    const c = Number(newCost) || 0;
    const d = Number(newDown) || 0;
    if (c >= d) {
      setReMortgage(String(c - d));
    }
  };

  const handleBizCostOrDownChange = (newCost: string, newDown: string) => {
    setBizCost(newCost);
    setBizDown(newDown);
    const c = Number(newCost) || 0;
    const d = Number(newDown) || 0;
    if (c >= d) {
      setBizLiability(String(c - d));
    }
  };

  // Calculate required cash for current tab
  const requiredCash = React.useMemo(() => {
    if (!deductCash) return 0;
    if (tab === "stock") {
      return Math.round((Number(shares) || 0) * (Number(costPerShare) || 0));
    }
    if (tab === "realEstate") {
      return Math.round(Number(reDown) || 0);
    }
    if (tab === "business") {
      return Math.round(Number(bizDown) || 0);
    }
    return Math.round(Number(intPrincipal) || 0);
  }, [
    deductCash,
    tab,
    shares,
    costPerShare,
    reDown,
    bizDown,
    intPrincipal,
  ]);

  const shortfall = Math.max(0, requiredCash - cashOnHand);
  const suggestedLoan = Math.ceil(shortfall / 1000) * 1000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let success = false;

    if (tab === "stock") {
      if (!symbol.trim() || Number(shares) <= 0) return;
      success = onBuyStock({
        symbol,
        shares: Number(shares),
        costPerShare: Number(costPerShare),
        dividendPerShare: Number(dividendPerShare) || 0,
        deductFromCash: deductCash,
      });
    } else if (tab === "realEstate") {
      if (!reDesc.trim()) return;
      success = onBuyRealEstate({
        description: reDesc,
        cost: Number(reCost) || 0,
        downPayment: Number(reDown) || 0,
        mortgage: Number(reMortgage) || 0,
        cashFlow: Number(reCashflow) || 0,
        deductFromCash: deductCash,
      });
    } else if (tab === "business") {
      if (!bizDesc.trim()) return;
      success = onBuyBusiness({
        description: bizDesc,
        cost: Number(bizCost) || 0,
        downPayment: Number(bizDown) || 0,
        liability: Number(bizLiability) || 0,
        cashFlow: Number(bizCashflow) || 0,
        deductFromCash: deductCash,
      });
    } else if (tab === "interest") {
      if (!intDesc.trim()) return;
      success = onAddInterest({
        description: intDesc,
        principal: Number(intPrincipal) || 0,
        cashFlow: Number(intCashflow) || 0,
        deductFromCash: deductCash,
      });
    }

    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <div className="flex items-center justify-between pr-6">
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              {language === "en" ? "Buy New Asset (Small / Big Deals)" : "Adquirir Novo Ativo (Pequenos / Grandes Negócios)"}
            </DialogTitle>
            <Badge variant="success">
              {t.cashOnHand}: {formatCurrency(cashOnHand)}
            </Badge>
          </div>
          <DialogDescription>
            {language === "en"
              ? "Record the purchase of real estate, stocks, businesses, or certificates of deposit."
              : "Registre a compra de ações, imóveis, negócios ou certificados de depósito."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="realEstate" className="text-xs gap-1">
                <Building2 className="w-3.5 h-3.5" />
                <span className="truncate">{t.realEstate}</span>
              </TabsTrigger>
              <TabsTrigger value="stock" className="text-xs gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span className="truncate">{t.stocksCDsLabel}</span>
              </TabsTrigger>
              <TabsTrigger value="business" className="text-xs gap-1">
                <Briefcase className="w-3.5 h-3.5" />
                <span className="truncate">{t.businesses}</span>
              </TabsTrigger>
              <TabsTrigger value="interest" className="text-xs gap-1">
                <Percent className="w-3.5 h-3.5" />
                <span className="truncate">{t.interest}</span>
              </TabsTrigger>
            </TabsList>

            {/* ABA IMÓVEIS (BENS MATERIAIS) */}
            <TabsContent value="realEstate" className="space-y-3 pt-2">
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">
                  Atalhos de Cartas Clássicas (Reconhecimento Rápido):
                </Label>
                <div className="flex flex-wrap gap-1.5">
                  {REAL_ESTATE_PRESETS.map((preset) => (
                    <button
                      type="button"
                      key={preset.description}
                      onClick={() => {
                        setReDesc(preset.description);
                        setReCost(String(preset.cost));
                        setReDown(String(preset.downPayment));
                        setReMortgage(String(preset.mortgage));
                        setReCashflow(String(preset.cashFlow));
                      }}
                      className="text-xs px-2.5 py-1 rounded-md border bg-muted/50 hover:bg-amber-500/20 hover:border-amber-500 transition-colors cursor-pointer"
                    >
                      {preset.description.split(" (")[0]} (Entr:{" "}
                      {formatCurrency(preset.downPayment)})
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reDesc">Descrição do Bem Material (Imóvel)</Label>
                <Input
                  id="reDesc"
                  value={reDesc}
                  onChange={(e) => setReDesc(e.target.value)}
                  placeholder="Ex: Casa 3/2, Condomínio 2/1, 4-Plex..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="reCost">Custo Total ($)</Label>
                  <Input
                    id="reCost"
                    type="number"
                    value={reCost}
                    onChange={(e) =>
                      handleReCostOrDownChange(e.target.value, reDown)
                    }
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="reDown">Pagamento Inicial / Entrada ($)</Label>
                  <Input
                    id="reDown"
                    type="number"
                    value={reDown}
                    onChange={(e) =>
                      handleReCostOrDownChange(reCost, e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="reMortgage">Hipoteca ($)</Label>
                  <Input
                    id="reMortgage"
                    type="number"
                    value={reMortgage}
                    onChange={(e) => setReMortgage(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="reCashflow" className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    Fluxo de Caixa Mensal ($)
                  </Label>
                  <Input
                    id="reCashflow"
                    type="number"
                    value={reCashflow}
                    onChange={(e) => setReCashflow(e.target.value)}
                    required
                  />
                </div>
              </div>
            </TabsContent>

            {/* ABA AÇÕES / FUNDOS / CDs */}
            <TabsContent value="stock" className="space-y-3 pt-2">
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">
                  Atalhos de Ações Clássicas do Jogo:
                </Label>
                <div className="flex flex-wrap gap-1.5">
                  {STOCK_PRESETS.map((p) => (
                    <button
                      type="button"
                      key={p.symbol}
                      onClick={() => {
                        setSymbol(p.symbol);
                        setCostPerShare(String(p.price));
                        setDividendPerShare(String(p.div));
                        if (p.div > 0) setShares("1");
                      }}
                      className="text-xs px-2.5 py-1 rounded-md border bg-muted/50 hover:bg-cyan-500/20 hover:border-cyan-500 transition-colors cursor-pointer"
                    >
                      <strong>{p.symbol}</strong> ({formatCurrency(p.price)})
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="symbol">Código / Nome (Ação, Fundo, CD)</Label>
                  <Input
                    id="symbol"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    placeholder="Ex: OK4U, ON2U, MYT4U, 2BIG"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="shares">Nº de Ações / Cotas</Label>
                  <Input
                    id="shares"
                    type="number"
                    min="1"
                    value={shares}
                    onChange={(e) => setShares(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="costPerShare">Custo por Ação ($)</Label>
                  <Input
                    id="costPerShare"
                    type="number"
                    min="0"
                    value={costPerShare}
                    onChange={(e) => setCostPerShare(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="dividendPerShare" className="text-emerald-600 dark:text-emerald-400">
                    Dividendo Mensal por Ação ($)
                  </Label>
                  <Input
                    id="dividendPerShare"
                    type="number"
                    min="0"
                    value={dividendPerShare}
                    onChange={(e) => setDividendPerShare(e.target.value)}
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-muted/60 flex justify-between items-center text-xs">
                <span>Custo Total da Compra:</span>
                <span className="font-bold text-sm">
                  {formatCurrency(
                    (Number(shares) || 0) * (Number(costPerShare) || 0)
                  )}
                </span>
              </div>
            </TabsContent>

            {/* ABA NEGÓCIOS */}
            <TabsContent value="business" className="space-y-3 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="bizDesc">Descrição do Negócio</Label>
                <Input
                  id="bizDesc"
                  value={bizDesc}
                  onChange={(e) => setBizDesc(e.target.value)}
                  placeholder="Ex: Franquia, Lavanderia, Empresa de Software..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="bizCost">Custo Total ($)</Label>
                  <Input
                    id="bizCost"
                    type="number"
                    value={bizCost}
                    onChange={(e) =>
                      handleBizCostOrDownChange(e.target.value, bizDown)
                    }
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="bizDown">Pagamento Inicial ($)</Label>
                  <Input
                    id="bizDown"
                    type="number"
                    value={bizDown}
                    onChange={(e) =>
                      handleBizCostOrDownChange(bizCost, e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="bizLiability">Obrigação / Passivo ($)</Label>
                  <Input
                    id="bizLiability"
                    type="number"
                    value={bizLiability}
                    onChange={(e) => setBizLiability(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="bizCashflow" className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    Fluxo de Caixa Mensal ($)
                  </Label>
                  <Input
                    id="bizCashflow"
                    type="number"
                    value={bizCashflow}
                    onChange={(e) => setBizCashflow(e.target.value)}
                    required
                  />
                </div>
              </div>
            </TabsContent>

            {/* ABA JUROS */}
            <TabsContent value="interest" className="space-y-3 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="intDesc">Descrição da Renda de Juros</Label>
                <Input
                  id="intDesc"
                  value={intDesc}
                  onChange={(e) => setIntDesc(e.target.value)}
                  placeholder="Ex: Certificado de Depósito, Título Público..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="intPrincipal">Valor Principal Investido ($)</Label>
                  <Input
                    id="intPrincipal"
                    type="number"
                    value={intPrincipal}
                    onChange={(e) => setIntPrincipal(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="intCashflow" className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    Juros Mensais Recebidos ($)
                  </Label>
                  <Input
                    id="intCashflow"
                    type="number"
                    value={intCashflow}
                    onChange={(e) => setIntCashflow(e.target.value)}
                    required
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Heurística 9: Diagnóstico e Recuperação de Saldo Insuficiente */}
          {shortfall > 0 && (
            <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-3 space-y-2">
              <div className="flex items-start gap-2 text-xs text-amber-800 dark:text-amber-300">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                <div>
                  <strong>{language === "en" ? "Insufficient Cash on Hand!" : "Saldo em caixa insuficiente!"}</strong>{" "}
                  {language === "en" ? "You need " : "Você precisa de "}
                  <strong>{formatCurrency(requiredCash)}</strong>,{" "}
                  {language === "en" ? "but have " : "mas tem "}
                  <strong>{formatCurrency(cashOnHand)}</strong>{" "}
                  ({language === "en" ? "short by " : "faltam "}
                  {formatCurrency(shortfall)}).
                </div>
              </div>
              <Button
                type="button"
                variant="gold"
                size="sm"
                className="w-full text-xs"
                onClick={() => onTakeBankLoan(suggestedLoan)}
              >
                <Landmark className="w-3.5 h-3.5" />
                {language === "en"
                  ? `Borrow ${formatCurrency(suggestedLoan)} from Bank (+${formatCurrency(suggestedLoan * 0.1)}/mo in expenses)`
                  : `Pegar Empréstimo Bancário de ${formatCurrency(suggestedLoan)} (+${formatCurrency(suggestedLoan * 0.1)}/mês nos gastos)`}
              </Button>
            </div>
          )}

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="deductCash"
              checked={deductCash}
              onChange={(e) => setDeductCash(e.target.checked)}
              className="rounded border-input h-4 w-4 accent-purple-800 cursor-pointer"
            />
            <Label htmlFor="deductCash" className="text-xs cursor-pointer">
              {language === "en"
                ? `Deduct down payment (${formatCurrency(requiredCash)}) from Cash on Hand automatically`
                : `Descontar valor de entrada (${formatCurrency(requiredCash)}) do Caixa em Mãos automaticamente`}
            </Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t.cancel}
            </Button>
            <Button
              type="submit"
              variant="cashflow"
              disabled={shortfall > 0 && deductCash}
            >
              {language === "en" ? "Confirm Acquisition" : "Confirmar Aquisição"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


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
import { CashflowGameState } from "@/types/cashflow";
import { formatCurrency } from "@/lib/cashflow-engine";
import { useLanguage } from "@/context/LanguageContext";
import {
  ArrowLeftRight,
  Building2,
  Briefcase,
  Coins,
  Split,
  TrendingUp,
} from "lucide-react";

interface SellAssetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gameState: CashflowGameState;
  onSellStock: (
    stockId: string,
    sellPricePerShare: number,
    sharesToSell?: number
  ) => boolean;
  onSplitStock: (stockId: string, type: "2-for-1" | "1-for-2") => void;
  onSellRealEstate: (assetId: string, salePrice: number) => boolean;
  onSellBusiness: (businessId: string, salePrice: number) => boolean;
}

export function SellAssetModal({
  open,
  onOpenChange,
  gameState,
  onSellStock,
  onSplitStock,
  onSellRealEstate,
  onSellBusiness,
}: SellAssetModalProps) {
  const { language, t } = useLanguage();
  const { stocks, realEstates, businesses } = gameState.ratRace;

  const [stockPrices, setStockPrices] = React.useState<Record<string, string>>(
    {}
  );
  const [rePrices, setRePrices] = React.useState<Record<string, string>>({});
  const [bizPrices, setBizPrices] = React.useState<Record<string, string>>({});

  const totalAssetsCount =
    stocks.length + realEstates.length + businesses.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-amber-500" />
            {language === "en"
              ? "Market: Sell Assets or Stock Split"
              : "Mercado: Vender Ativos ou Desdobrar Ações (Split)"}
          </DialogTitle>
          <DialogDescription>
            {language === "en"
              ? "Sell stocks at market price, execute stock splits, or liquidate real estate/businesses with automatic mortgage settlement."
              : "Venda ações na cotação do dia ou liquide imóveis/negócios abatendo a hipoteca automaticamente."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 max-h-[65vh] overflow-y-auto pr-1">
          {totalAssetsCount === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              {language === "en"
                ? "You do not own any stocks, real estate, or businesses yet."
                : "Você ainda não possui ativos (ações, imóveis ou negócios) na carteira."}
            </div>
          ) : (
            <>
              {/* AÇÕES */}
              {stocks.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-cyan-500" />
                    {t.stocksCDsLabel} ({stocks.length})
                  </h4>
                  {stocks.map((stk) => {
                    const currentSellPrice =
                      Number(stockPrices[stk.id] ?? stk.costPerShare) || 0;
                    const totalSale = stk.shares * currentSellPrice;
                    const profit =
                      totalSale - stk.shares * stk.costPerShare;

                    return (
                      <div
                        key={stk.id}
                        className="p-3 rounded-xl border bg-card space-y-2"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <span className="font-bold text-sm">
                              {stk.symbol}
                            </span>{" "}
                            <Badge variant="cyan" className="ml-1 text-xs">
                              {stk.shares} {t.sharesLabel}
                            </Badge>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {language === "en" ? "Cost: " : "Custo pago: "}
                              {formatCurrency(stk.costPerShare)}/{language === "en" ? "share" : "ação"}{" "}
                              (Total: {formatCurrency(stk.shares * stk.costPerShare)})
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              title={language === "en" ? "Stock Split 2-for-1" : "Desdobrar 2 por 1 (Dobra quantidade de ações)"}
                              onClick={() => onSplitStock(stk.id, "2-for-1")}
                              className="h-7 px-2 text-xs"
                            >
                              <Split className="w-3 h-3 mr-1" />
                              Split 2x1
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              title={language === "en" ? "Reverse Split 1-for-2" : "Grupamento 1 por 2 (Metade das ações)"}
                              onClick={() => onSplitStock(stk.id, "1-for-2")}
                              className="h-7 px-2 text-xs"
                            >
                              1x2
                            </Button>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pt-2 border-t">
                          <div className="space-y-1">
                            <Label className="text-xs">
                              {language === "en" ? "Selling Price / Share ($)" : "Preço de Venda / Ação ($)"}
                            </Label>
                            <Input
                              type="number"
                              min="0"
                              className="w-full sm:w-32 h-8 text-xs"
                              value={
                                stockPrices[stk.id] ?? String(stk.costPerShare)
                              }
                              onChange={(e) =>
                                setStockPrices((prev) => ({
                                   ...prev,
                                  [stk.id]: e.target.value,
                                }))
                              }
                            />
                          </div>

                          <div className="text-left sm:text-right">
                            <div className="text-xs text-muted-foreground">
                              {language === "en" ? "Proceeds: " : "Recebe: "}
                              <strong className="text-emerald-600 dark:text-emerald-400">
                                {formatCurrency(totalSale)}
                              </strong>{" "}
                              ({profit >= 0 ? "+" : ""}
                              {formatCurrency(profit)})
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              variant="gold"
                              className="mt-1 h-8 text-xs w-full sm:w-auto"
                              onClick={() =>
                                onSellStock(stk.id, currentSellPrice)
                              }
                            >
                              <Coins className="w-3.5 h-3.5" />
                              {language === "en" ? "Sell All Shares" : "Vender Tudo"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* IMÓVEIS */}
              {realEstates.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-emerald-500" />
                    {t.realEstate} ({realEstates.length})
                  </h4>
                  {realEstates.map((re) => {
                    const offerPrice =
                      Number(rePrices[re.id] ?? re.cost) || 0;
                    const netCash = offerPrice - re.mortgage;

                    return (
                      <div
                        key={re.id}
                        className="p-3 rounded-xl border bg-card space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-bold text-sm">
                              {re.description}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {t.totalCostLabel}: {formatCurrency(re.cost)} | {t.mortgageLiabilitiesLabel}:{" "}
                              {formatCurrency(re.mortgage)} | {t.monthlyCashflow}:{" "}
                              <span className="text-emerald-600 font-semibold">
                                {formatCurrency(re.cashFlow)}{t.perMonth}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pt-2 border-t">
                          <div className="space-y-1">
                            <Label className="text-xs">
                              {language === "en" ? "Market Offer Price ($)" : "Oferta de Compra do Mercado ($)"}
                            </Label>
                            <Input
                              type="number"
                              className="w-full sm:w-36 h-8 text-xs"
                              value={rePrices[re.id] ?? String(re.cost)}
                              onChange={(e) =>
                                setRePrices((prev) => ({
                                  ...prev,
                                  [re.id]: e.target.value,
                                }))
                              }
                            />
                          </div>

                          <div className="text-left sm:text-right">
                            <div className="text-xs text-muted-foreground">
                              {language === "en" ? "Net Cash (Offer - Mortgage): " : "Líquido (Oferta - Hipoteca): "}
                              <strong className="text-emerald-600 dark:text-emerald-400">
                                {formatCurrency(netCash)}
                              </strong>
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              variant="gold"
                              className="mt-1 h-8 text-xs w-full sm:w-auto"
                              onClick={() => onSellRealEstate(re.id, offerPrice)}
                            >
                              <Coins className="w-3.5 h-3.5" />
                              {language === "en" ? "Sell Property" : "Vender Imóvel"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* NEGÓCIOS */}
              {businesses.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-amber-500" />
                    {t.businesses} ({businesses.length})
                  </h4>
                  {businesses.map((biz) => {
                    const offerPrice =
                      Number(bizPrices[biz.id] ?? biz.cost) || 0;
                    const netCash = offerPrice - biz.liability;

                    return (
                      <div
                        key={biz.id}
                        className="p-3 rounded-xl border bg-card space-y-2"
                      >
                        <div>
                          <div className="font-bold text-sm">
                            {biz.description}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {t.totalCostLabel}: {formatCurrency(biz.cost)} | {t.businessLiabilitiesLabel}:{" "}
                            {formatCurrency(biz.liability)} | {t.monthlyCashflow}:{" "}
                            <span className="text-emerald-600 font-semibold">
                              {formatCurrency(biz.cashFlow)}{t.perMonth}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pt-2 border-t">
                          <div className="space-y-1">
                            <Label className="text-xs">
                              {language === "en" ? "Selling Price ($)" : "Preço de Venda ($)"}
                            </Label>
                            <Input
                              type="number"
                              className="w-full sm:w-36 h-8 text-xs"
                              value={bizPrices[biz.id] ?? String(biz.cost)}
                              onChange={(e) =>
                                setBizPrices((prev) => ({
                                  ...prev,
                                  [biz.id]: e.target.value,
                                }))
                              }
                            />
                          </div>

                          <div className="text-left sm:text-right">
                            <div className="text-xs text-muted-foreground">
                              {language === "en" ? "Net Cash: " : "Líquido: "}
                              <strong className="text-emerald-600 dark:text-emerald-400">
                                {formatCurrency(netCash)}
                              </strong>
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              variant="gold"
                              className="mt-1 h-8 text-xs w-full sm:w-auto"
                              onClick={() => onSellBusiness(biz.id, offerPrice)}
                            >
                              {language === "en" ? "Sell Business" : "Vender Negócio"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t.close}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

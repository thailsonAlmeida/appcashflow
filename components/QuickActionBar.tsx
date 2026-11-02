"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
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
import { formatCurrency } from "@/lib/cashflow-engine";
import { useLanguage } from "@/context/LanguageContext";
import {
  ArrowLeftRight,
  Baby,
  CreditCard,
  HeartHandshake,
  Landmark,
  PlusCircle,
  Settings2,
  ShoppingBag,
  UserX,
} from "lucide-react";

interface QuickActionBarProps {
  childrenCount: number;
  perChildCost: number;
  totalExpenses: number;
  charityCost: number;
  onOpenAddAsset: (tab?: "stock" | "realEstate" | "business" | "interest") => void;
  onOpenSellAsset: () => void;
  onOpenLoan: () => void;
  onOpenPayDebt: () => void;
  onOpenCashAdjust: (tab?: "doodad" | "bonus" | "manual") => void;
  onAddChild: () => void;
  onPayDownsized: () => void;
  onPayCharity: () => void;
}

export function QuickActionBar({
  childrenCount,
  perChildCost,
  totalExpenses,
  charityCost,
  onOpenAddAsset,
  onOpenSellAsset,
  onOpenLoan,
  onOpenPayDebt,
  onOpenCashAdjust,
  onAddChild,
  onPayDownsized,
  onPayCharity,
}: QuickActionBarProps) {
  const { t } = useLanguage();

  return (
    <div className="rounded-xl border bg-card p-2 sm:p-3 shadow-xs">
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 sm:flex-wrap no-scrollbar">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-1 shrink-0 hidden md:inline">
          {t.boardActions}
        </span>

        <Button
          size="sm"
          variant="cashflow"
          onClick={() => onOpenAddAsset("realEstate")}
          className="text-xs gap-1.5 shrink-0 h-8"
        >
          <PlusCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{t.buyAssetBtn}</span>
        </Button>

        <Button
          size="sm"
          variant="cyan"
          onClick={onOpenSellAsset}
          className="text-xs gap-1.5 shrink-0 h-8"
        >
          <ArrowLeftRight className="w-3.5 h-3.5 shrink-0" />
          <span>{t.marketSellBtn}</span>
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => onOpenCashAdjust("doodad")}
          className="text-xs gap-1.5 shrink-0 h-8 border-red-200 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-950/30"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-red-500 shrink-0" />
          <span>{t.doodadsBtn}</span>
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={onOpenLoan}
          className="text-xs gap-1.5 shrink-0 h-8"
        >
          <Landmark className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>{t.bankLoanBtn}</span>
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={onOpenPayDebt}
          className="text-xs gap-1.5 shrink-0 h-8"
        >
          <CreditCard className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>{t.payDebtsBtn}</span>
        </Button>

        <Button
          size="sm"
          variant="outline"
          disabled={childrenCount >= 3}
          onClick={onAddChild}
          className="text-xs gap-1.5 shrink-0 h-8"
          title={t.childTooltip.replace("{amount}", formatCurrency(perChildCost))}
        >
          <Baby className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
          <span>
            {t.addChildBtn} ({childrenCount}/3)
          </span>
        </Button>

        {/* Caridade (10% do Ingresso Total) */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" variant="outline" className="text-xs gap-1.5 shrink-0 h-8">
              <HeartHandshake className="w-3.5 h-3.5 text-pink-500 shrink-0" />
              <span>{t.charityBtn}</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t.charityTitle}</AlertDialogTitle>
              <AlertDialogDescription>
                {t.charityDesc.replace("{amount}", formatCurrency(charityCost))}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
              <AlertDialogAction
                onClick={onPayCharity}
                className="bg-emerald-600 hover:bg-emerald-500"
              >
                {t.charityConfirm.replace("{amount}", formatCurrency(charityCost))}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Demitido (Downsized) */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="text-xs gap-1.5 shrink-0 h-8 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
            >
              <UserX className="w-3.5 h-3.5 shrink-0" />
              <span>{t.downsizedBtn}</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t.downsizedTitle}</AlertDialogTitle>
              <AlertDialogDescription>
                {t.downsizedDesc.replace("{amount}", formatCurrency(totalExpenses))}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
              <AlertDialogAction
                onClick={onPayDownsized}
                className="bg-rose-600 hover:bg-rose-500"
              >
                {t.downsizedConfirm.replace("{amount}", formatCurrency(totalExpenses))}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button
          size="sm"
          variant="ghost"
          onClick={() => onOpenCashAdjust("manual")}
          className="text-xs gap-1 shrink-0 h-8 sm:ml-auto"
        >
          <Settings2 className="w-3.5 h-3.5 shrink-0" />
          <span>{t.adjustSheetBtn}</span>
        </Button>
      </div>
    </div>
  );
}


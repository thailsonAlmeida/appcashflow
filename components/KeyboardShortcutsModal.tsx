"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/context/LanguageContext";
import { Keyboard } from "lucide-react";

interface KeyboardShortcutsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function KeyboardShortcutsModal({
  open,
  onOpenChange,
}: KeyboardShortcutsModalProps) {
  const { language, t } = useLanguage();

  const shortcuts = [
    {
      key: language === "en" ? "Space" : "Espaço",
      description: language === "en" ? "Receive Payday Cash" : "Receber Dia de Pagamento (Payday)",
    },
    {
      key: "Ctrl + Z",
      description: language === "en" ? "Undo last change" : "Desfazer última alteração (Undo)",
    },
    {
      key: "Ctrl + P",
      description: language === "en" ? "Print / Save PDF (A4)" : "Imprimir / Salvar em PDF a Ficha (A4)",
    },
    {
      key: "A",
      description: language === "en" ? "Buy Asset (Real Estate, Stock, Biz)" : "Comprar Ativo (Imóvel, Ação, Negócio)",
    },
    {
      key: "E",
      description: language === "en" ? "Take Bank Loan ($1,000+)" : "Pegar Empréstimo Bancário ($ 1.000+)",
    },
    {
      key: "Q",
      description: language === "en" ? "Pay off Debts" : "Quitar ou Amortizar Dívidas",
    },
    {
      key: "M",
      description: language === "en" ? "Market / Sell Assets / Split" : "Mercado / Venda de Ativos / Split",
    },
    {
      key: "D",
      description: language === "en" ? "Doodad / Expenses" : "Registrar Doidice / Capricho",
    },
    {
      key: "H",
      description: language === "en" ? "Open History & Slots" : "Abrir Histórico de Transações & Slots",
    },
    {
      key: "R",
      description: language === "en" ? "Open Game Rules Guide" : "Abrir Guia de Regras do Jogo",
    },
    {
      key: "?",
      description: language === "en" ? "Open Shortcuts panel" : "Abrir este painel de atalhos",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-amber-500" />
            {t.keyboardShortcutsTitle}
          </DialogTitle>
          <DialogDescription>
            {t.keyboardShortcutsDesc}
          </DialogDescription>
        </DialogHeader>

        <div className="divide-y divide-border text-xs py-2">
          {shortcuts.map((s) => (
            <div
              key={s.key}
              className="flex items-center justify-between py-2"
            >
              <span className="text-muted-foreground">{s.description}</span>
              <kbd className="px-2 py-1 rounded bg-muted border font-mono text-[11px] font-bold text-foreground">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}


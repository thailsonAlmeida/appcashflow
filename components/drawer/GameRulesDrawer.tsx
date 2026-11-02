"use client";

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useLanguage } from "@/context/LanguageContext";
import { BookOpen, CheckCircle2, Rocket, ShieldAlert } from "lucide-react";

interface GameRulesDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GameRulesDrawer({
  open,
  onOpenChange,
}: GameRulesDrawerProps) {
  const { language, t } = useLanguage();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto space-y-5">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-500" />
            {t.rulesDrawerTitle}
          </SheetTitle>
          <SheetDescription>
            {t.rulesDrawerDesc}
          </SheetDescription>
        </SheetHeader>

        {language === "en" ? (
          <div className="space-y-4 text-xs leading-relaxed">
            <div className="p-3.5 rounded-xl border bg-emerald-500/5 border-emerald-500/20 space-y-1.5">
              <h4 className="font-bold text-sm text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                1. Rat Race Objective
              </h4>
              <p className="text-muted-foreground">
                You exit the Rat Race and transition to the{" "}
                <strong>Fast Track</strong> as soon as your{" "}
                <strong>Passive Income</strong> (sum of Interest,
                Dividends, Real Estate, and Businesses) is{" "}
                <strong>GREATER than your Total Expenses</strong>.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border bg-card space-y-1.5">
              <h4 className="font-bold text-sm text-foreground">
                2. Payday
              </h4>
              <p className="text-muted-foreground">
                Whenever you pass or land on a <strong>Payday</strong> space, click the gold{" "}
                <strong>Receive Payday</strong> button to add your{" "}
                <em>Monthly Cash Flow</em> to your Cash on Hand.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border bg-card space-y-1.5">
              <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                3. Bank Loans & Debt Payoff
              </h4>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>
                  You can borrow from the Bank in multiples of <strong>$1,000</strong> at any time.
                </li>
                <li>
                  Every <strong>$1,000</strong> borrowed incurs <strong>$100/mo</strong> (10%) in your monthly expenses.
                </li>
                <li>
                  You can pay off personal liabilities (Credit Card, Car, School, Mortgage) in full to remove that monthly expense permanently!
                </li>
              </ul>
            </div>

            <div className="p-3.5 rounded-xl border bg-card space-y-1.5">
              <h4 className="font-bold text-sm text-foreground">
                4. Children, Charity & Downsized
              </h4>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>
                  <strong>Children:</strong> Maximum of <strong>3 children</strong>. Each child adds your profession&apos;s fixed cost to your expenses.
                </li>
                <li>
                  <strong>Charity:</strong> Donate 10% of Total Income to roll 1 or 2 dice on your next 3 turns.
                </li>
                <li>
                  <strong>Downsized:</strong> Pay your Total Expenses once and lose 2 turns.
                </li>
              </ul>
            </div>

            <div className="p-3.5 rounded-xl border bg-amber-500/10 border-amber-500/30 space-y-1.5">
              <h4 className="font-bold text-sm text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                <Rocket className="w-4 h-4" />
                5. On the Fast Track: How to Win?
              </h4>
              <p className="text-muted-foreground">
                Upon entering the Fast Track, your assets are purchased for{" "}
                <strong>100x your Passive Income</strong>. You win if you are the first to:
              </p>
              <ol className="list-decimal pl-4 space-y-1 font-medium text-foreground">
                <li>Buy your Dream when landing on its space; OR</li>
                <li>
                  Accumulate <strong>+$50,000</strong> in Monthly Cash Flow from Fast Track businesses.
                </li>
              </ol>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-xs leading-relaxed">
            <div className="p-3.5 rounded-xl border bg-emerald-500/5 border-emerald-500/20 space-y-1.5">
              <h4 className="font-bold text-sm text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                1. Objetivo da Corrida dos Ratos
              </h4>
              <p className="text-muted-foreground">
                Você sai da Corrida dos Ratos e entra na{" "}
                <strong>Pista Rápida</strong> assim que o seu{" "}
                <strong>Ingresso Passivo</strong> (soma dos fluxos de Juros,
                Dividendos, Imóveis e Negócios) for{" "}
                <strong>MAIOR que os seus Gastos Totais</strong>.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border bg-card space-y-1.5">
              <h4 className="font-bold text-sm text-foreground">
                2. Dia de Pagamento (Payday)
              </h4>
              <p className="text-muted-foreground">
                Sempre que passar ou cair na casa{" "}
                <strong>Dia de Pagamento</strong>, clique no botão dourado{" "}
                <strong>Receber Payday</strong> para adicionar seu{" "}
                <em>Fluxo de Caixa Mensal</em> ao caixa em mãos.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border bg-card space-y-1.5">
              <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                3. Empréstimos Bancários e Quitação
              </h4>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>
                  Você pode pegar empréstimos do Banco em múltiplos de{" "}
                  <strong>$ 1.000</strong> a qualquer momento (exceto para comprar
                  sonhos na Pista Rápida).
                </li>
                <li>
                  Cada <strong>$ 1.000</strong> emprestados geram{" "}
                  <strong>$ 100/mês</strong> (10%) nos seus Gastos.
                </li>
                <li>
                  Você pode quitar dívidas pessoais (Cartão, Carro, Colégio,
                  Hipoteca) pelo valor total da obrigação para eliminar a despesa
                  mensal correspondente!
                </li>
              </ul>
            </div>

            <div className="p-3.5 rounded-xl border bg-card space-y-1.5">
              <h4 className="font-bold text-sm text-foreground">
                4. Filhos, Caridade e Demissão
              </h4>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>
                  <strong>Filhos:</strong> Máximo de <strong>3 filhos</strong> por
                  partida. Cada filho adiciona o custo fixo da sua carta de
                  profissão aos gastos.
                </li>
                <li>
                  <strong>Caridade:</strong> Doe 10% do seu Ingresso Total para
                  jogar com 1 ou 2 dados durante 3 turnos.
                </li>
                <li>
                  <strong>Demitido (Downsized):</strong> Pague uma vez o valor dos
                  seus Gastos Totais e perca 2 turnos.
                </li>
              </ul>
            </div>

            <div className="p-3.5 rounded-xl border bg-amber-500/10 border-amber-500/30 space-y-1.5">
              <h4 className="font-bold text-sm text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                <Rocket className="w-4 h-4" />
                5. Na Pista Rápida: Como Ganhar o Jogo?
              </h4>
              <p className="text-muted-foreground">
                Ao entrar na Pista Rápida, seus ativos são comprados por{" "}
                <strong>100x o seu Ingresso Passivo</strong>. Você vence se for o
                primeiro a:
              </p>
              <ol className="list-decimal pl-4 space-y-1 font-medium text-foreground">
                <li>Comprar o seu Sonho quando cair no espaço dele; OU</li>
                <li>
                  Acumular <strong>+$ 50.000</strong> em Fluxo de Caixa Mensal com
                  os negócios comprados na Pista Rápida.
                </li>
              </ol>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}


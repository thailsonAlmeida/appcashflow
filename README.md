# 💰 Cashflow: Assistente Digital de Balanço Econômico

> Ficha digital interativa e automatizada para o jogo **Cashflow 101 & 202** (*Pai Rico, Pai Pobre* por Robert Kiyosaki).  
> Substitui com precisão lápis, borracha e papel, eliminando cálculos manuais e erros contábeis durante a partida.

---

## 🌟 Principais Funcionalidades

### 🐁 1. Corrida dos Ratos (*Rat Race*)
- **Demonstrativo de Renda e Despesas Automatizado**:
  - Cálculo instantâneo de **Renda Total**, **Despesas Totais**, **Renda Passiva** e **Fluxo de Caixa Mensal**.
  - Gerenciamento de despesas fixas (Impostos, Hipoteca, Empréstimo Estudantil, Carro, Cartão de Crédito, Outros).
  - Suporte a filhos com teto regulamentar (máximo de 3 filhos com despesa por filho conforme a profissão).
- **Balanço Patrimonial (Ativos e Passivos)**:
  - Adição de Imóveis, Negócios, Ações/Fundos Mútuos e Certificados de Depósito.
  - Vínculo automático entre Ativos e Passivos (ex: aquisição de imóvel vincula a respectiva hipoteca).
  - Venda e liquidação facilitada de ativos e amortização de dívidas.
- **Barra de Liberdade Financeira**:
  - Indicador visual em tempo real comparando a Renda Passiva com as Despesas Totais.
  - Gatilho automático de vitória da fase quando a `Renda Passiva > Despesas Totais`.
- **Ações Rápidas (HUD & Barra de Ações)**:
  - **Dia de Pagamento (Payday)** com um clique.
  - **Doação de Caridade** (10% da renda total para rolar até 3 dados).
  - **Empréstimo Bancário** (em múltiplos de \$ 1.000 com acréscimo automático de 10% de juros nas despesas).
  - **Perda de Emprego (Downsized)**: congela turnos e debita despesas totais.
  - **Ajuste Manual de Caixa** com histórico e feedback via *toast*.

---

### 🚀 2. Pista Rápida (*Fast Track*)
- **Transição Automática**:
  - Transferência de todo o saldo em caixa da Corrida dos Ratos.
  - Bonificação da Poupança Pista Rápida (+ \$ 100.000).
  - Novo **Dia de Fluxo de Caixa (Cashflow Day)** calculado pela fórmula oficial: `Renda Passiva da Corrida dos Ratos × 100` (arredondado para o milhar mais próximo).
- **Seleção do Sonho do Jogador**:
  - Escolha entre os sonhos oficiais do tabuleiro com custo e progresso visual em tempo real.
- **Novos Ativos de Alto Rendimento**:
  - Gestão de investimentos da Pista Rápida que agregam grandes fluxos mensais (\$ 1.000 a \$ 50.000+).
- **Condições de Vitória**:
  1. Comprar o seu **Sonho Selecionado** ao cair na casa correspondente com saldo em caixa suficiente.
  2. Acumular **+ \$ 50.000** em novo fluxo de caixa mensal proveniente de negócios na Pista Rápida.

---

### 🌐 3. Recursos de Usabilidade & Design
- **Bilingue (PT-BR / EN)**:
  - Alternância instantânea de idioma no topo da tela entre Português e Inglês.
- **Heurísticas de Nielsen & Shadcn UI**:
  - Visibilidade de status com atualizações reativas e sem recarregar a página.
  - Prevenção de erros com confirmações modais em ações irreversíveis (reset de jogo, amortização total, etc.).
  - Aceleradores de teclado para agilidade durante partidas físicas:
    - <kbd>P</kbd> ou <kbd>Espaço</kbd>: Receber Dia de Pagamento (*Payday*).
    - <kbd>A</kbd>: Adicionar novo Ativo.
    - <kbd>C</kbd>: Ajustar Dinheiro em Caixa.
    - <kbd>?</kbd>: Exibir guia de atalhos.
- **100% Responsivo**:
  - Interface adaptada para smartphones, tablets e notebooks/desktops.
- **Pronto para Impressão**:
  - Estilo CSS `@media print` otimizado em folha A4 para arquivar ou validar o balanço oficial da partida.
- **100% Client-Side & Offline First**:
  - Dados salvos localmente via `localStorage`. Não requer servidor externo ou banco de dados em nuvem para jogar.
  - PWA configurado com Web Manifest e suporte a instalação como aplicativo independente.

---

## 🛠️ Stack Tecnológica

| Tecnologia | Versão | Finalidade |
| :--- | :--- | :--- |
| **Next.js** | 16.x (App Router + Turbopack) | Framework React Fullstack / SSR / SSG |
| **React** | 19.x | Biblioteca de interfaces reativas |
| **TypeScript** | 5.x | Tipagem estática e segurança de código |
| **Tailwind CSS** | 4.x | Estilização utilitária moderna e responsiva |
| **Radix UI / Shadcn** | Primitivas acessíveis | Diálogos, Abas, Menus, Tooltips e Seletores |
| **Lucide React** | 1.x | Ícones vetoriais modernos |
| **Sonner** | 2.x | Notificações em formato Toast rápidas e estilizadas |

---

## 📁 Estrutura do Projeto

```text
appcashflow/
├── app/                  # Rotas do Next.js App Router (layout, página principal, manifest)
├── components/           # Componentes modulares
│   ├── ui/               # Componentes Shadcn UI (button, dialog, input, tabs, etc.)
│   ├── rat-race/         # Seções da Corrida dos Ratos (renda, despesas, ativos, passivos)
│   ├── fast-track/       # Ficha da Pista Rápida (sonhos, ativos de grande porte)
│   ├── HeaderCashflow.tsx# Cabeçalho com HUD, seleção de idioma e alternador de fases
│   ├── QuickActionBar.tsx# Barra de ações rápidas (Payday, Caridade, Empréstimo)
│   └── ShortcutsDialog.tsx# Modal de atalhos de teclado
├── constants/            # Profissões padrão, sonhos e listas do Cashflow
├── context/              # Contexto global de idioma (LanguageContext)
├── hooks/                # Hooks customizados (useCashflowGame, useLocalStorage)
├── lib/                  # Motor de regras (cashflow-engine) e traduções (i18n)
├── types/                # Definições TypeScript do estado do jogo
├── public/               # Ícones PWA, favicon e service worker
└── docs/                 # Documentações internas de escopo e design (ignorado no git)
```

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- **Node.js** (versão 20 ou superior recomendada)
- Gerenciador de pacotes **npm**, **yarn**, **pnpm** ou **bun**

### Instalação e Execução

1. Clone o repositório ou navegue até o diretório do projeto:
   ```bash
   cd appcashflow
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## ⌨️ Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento com Next.js Turbopack.
- `npm run build`: Cria a versão de produção otimizada da aplicação.
- `npm run start`: Inicia o servidor de produção do Next.js.
- `npm run lint`: Executa a verificação estática de código com ESLint.

---

## 📄 Licença
Distribuído sob licença privada para uso educacional e recreativo com o jogo de tabuleiro Cashflow.

export type Language = "pt" | "en";

export interface Translations {
  // Common & Navigation
  appTitle: string;
  appSubtitle: string;
  phaseRatRace: string;
  phaseFastTrack: string;
  objectiveRatRace: string;
  objectiveFastTrack: string;
  cashOnHand: string;
  receivePayday: string;
  undo: string;
  undoToast: string;
  undoToastDesc: string;
  noUndo: string;
  player: string;
  auditor: string;
  auditorPersonAtRight: string;
  auditorNotSet: string;
  profession: string;
  dream: string;
  selectedDream: string;
  saveSlot: string;
  history: string;
  rules: string;
  shortcuts: string;
  exportJson: string;
  importJson: string;
  resetGame: string;
  resetConfirmTitle: string;
  resetConfirmDesc: string;
  resetConfirmAction: string;
  cancel: string;
  close: string;
  confirm: string;
  printSheet: string;

  // Freedom Thermometer
  freedomMeterTitle: string;
  freedomMeterHelp: string;
  passiveIncomeLabel: string;
  totalExpensesLabel: string;
  targetReached: string;
  exitRatRaceBtn: string;
  peekFastTrackBtn: string;
  backToRatRaceBtn: string;
  freedomRemainingDesc: string;
  freedomSuccessDesc: string;

  // Quick Action Bar
  boardActions: string;
  buyAssetBtn: string;
  marketSellBtn: string;
  doodadsBtn: string;
  bankLoanBtn: string;
  payDebtsBtn: string;
  addChildBtn: string;
  charityBtn: string;
  downsizedBtn: string;
  adjustSheetBtn: string;
  charityTitle: string;
  charityDesc: string;
  charityConfirm: string;
  downsizedTitle: string;
  downsizedDesc: string;
  downsizedConfirm: string;
  childTooltip: string;

  // Income Section
  incomeTitle: string;
  incomeSubtitle: string;
  descriptionCol: string;
  cashflowCol: string;
  salary: string;
  salaryHelp: string;
  interest: string;
  interestHelp: string;
  dividends: string;
  dividendsHelp: string;
  realEstate: string;
  realEstateHelp: string;
  businesses: string;
  businessesHelp: string;
  noInterestActive: string;
  noDividendsActive: string;
  noRealEstateActive: string;
  noBusinessesActive: string;
  addInterest: string;
  addStock: string;
  addRealEstate: string;
  addBusiness: string;
  passiveIncomeCalcHelp: string;
  totalIncome: string;
  totalIncomeHelp: string;
  sharesLabel: string;
  perMonth: string;

  // Expense Section
  expensesTitle: string;
  payDebtToReduceExpenses: string;
  taxes: string;
  taxesHelp: string;
  homeMortgage: string;
  homeMortgageHelp: string;
  schoolLoan: string;
  schoolLoanHelp: string;
  carLoan: string;
  carLoanHelp: string;
  creditCard: string;
  creditCardHelp: string;
  retailDebt: string;
  retailDebtHelp: string;
  otherExpenses: string;
  otherExpensesHelp: string;
  childExpenses: string;
  childExpensesHelp: string;
  bankLoanExpense: string;
  bankLoanExpenseHelp: string;
  paidOffBadge: string;
  numberOfChildren: string;
  childrenSubtext: string;
  costPerChild: string;
  totalExpenses: string;
  totalExpensesHelp: string;
  monthlyCashflow: string;
  monthlyCashflowSubtext: string;
  monthlyCashflowHelp: string;

  // Balance Section
  balanceTitle: string;
  assetsTitle: string;
  assetsHelp: string;
  liabilitiesTitle: string;
  liabilitiesHelp: string;
  savingsLabel: string;
  savingsHelp: string;
  stocksCDsLabel: string;
  numSharesLabel: string;
  costPerShareLabel: string;
  noStocksActive: string;
  realEstateLabel: string;
  downPaymentLabel: string;
  totalCostLabel: string;
  noRealEstateRecorded: string;
  businessesLabel: string;
  noBusinessesRecorded: string;
  totalAssetsCost: string;
  mortgageLiabilitiesLabel: string;
  noMortgagesActive: string;
  businessLiabilitiesLabel: string;
  noBusinessLiabilities: string;
  bankLoanLiability: string;
  totalLiabilities: string;
  cdNote: string;

  // Fast Track
  congratulations: string;
  escapedRatRace: string;
  newObjectives: string;
  objective1: string;
  objective2: string;
  youWinIf: string;
  winConditionA: string;
  orDivider: string;
  winConditionB: string;
  name: string;
  assetPurchaseTitle: string;
  passiveIncomeFromOtherSide: string;
  roundToThousands: string;
  purchaseMultiplier: string;
  initialCashflowDayIncome: string;
  receiveNowAndEveryPayday: string;
  howToWinTitle: string;
  initialCashflowIncomeLine: string;
  cashflowRequiredToWin: string;
  targetIncomeToWinLine: string;
  progressLabel: string;
  receive100xReasonTitle: string;
  provedFinancialIntelligence: string;
  investmentsProsperedDesc: string;
  cashflowDayLogTitle: string;
  addFastTrackBusinessBtn: string;
  initialCashflowDayIncomeHeader: string;
  businessCol: string;
  monthlyCashflowCol: string;
  newCashflowDayIncomeCol: string;
  noFastTrackBusinesses: string;
  fastTrackFooterNote: string;
  winnerTitle: string;
  winnerCongrats: string;
  wonByDreamDesc: string;
  wonByCashflowDesc: string;
  finalCashflowIncome: string;
  buyDreamBtn: string;
  taxAuditBtn: string;
  divorceBtn: string;

  // Views & Sheets
  fullSheetView: string;
  tabbedView: string;
  mobileSheetShort: string;
  mobileTabsShort: string;
  viewIncomeTab: string;
  viewExpensesTab: string;
  viewBalanceTab: string;

  // Modals & Drawers
  keyboardShortcutsTitle: string;
  keyboardShortcutsDesc: string;
  historyDrawerTitle: string;
  historyDrawerDesc: string;
  rulesDrawerTitle: string;
  rulesDrawerDesc: string;
  tabStatement: string;
  tabSavedSlots: string;
  noSavedGames: string;
  saveNamePlaceholder: string;
  load: string;
  delete: string;
}

export const DICTIONARY: Record<Language, Translations> = {
  pt: {
    appTitle: "CA$HFLOW",
    appSubtitle: "Assistente Digital de Balanço Econômico",
    phaseRatRace: "Fase 1: Corrida dos Ratos",
    phaseFastTrack: "Fase 2: Pista Rápida",
    objectiveRatRace: "Aumente seu Ingresso Passivo até que supere seus Gastos Totais.",
    objectiveFastTrack: "Compre seu Sonho ou acumule +$ 50.000 de fluxo mensal de negócios.",
    cashOnHand: "Caixa em Mãos",
    receivePayday: "Receber Payday",
    undo: "Desfazer",
    undoToast: "Ação desfeita",
    undoToastDesc: "O balanço retornou ao estado anterior.",
    noUndo: "Não há ações anteriores para desfazer.",
    player: "Jogador",
    auditor: "Auditor",
    auditorPersonAtRight: "Pessoa à sua direita",
    auditorNotSet: "Não informado",
    profession: "Profissão",
    dream: "Sonho Escolhido",
    selectedDream: "Sonho Escolhido",
    saveSlot: "Salvar",
    history: "Histórico",
    rules: "Regras",
    shortcuts: "Atalhos",
    exportJson: "Exportar JSON",
    importJson: "Importar JSON",
    resetGame: "Reiniciar Ficha",
    resetConfirmTitle: "Deseja reiniciar a partida atual?",
    resetConfirmDesc: "Todos os ativos, empréstimos e filhos serão restaurados aos valores iniciais da sua profissão.",
    resetConfirmAction: "Sim, Reiniciar Ficha",
    cancel: "Cancelar",
    close: "Fechar",
    confirm: "Confirmar",
    printSheet: "Imprimir / PDF",

    freedomMeterTitle: "Termômetro da Liberdade Financeira",
    freedomMeterHelp: "Regra oficial: Você sai da Corrida dos Ratos quando seu Ingresso Passivo for MAIOR que seus Gastos Totais.",
    passiveIncomeLabel: "Ingresso Passivo",
    totalExpensesLabel: "Gastos Totais",
    targetReached: "META ATINGIDA!",
    exitRatRaceBtn: "SAIR DA CORRIDA DOS RATOS!",
    peekFastTrackBtn: "Espiar Folha da Pista Rápida",
    backToRatRaceBtn: "Ver Ficha da Corrida dos Ratos",
    freedomRemainingDesc: "Faltam {amount} de renda passiva mensal para superar seus gastos.",
    freedomSuccessDesc: "Seu Ingresso Passivo superou seus Gastos Totais em {amount}! Você está livre!",

    boardActions: "Ações do Tabuleiro:",
    buyAssetBtn: "Comprar Ativo",
    marketSellBtn: "Mercado / Vender / Split",
    doodadsBtn: "Doidices / Caprichos",
    bankLoanBtn: "Empréstimo Banco",
    payDebtsBtn: "Quitar Dívidas",
    addChildBtn: "+1 Filho",
    charityBtn: "Caridade (10%)",
    downsizedBtn: "Demitido",
    adjustSheetBtn: "Ajustar Caixa / Ficha",
    charityTitle: "Casa de Caridade (Doar 10%)",
    charityDesc: "Deseja doar 10% do seu Ingresso Total ({amount}) para jogar com 1 ou 2 dados durante os próximos 3 turnos?",
    charityConfirm: "Doar {amount}",
    downsizedTitle: "Caiu na casa 'Demitido' (Downsized)?",
    downsizedDesc: "Pela regra oficial, ao ser demitido você deve pagar uma vez o valor dos seus Gastos Totais ({amount}) e perder 2 turnos.",
    downsizedConfirm: "Pagar {amount}",
    childTooltip: "Adiciona +{amount}/mês aos gastos (Máx. 3 filhos)",

    incomeTitle: "Ingresso (Receitas)",
    incomeSubtitle: "Declaração de Renda",
    descriptionCol: "Descrição",
    cashflowCol: "Fluxo de Caixa",
    salary: "Salário",
    salaryHelp: "Seu rendimento mensal pelo emprego atual, definido pela Carta de Profissão.",
    interest: "Juros",
    interestHelp: "Rendimentos mensais de Certificados de Depósito (CDs) ou títulos de renda fixa.",
    dividends: "Dividendos",
    dividendsHelp: "Dividendos mensais pagos por ações que geram proventos.",
    realEstate: "Bens Materiais (Imóveis)",
    realEstateHelp: "Fluxo de caixa líquido mensal gerado por aluguéis de casas, condomínios ou prédios.",
    businesses: "Negócios",
    businessesHelp: "Lucro mensal obtido de empresas, franquias ou participações em negócios.",
    noInterestActive: "Nenhum título de juros ativo",
    noDividendsActive: "Nenhum dividendo mensal",
    noRealEstateActive: "Nenhum imóvel gerando renda",
    noBusinessesActive: "Nenhum negócio ativo",
    addInterest: "Adicionar Juros",
    addStock: "Adicionar Ação/CD",
    addRealEstate: "Adicionar Imóvel",
    addBusiness: "Adicionar Negócio",
    passiveIncomeCalcHelp: "Soma de Juros + Dividendos + Bens Materiais + Negócios (Não inclui seu Salário!).",
    totalIncome: "Total Ingressos",
    totalIncomeHelp: "Renda bruta total gerada por você todo mês no jogo (Salário + Passivo).",
    sharesLabel: "cotas",
    perMonth: "/mês",

    expensesTitle: "Gastos (Despesas Mensais)",
    payDebtToReduceExpenses: "Quitar Dívidas para Reduzir Gastos →",
    taxes: "Impostos:",
    taxesHelp: "Desconto fixo de tributos e taxas do seu salário.",
    homeMortgage: "Hipoteca da Casa:",
    homeMortgageHelp: "Custo mensal da parcela da sua residência. Zera quando a dívida for quitada.",
    schoolLoan: "Pag. Dívida Colégio:",
    schoolLoanHelp: "Financiamento estudantil. Zera quando você quita a obrigação Dívidas Colégio.",
    carLoan: "Pag. Automóvel:",
    carLoanHelp: "Parcela mensal do financiamento do veículo. Zera quando quitado.",
    creditCard: "Pag. Cartão de Crédito:",
    creditCardHelp: "Pagamento mensal da fatura do cartão. Quitar elimina esta despesa fixa.",
    retailDebt: "Pag. Casas Comerciais:",
    retailDebtHelp: "Crediário e compras parceladas em lojas de departamento. Zera ao ser quitado.",
    otherExpenses: "Outros Gastos:",
    otherExpensesHelp: "Despesas de manutenção da vida, alimentação, contas e lazer básico.",
    childExpenses: "Gastos das Crianças",
    childExpensesHelp: "Cada filho adiciona custo fixo aos seus gastos mensais (máximo 3 filhos).",
    bankLoanExpense: "Pag. Dívida do Banco (10% do saldo):",
    bankLoanExpenseHelp: "Juros de 10% cobrados todo mês sobre cada $ 1.000 emprestados do banco.",
    paidOffBadge: "Quitado",
    numberOfChildren: "Número de Filhos:",
    childrenSubtext: "(Comece o jogo com 0 filhos • Máx: 3)",
    costPerChild: "Gastos por Filho:",
    totalExpenses: "Total Gastos:",
    totalExpensesHelp: "Soma de todas as despesas mensais.",
    monthlyCashflow: "Fluxo de Caixa Mensal:",
    monthlyCashflowSubtext: "(Dia de Pagamento / Payday)",
    monthlyCashflowHelp: "Total Ingressos menos Total Gastos. É o valor que entra no seu caixa todo Payday!",

    balanceTitle: "Balanço Patrimonial",
    assetsTitle: "Ativos",
    assetsHelp: "Tudo aquilo que coloca dinheiro no seu bolso: Ações, Fundos, Imóveis e Negócios.",
    liabilitiesTitle: "Obrigações (Passivos)",
    liabilitiesHelp: "Dívidas e financiamentos que tiram dinheiro do seu bolso todo mês.",
    savingsLabel: "Economias (Caixa Inicial da Carta):",
    savingsHelp: "Poupança inicial herdada da sua carta de profissão.",
    stocksCDsLabel: "Ações/Mútuos/CDs",
    numSharesLabel: "Nº de Ações",
    costPerShareLabel: "Custo/Ação",
    noStocksActive: "Nenhuma ação, fundo mútuo ou CD em carteira",
    realEstateLabel: "Bens Materiais",
    downPaymentLabel: "Pag. Inicial",
    totalCostLabel: "Custo Total",
    noRealEstateRecorded: "Nenhum imóvel registrado",
    businessesLabel: "Negócios",
    noBusinessesRecorded: "Nenhum negócio registrado",
    totalAssetsCost: "Patrimônio em Ativos (Custo Total):",
    mortgageLiabilitiesLabel: "Hipotecas de Bens Materiais:",
    noMortgagesActive: "Nenhuma hipoteca de imóveis",
    businessLiabilitiesLabel: "Obrigações (Negócios):",
    noBusinessLiabilities: "Nenhum passivo de negócios",
    bankLoanLiability: "Empréstimo do Banco:",
    totalLiabilities: "Total de Obrigações / Dívidas:",
    cdNote: "Nota: CD's significa Certificados de Depósitos.",

    congratulations: "Parabéns !!!!",
    escapedRatRace: "Conseguiu sair da Corrida dos Ratos!",
    newObjectives: "Novos Objetivos:",
    objective1: "Comprar seu \"Sonho\" quando cair no espaço da Pista Rápida que selecionou no começo do jogo.",
    objective2: "Aumentar seu Fluxo de Caixa Mensal comprando negócios da Pista Rápida.",
    youWinIf: "Você ganha:",
    winConditionA: "a) Se for a primeira pessoa a comprar seu Sonho.",
    orDivider: "- ou -",
    winConditionB: "b) Se for a primeira pessoa a acumular $ 50.000 no Fluxo de Caixa Mensal a partir dos negócios comprados na Pista Rápida.",
    name: "Nome",
    assetPurchaseTitle: "Compra de seus Ativos",
    passiveIncomeFromOtherSide: "Seu Ingresso Passivo (do outro lado) =",
    roundToThousands: "(Aproxime-o a Milhares de Dólares)",
    purchaseMultiplier: "Multiplicador de Compra",
    initialCashflowDayIncome: "Seu Ingresso Inicial em Dia de Cashflow =",
    receiveNowAndEveryPayday: "(Receba este agora e cada vez que passar por Dia de Cashflow)",
    howToWinTitle: "Como GANHAR ?",
    initialCashflowIncomeLine: "Seu Ingresso Inicial de Dia de Cashflow",
    cashflowRequiredToWin: "Fluxo de Caixa requerido para ganhar",
    targetIncomeToWinLine: "Seu novo Ingresso de Dia de Cashflow Objetivo a Ganhar",
    progressLabel: "Progresso",
    receive100xReasonTitle: "Receba 100 x seu Ingresso Passivo porque :",
    provedFinancialIntelligence: "Você provou sua inteligência financeira !!",
    investmentsProsperedDesc: "Seus investimentos na Corrida dos Ratos prosperaram. Você reinvestiu seus ganhos obtendo êxitos excepcionais, e aumentou espetacularmente seu Ingresso Passivo 100 vezes!",
    cashflowDayLogTitle: "Registro do seu Ingresso para o Dia de Cashflow",
    addFastTrackBusinessBtn: "Adicionar Negócio Comprado",
    initialCashflowDayIncomeHeader: "Ingresso Inicial de Dia de Cashflow:",
    businessCol: "Negócios",
    monthlyCashflowCol: "Fluxo de Caixa Mensal",
    newCashflowDayIncomeCol: "Novo Ingresso Dia de Cashflow",
    noFastTrackBusinesses: "Nenhum negócio comprado na Pista Rápida ainda.",
    fastTrackFooterNote: "Seu Ingresso de Dia de Pagamento é igual ao Ingresso de Dia de Cashflow Inicial mais o Fluxo de Caixa de cada Negócio que compre na Pista Rápida.",
    winnerTitle: "Vencedor do Cashflow!",
    winnerCongrats: "Parabéns, {name}! Você Venceu o Jogo!",
    wonByDreamDesc: "Você comprou seu grande sonho \"{dream}\" na Pista Rápida!",
    wonByCashflowDesc: "Você acumulou +{amount}/mês em novos negócios na Pista Rápida, superando a meta de +$ 50.000!",
    finalCashflowIncome: "Ingresso Final de Cashflow",
    buyDreamBtn: "Comprar Sonho",
    taxAuditBtn: "Auditoria / Processo (-50% Caixa)",
    divorceBtn: "Divórcio (-100% Caixa)",

    fullSheetView: "Ficha de Papel Completa (1:1)",
    tabbedView: "Visão Compacta por Abas",
    mobileSheetShort: "Ficha (1:1)",
    mobileTabsShort: "Por Abas",
    viewIncomeTab: "1. Ingressos",
    viewExpensesTab: "2. Gastos",
    viewBalanceTab: "3. Ativos & Dívidas",

    keyboardShortcutsTitle: "Atalhos de Teclado (Mesa Ágil)",
    keyboardShortcutsDesc: "Controles rápidos para agilizar sua jogatina no computador sem usar o mouse.",
    historyDrawerTitle: "Auditoria & Partidas Salvas",
    historyDrawerDesc: "Consulte o histórico completo de movimentações da partida ou salve múltiplos jogos.",
    rulesDrawerTitle: "Guia Rápido de Regras (Cashflow)",
    rulesDrawerDesc: "Referência rápida das regras oficiais do tabuleiro Cashflow 101.",
    tabStatement: "Extrato",
    tabSavedSlots: "Jogos Salvos",
    noSavedGames: "Nenhuma partida salva ainda.",
    saveNamePlaceholder: "Nome do Save (Ex: Mesa de Sábado)",
    load: "Carregar",
    delete: "Excluir",
  },
  en: {
    appTitle: "CA$HFLOW",
    appSubtitle: "Financial Statement Digital Assistant",
    phaseRatRace: "Phase 1: Rat Race",
    phaseFastTrack: "Phase 2: Fast Track",
    objectiveRatRace: "Increase your Passive Income until it exceeds your Total Expenses.",
    objectiveFastTrack: "Buy your Dream or accumulate +$50,000 monthly cashflow from Fast Track businesses.",
    cashOnHand: "Cash on Hand",
    receivePayday: "Collect Payday",
    undo: "Undo",
    undoToast: "Action undone",
    undoToastDesc: "The financial statement returned to the previous state.",
    noUndo: "No previous actions to undo.",
    player: "Player",
    auditor: "Auditor",
    auditorPersonAtRight: "Person on your right",
    auditorNotSet: "Not set",
    profession: "Profession",
    dream: "Chosen Dream",
    selectedDream: "Chosen Dream",
    saveSlot: "Save",
    history: "History",
    rules: "Rules",
    shortcuts: "Shortcuts",
    exportJson: "Export JSON",
    importJson: "Import JSON",
    resetGame: "Reset Sheet",
    resetConfirmTitle: "Do you want to reset the current game?",
    resetConfirmDesc: "All assets, loans, and children will be restored to your profession's initial values.",
    resetConfirmAction: "Yes, Reset Sheet",
    cancel: "Cancel",
    close: "Close",
    confirm: "Confirm",
    printSheet: "Print / PDF",

    freedomMeterTitle: "Financial Freedom Meter",
    freedomMeterHelp: "Official rule: You escape the Rat Race once your Passive Income is GREATER than your Total Expenses.",
    passiveIncomeLabel: "Passive Income",
    totalExpensesLabel: "Total Expenses",
    targetReached: "GOAL REACHED!",
    exitRatRaceBtn: "OUT OF THE RAT RACE!",
    peekFastTrackBtn: "Peek Fast Track Sheet",
    backToRatRaceBtn: "View Rat Race Sheet",
    freedomRemainingDesc: "{amount} more monthly passive income needed to beat your expenses.",
    freedomSuccessDesc: "Your Passive Income exceeded Total Expenses by {amount}! You are financially free!",

    boardActions: "Board Actions:",
    buyAssetBtn: "Buy Asset",
    marketSellBtn: "Market / Sell / Split",
    doodadsBtn: "Doodads / Expenses",
    bankLoanBtn: "Bank Loan",
    payDebtsBtn: "Pay Off Debts",
    addChildBtn: "+1 Child",
    charityBtn: "Charity (10%)",
    downsizedBtn: "Downsized",
    adjustSheetBtn: "Adjust Cash / Sheet",
    charityTitle: "Charity (Donate 10%)",
    charityDesc: "Do you want to donate 10% of your Total Income ({amount}) to roll 1 or 2 dice on your next 3 turns?",
    charityConfirm: "Donate {amount}",
    downsizedTitle: "Landed on 'Downsized'?",
    downsizedDesc: "By official rules, you must pay your Total Expenses ({amount}) once and lose 2 turns.",
    downsizedConfirm: "Pay {amount}",
    childTooltip: "Adds +{amount}/mo to expenses (Max 3 children)",

    incomeTitle: "Income",
    incomeSubtitle: "Income Statement",
    descriptionCol: "Description",
    cashflowCol: "Cash Flow",
    salary: "Salary",
    salaryHelp: "Your monthly earned income from job, set by your Profession Card.",
    interest: "Interest",
    interestHelp: "Monthly interest from Certificates of Deposit (CDs) or fixed-income notes.",
    dividends: "Dividends",
    dividendsHelp: "Monthly dividend payouts from cash-flowing stock shares.",
    realEstate: "Real Estate",
    realEstateHelp: "Net monthly positive cashflow generated by rental houses, condos, or apartments.",
    businesses: "Businesses",
    businessesHelp: "Monthly net cashflow from businesses, franchises, or ventures.",
    noInterestActive: "No interest notes active",
    noDividendsActive: "No dividend payouts",
    noRealEstateActive: "No cash-flowing real estate",
    noBusinessesActive: "No active businesses",
    addInterest: "Add Interest",
    addStock: "Add Stock/CD",
    addRealEstate: "Add Real Estate",
    addBusiness: "Add Business",
    passiveIncomeCalcHelp: "Sum of Interest + Dividends + Real Estate + Businesses (Does NOT include Salary!).",
    totalIncome: "Total Income",
    totalIncomeHelp: "Total monthly cash inflows (Salary + Passive Income).",
    sharesLabel: "shares",
    perMonth: "/mo",

    expensesTitle: "Expenses",
    payDebtToReduceExpenses: "Pay Off Debts to Lower Expenses →",
    taxes: "Taxes:",
    taxesHelp: "Fixed payroll deduction based on your profession.",
    homeMortgage: "Home Mortgage:",
    homeMortgageHelp: "Monthly residential mortgage payment. Becomes $0 when principal is paid off.",
    schoolLoan: "School Loan Payment:",
    schoolLoanHelp: "Monthly student loan payment. Becomes $0 when liability is paid off.",
    carLoan: "Car Loan Payment:",
    carLoanHelp: "Monthly auto financing payment. Becomes $0 when paid off.",
    creditCard: "Credit Card Payment:",
    creditCardHelp: "Minimum monthly credit card payment. Paying this off saves quick monthly cashflow!",
    retailDebt: "Retail Debt Payment:",
    retailDebtHelp: "Department store credit payment. Becomes $0 when paid off.",
    otherExpenses: "Other Expenses:",
    otherExpensesHelp: "Living expenses, groceries, utilities, and lifestyle basics.",
    childExpenses: "Child Expenses",
    childExpensesHelp: "Each child adds a fixed cost to your monthly expenses (maximum 3 children).",
    bankLoanExpense: "Bank Loan Payment (10% of debt):",
    bankLoanExpenseHelp: "10% interest charged every month on each $1,000 borrowed from the bank.",
    paidOffBadge: "Paid Off",
    numberOfChildren: "Number of Children:",
    childrenSubtext: "(Start game with 0 children • Max: 3)",
    costPerChild: "Per Child Expense:",
    totalExpenses: "Total Expenses:",
    totalExpensesHelp: "Sum of all monthly expense items.",
    monthlyCashflow: "Monthly Cash Flow:",
    monthlyCashflowSubtext: "(Payday Cash Inflow)",
    monthlyCashflowHelp: "Total Income minus Total Expenses. This is the exact amount added to your cash every Payday!",

    balanceTitle: "Balance Sheet",
    assetsTitle: "Assets",
    assetsHelp: "Everything that puts money into your pocket: Stocks, Real Estate, and Businesses.",
    liabilitiesTitle: "Liabilities",
    liabilitiesHelp: "Debts and loans that take money out of your pocket every month.",
    savingsLabel: "Savings (Starting Cash on Card):",
    savingsHelp: "Initial cash reserve given on your Profession Card.",
    stocksCDsLabel: "Stocks/Mutuals/CDs",
    numSharesLabel: "No. of Shares",
    costPerShareLabel: "Cost/Share",
    noStocksActive: "No stocks, mutual funds or CDs held",
    realEstateLabel: "Real Estate",
    downPaymentLabel: "Down Payment",
    totalCostLabel: "Cost",
    noRealEstateRecorded: "No real estate recorded",
    businessesLabel: "Businesses",
    noBusinessesRecorded: "No businesses recorded",
    totalAssetsCost: "Total Assets Value (Cost Basis):",
    mortgageLiabilitiesLabel: "Real Estate Mortgages:",
    noMortgagesActive: "No mortgages active",
    businessLiabilitiesLabel: "Business Liabilities:",
    noBusinessLiabilities: "No business liabilities",
    bankLoanLiability: "Bank Loans:",
    totalLiabilities: "Total Liabilities / Debts:",
    cdNote: "Note: CDs means Certificates of Deposit.",

    congratulations: "Congratulations !!!!",
    escapedRatRace: "You escaped the Rat Race!",
    newObjectives: "New Objectives:",
    objective1: "Buy your \"Dream\" when you land on the Fast Track space you chose at the start.",
    objective2: "Increase your Monthly Cash Flow by purchasing Fast Track business opportunities.",
    youWinIf: "You Win If:",
    winConditionA: "a) You are the first person to buy your Dream.",
    orDivider: "- or -",
    winConditionB: "b) You are the first person to accumulate $50,000 in monthly cash flow from businesses bought on the Fast Track.",
    name: "Name",
    assetPurchaseTitle: "Purchase of Your Assets",
    passiveIncomeFromOtherSide: "Your Passive Income (from other side) =",
    roundToThousands: "(Rounded to thousands of dollars)",
    purchaseMultiplier: "Purchase Multiplier",
    initialCashflowDayIncome: "Your Beginning Cash Flow Day Income =",
    receiveNowAndEveryPayday: "(Collect this now and every time you pass Cash Flow Day)",
    howToWinTitle: "How to WIN ?",
    initialCashflowIncomeLine: "Your Beginning Cash Flow Day Income",
    cashflowRequiredToWin: "Cash Flow required to win",
    targetIncomeToWinLine: "Your New Cash Flow Day Income Goal to Win",
    progressLabel: "Progress",
    receive100xReasonTitle: "Collect 100 x your Passive Income because :",
    provedFinancialIntelligence: "You proved your financial intelligence !!",
    investmentsProsperedDesc: "Your investments in the Rat Race prospered. You reinvested your returns with exceptional success, boosting your Passive Income 100 times!",
    cashflowDayLogTitle: "Record of Your Cash Flow Day Income",
    addFastTrackBusinessBtn: "Add Fast Track Business",
    initialCashflowDayIncomeHeader: "Beginning Cash Flow Day Income:",
    businessCol: "Businesses",
    monthlyCashflowCol: "Monthly Cash Flow",
    newCashflowDayIncomeCol: "New Cash Flow Day Income",
    noFastTrackBusinesses: "No Fast Track businesses purchased yet.",
    fastTrackFooterNote: "Your Cash Flow Day Income is equal to your Beginning Cash Flow Day Income plus the Cash Flow of each business you buy on the Fast Track.",
    winnerTitle: "Cashflow Winner!",
    winnerCongrats: "Congratulations, {name}! You Won the Game!",
    wonByDreamDesc: "You purchased your ultimate dream \"{dream}\" on the Fast Track!",
    wonByCashflowDesc: "You accumulated +{amount}/mo in new Fast Track businesses, beating the +$50,000 target!",
    finalCashflowIncome: "Final Cashflow Income",
    buyDreamBtn: "Buy Dream",
    taxAuditBtn: "Tax Audit / Lawsuit (-50% Cash)",
    divorceBtn: "Divorce (-100% Cash)",

    fullSheetView: "Full Paper Statement (1:1)",
    tabbedView: "Compact Tabbed View",
    mobileSheetShort: "Statement (1:1)",
    mobileTabsShort: "Tabs",
    viewIncomeTab: "1. Income",
    viewExpensesTab: "2. Expenses",
    viewBalanceTab: "3. Balance Sheet",

    keyboardShortcutsTitle: "Keyboard Shortcuts (Fast Play)",
    keyboardShortcutsDesc: "Fast keyboard controls to play smoothly on laptop/desktop without a mouse.",
    historyDrawerTitle: "Audit History & Saved Games",
    historyDrawerDesc: "View complete audit log of transactions or save multiple game slots.",
    rulesDrawerTitle: "Quick Rules Guide (Cashflow)",
    rulesDrawerDesc: "Quick reference of official Cashflow 101 rules.",
    tabStatement: "Statement",
    tabSavedSlots: "Saved Slots",
    noSavedGames: "No saved games yet.",
    saveNamePlaceholder: "Slot Name (e.g., Saturday Night Game)",
    load: "Load",
    delete: "Delete",
  },
};

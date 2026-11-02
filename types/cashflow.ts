export type GamePhase = "RAT_RACE" | "FAST_TRACK";

export interface ProfessionCard {
  id: string;
  name: string;
  nameEn?: string;
  salary: number;
  savings: number;
  perChildExpense: number;
  expenses: {
    taxes: number;
    homeMortgage: number;
    schoolLoan: number;
    carLoan: number;
    creditCard: number;
    retailDebt: number;
    otherExpenses: number;
  };
  liabilities: {
    homeMortgage: number;
    schoolLoan: number;
    carLoan: number;
    creditCard: number;
    retailDebt: number;
  };
}

export interface DreamItem {
  id: string;
  name: string;
  nameEn?: string;
  description: string;
  descriptionEn?: string;
  cost: number;
  category: string;
}

export interface InterestItem {
  id: string;
  description: string;
  principal: number;
  cashFlow: number;
}

export interface StockAsset {
  id: string;
  symbol: string;
  description?: string;
  shares: number;
  costPerShare: number;
  dividendPerShare: number; // Dividendos ou juros mensais por ação/cota
}

export interface RealEstateAsset {
  id: string;
  description: string;
  downPayment: number;
  cost: number;
  mortgage: number;
  cashFlow: number;
}

export interface BusinessAsset {
  id: string;
  description: string;
  downPayment: number;
  cost: number;
  liability: number;
  cashFlow: number;
}

export interface FastTrackBusiness {
  id: string;
  description: string;
  cost: number;
  monthlyCashflow: number;
}

export type StandardDebtKey =
  | "homeMortgage"
  | "schoolLoan"
  | "carLoan"
  | "creditCard"
  | "retailDebt"
  | "bankLoans";

export interface TransactionLog {
  id: string;
  timestamp: string;
  action: string;
  amount?: number;
  details: string;
  type: "income" | "expense" | "asset" | "debt" | "milestone" | "system";
}

export interface CashflowGameState {
  id: string;
  slotName: string;
  updatedAt: string;
  playerName: string;
  auditorName: string;
  phase: GamePhase;
  professionId: string;
  professionName: string;
  selectedDreamId: string;
  selectedDreamName: string;
  selectedDreamCost: number;

  // Dinheiro em mãos disponível no momento (Caixa)
  cashOnHand: number;

  // Estado da Fase 1: Corrida dos Ratos
  ratRace: {
    salary: number;
    savings: number; // Economias originais anotadas no balanço
    childrenCount: number; // Máximo 3 filhos
    perChildCost: number;

    // Ingressos e Ativos
    interests: InterestItem[];
    stocks: StockAsset[];
    realEstates: RealEstateAsset[];
    businesses: BusinessAsset[];

    // Gastos Fixos Mensais
    expenses: {
      taxes: number;
      homeMortgage: number;
      schoolLoan: number;
      carLoan: number;
      creditCard: number;
      retailDebt: number;
      otherExpenses: number;
    };

    // Obrigações (Passivos)
    liabilities: {
      homeMortgage: number;
      schoolLoan: number;
      carLoan: number;
      creditCard: number;
      retailDebt: number;
      bankLoans: number; // Múltiplos de $1.000 (gera 10% nos gastos mensais)
    };
  };

  // Estado da Fase 2: Pista Rápida (Saída da Corrida dos Ratos)
  fastTrack: {
    passiveIncomeFromRatRace: number; // Ingresso passivo arredondado ao sair
    initialCashflowDayIncome: number; // Passivo x 100
    targetIncomeToWin: number; // Inicial + $50.000
    dreamPurchased: boolean;
    businesses: FastTrackBusiness[];
  };

  // Histórico de Auditoria
  history: TransactionLog[];
}

export interface ComputedRatRaceMetrics {
  interestIncome: number;
  dividendIncome: number;
  realEstateIncome: number;
  businessIncome: number;
  passiveIncome: number;
  totalIncome: number;
  childrenExpense: number;
  bankLoanExpense: number;
  totalExpenses: number;
  monthlyCashFlow: number;
  freedomPercentage: number;
  canExitRatRace: boolean;
  totalAssetsCost: number;
  totalLiabilities: number;
}

export interface ComputedFastTrackMetrics {
  businessesCashflow: number;
  currentCashflowDayIncome: number;
  cashflowGainProgress: number;
  cashflowGainPercentage: number;
  remainingToWinByCashflow: number;
  hasWonByCashflow: boolean;
  hasWonByDream: boolean;
  hasWonGame: boolean;
}


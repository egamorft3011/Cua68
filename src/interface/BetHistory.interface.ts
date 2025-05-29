export interface BetHistory {
  dataExport: BetHistoryItem[];
  page: number;
  kmess: number;
  total: number;
}

export interface BetHistoryItem {
  id: number;
  uid: number;
  username: string;
  betAmount: number;
  validBetAmount: number;
  winAmount: string;
  netPnl: string;
  currency: string;
  transactionTime: Date;
  gameCode: string;
  gameName: string;
  betOrderNo: string;
  betTime: string;
  productType: number;
  gameCategory: string;
  sessionId: string;
  status: {
    type: string;
    allowNull: boolean;
    defaultValue: string;
  };
}
export interface transactionHistoryItem {
  
}
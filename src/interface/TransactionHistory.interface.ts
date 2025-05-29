export interface TransactionHistory {
  dataExport: TransactionHistoryItem[];
  page: number;
  kmess: number;
  total: number;
}

export interface TransactionHistoryItem {
  id: number;
  uid: number;
  bankProvide: string;
  bankNumber: string;
  bankName: string;
  transId: string;
  amount: number;
  info: string;
  type: string;
  status:string
}

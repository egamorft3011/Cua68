export interface PaymentHistory {
  dataExport: {
    id: number;
    uid: number;
    bankProvide: string;
    bankNumber: string;
    bankName: string;
    transId: string;
    type: {
      type: string;
      allowNull: boolean;
    };
    amount: number;
    info: string;
    status: {
      type: string;
      allowNull: boolean;
      defaultValue: string;
    };
  };
  page: number;
  kmess: number;
  total: number;
}

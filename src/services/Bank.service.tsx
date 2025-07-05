import { contentInstance } from "@/configs/CustomizeAxios";

// lấy lịch sử cá cược

const getBettingHistory = (
  page: number,
  limit: number,
  from: string,
  to: string
) => {
  return contentInstance.get(
    `/api/game/history?page=${page}&limit=${limit}&from=${from}&to=${to}`
  );
};

// get lịch sử giao dịch
const getTransactionHistory = (
  page: number,
  limit: number,
  from: string,
  to: string
) => {
  return contentInstance.get(
    `/api/payment/history?page=${page}&limit=${limit}&from=${from}&to=${to}`
  );
};

// get lịch sử giao dịchv2
const getHistoryTransaction = (
  page: number,
  limit: number,
  from: string,
  to: string
) => {
  return contentInstance.get(
    `/api/payment/history/transaction?page=${page}&limit=${limit}&from=${from}&to=${to}`
  );
};

// Lấy tài khoản ngân hàng nạp tiền của admin
const getListBankPayment = () => {
  return contentInstance.get("/api/payment/getListManualBank");
};

// Lấy tất cả tài khoản của user
const getListUserBank = () => {
  return contentInstance.get("/api/payment/getListUserBank");
};

// Lấy tất cả danh sách Ngân hàng
const getListAllBank = () => {
  return contentInstance.get("/api/payment/getListBankDeposit");
};

// Lấy tất cả danh sách Ngân hàng
const checkSecurityPass = () => {
  return contentInstance.get("api/auth/check-security-passwd");
};
// Tạo QR bank nộp tiền
const createQRBank = (bank: string, amountDeposit: number) => {
  return contentInstance.post("/api/payment/createRequestQR", {
    bank,
    amountDeposit,
  });
};

// add tài khoảng ngân hàng
const addBankUser = (
  bankProvide: string,
  bankName: string,
  bankNumber: string,
  bankBranch: string
) => {
  return contentInstance.post("/api/payment/userAddBank", {
    bankProvide,
    bankName,
    bankNumber,
    bankBranch,
  });
};

const createRequestManualBank = (
  bank: string,
  nameDeposit: string,
  bankDeposit: string,
  numberDeposit: string,
  transIdDeposit: string,
  amountDeposit: number
) => {
  return contentInstance.post("/api/payment/createRequestManualBank", {
    bank,
    nameDeposit,
    bankDeposit,
    numberDeposit,
    transIdDeposit,
    amountDeposit,
  });
};

const changePassSecurity = (
  oldPassword: string,
  newPassword: string,
  newPasswordConfirm: string
) => {
  return contentInstance.post("/api/auth/change-password-security", {
    oldPassword,
    newPassword,
    newPasswordConfirm,
  });
};

// api rút tiền
const withdrawalsUser = (
  bankName: string,
  bankNumber: string,
  bankProvide: string,
  amount: number,
  passwd: string,
  agencyId?: string
) => {
  const data: any = {
    bankProvide,
    bankName,
    bankNumber,
    amount,
    passwd,
  };

  if (agencyId) {
    data.agency = agencyId;
  }

  return contentInstance.post("/api/payment/createRequestWithdraw", data);
};

export {
  getBettingHistory,
  getTransactionHistory,
  getHistoryTransaction,
  withdrawalsUser,
  addBankUser,
  createQRBank,
  getListAllBank,
  getListBankPayment,
  getListUserBank,
  checkSecurityPass,
  changePassSecurity,
  createRequestManualBank,
};

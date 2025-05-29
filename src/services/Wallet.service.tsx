import { contentInstance } from "@/configs/CustomizeAxios";

// Lấy thông tin số dư ví game SB
const getWalletGameSBByUser = () => {
  return contentInstance.get(`/api/game/wallets/SB`);
};

// Lấy thông tin số dư ví game sexy
const getWalletGameByUser = (id: string) => {
  return contentInstance.get(`/api/game/wallets/${id}`);
};

//check cập nhập số dư
const getCheckBalanceUpdateByUser = () => {
  return contentInstance.get(`/api/game/balanceUpdate`);
};

const walletTransfer = (amount: number, type: string, transferType: number) => {
  return contentInstance.post(`/api/game/wallet-transfer`, {
    amount,
    type,
    transferType,
  });
};
export {
  getWalletGameSBByUser,
  getWalletGameByUser,
  getCheckBalanceUpdateByUser,
  walletTransfer,
};

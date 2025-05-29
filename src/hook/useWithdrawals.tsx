import { GameConfig } from "@/configs/GameConfig";
import { getPlayGameById } from "@/services/GameApi.service";
import { getWalletGameByUser, walletTransfer } from "@/services/Wallet.service";

export default function useWithdrawals() {
  GameConfig.map(async (item) => {
    const WalletUser: any = await getWalletGameByUser(item.code);
    if (WalletUser.status === true && WalletUser.balance > 0) {
      await walletTransfer(WalletUser.balance, String(item.type), 2);
    }
  });

  return;
}

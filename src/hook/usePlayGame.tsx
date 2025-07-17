import { GameConfig } from "@/configs/GameConfig";
import { getPlayGameById } from "@/services/GameApi.service";
import { walletTransfer } from "@/services/Wallet.service";
import { useState } from "react";
import swal from "sweetalert";
import useAuth from "./useAuth";

export default function usePlayGame() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const playGame = async (
    code: string,
    id: string,
    onError?: (error: any) => void
  ): Promise<string | null> => {
    setLoading(true);

    if (!user) {
      swal("Lỗi", "Bạn chưa đăng nhập", "error");
      setLoading(false);
      return null;
    }

    if (user?.role == "agency") {
      swal("Lỗi", "Tài khoản đại lý không thể chơi game", "error");
      setLoading(false);
      return null;
    }

    const dataGame = GameConfig.find((item) => item.code === id);

    try {
      // Gọi API để lấy URL game
      const res: any = await getPlayGameById(code, id);
      
      // Chuyển tiền vào ví game
      const wallet: any = await walletTransfer(
        user.coin,
        String(dataGame?.type),
        1
      );

      if (res.status === false) {
        swal("Lỗi", res.msg, "error");
        setLoading(false);
        return null;
      }

      if (res?.data?.playUrl && wallet) {
        setLoading(false);
        return res.data.playUrl; // Trả về URL để sử dụng trong iframe
      } else {
        swal("Lỗi", res.msg, "error");
        setLoading(false);
        return null;
      }
    } catch (error) {
      console.log("error", error);
      swal("Lỗi", "Có lỗi xảy ra khi tải game", "error");
      setLoading(false);
      if (onError) onError(error);
      return null;
    }
  };

  return { loading, playGame };
}
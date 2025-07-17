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
    setLoading(true); // Bắt đầu trạng thái loading
    
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

    const tempWindow = window.open("", "_blank");
    const dataGame = GameConfig.find((item) => item.code === id);
    // const res: any = await getPlayGameById(code, id);
    if (!tempWindow) {
      swal(
        "Chuyển tiền không thành công",
        "Cửa sổ bật lên bị chặn bởi trình duyệt. Vui lòng cho phép cửa sổ bật lên.",
        "error"
      );
      setLoading(false); // Dừng trạng thái loading
      return null;
    }

    try {
      // Sử dụng code và id từ tham số vào API
      const res: any = await getPlayGameById(code, id);

      const wallet: any = await walletTransfer(
        user.coin,
        String(dataGame?.type),
        1
      );

      if (res.status === false) {
        tempWindow.close(); // Đóng tab nếu không có URL
        swal("Lỗi", res.msg, "error");
        setLoading(false); // Dừng trạng thái loading
        return null;
      }
      if (res?.data?.playUrl && wallet) {
        tempWindow.location.href = res.data.playUrl;
        setLoading(false); // Dừng trạng thái loading sau khi đã mở tab mới
        return res.data.playUrl; // Trả về URL nếu có
      } else {
        tempWindow.close(); // Đóng tab nếu không có URL
        swal("Lỗi", res.msg, "error");
        setLoading(false); // Dừng trạng thái loading
        return null;
      }
    } catch (error) {
      tempWindow.close();
      console.log("error", error);

      swal("Lỗi", "Bạn chưa đăng nhập", "error");
      setLoading(false);
      if (onError) onError(error);
      return null;
    }
  };

  return { loading, playGame };
}

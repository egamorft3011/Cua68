"use client";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import "./profile.css";
import axios from "axios";
import { useMediaQuery, useTheme } from "@mui/material";
import swal from "sweetalert";
import { withdrawalsUser, getListUserBank } from "@/services/Bank.service";
import { formatCurrency } from "@/utils/formatMoney";
import { useRouter } from "next/navigation";

interface Agent {
  stt: number;
  daiLy: string;
  nickname: string;
  phone: string;
  contact: string[];
  id: string;
}

const AgentList: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bankUser, setBankUser] = useState<any>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [amountMoney, setAmountMoney] = useState<string>("");
  const [amount, setAmount] = useState<number | null>(null);
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  // Gọi API khi component mount
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await axios.get("https://api1.cua68.com/api/info/agency");
        if (response.status) {
          const data = response.data.data.data;
          setAgents(
            data.map((item: any, index: number) => ({
              stt: index + 1,
              daiLy: item.AgencyInfo?.code || item.name || "Unknown",
              nickname: item.username || "Unknown",
              phone: item.phone || "Chưa có",
              contact: [],
              id: item.id || item.AgencyInfo?.id || "Unknown",
            }))
          );
          setLoading(false);
        } else {
          throw new Error(`Yêu cầu API thất bại với mã trạng thái: ${response.status}`);
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError("Không tìm thấy API. Vui lòng kiểm tra endpoint.");
        } else {
          setError(err.message || "Đã có lỗi xảy ra khi lấy dữ liệu");
        }
        setLoading(false);
      }
    };

    const fetchBankListByUser = async () => {
      try {
        const response = await getListUserBank();
        const availableBanks = response.data;
        if (Array.isArray(availableBanks) && availableBanks.length > 0) {
          setBankUser(availableBanks[0]);
        } else {
          setBankUser(null);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách ngân hàng:", error);
        setBankUser(null);
      }
    };

    fetchAgents();
    fetchBankListByUser();
  }, []);

  // Hàm xử lý nhập số tiền
  const handleAmountMoney = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value.replace(/[^0-9]/g, "");
    const numericValue = rawValue ? parseInt(rawValue, 10) : null;
    setAmountMoney(numericValue ? formatCurrency(numericValue) : "");
    if (numericValue === null || numericValue >= 200000) {
      setAmount(numericValue);
    } else {
      setAmount(null);
    }
  };

  // Hàm xử lý nhập mật khẩu
  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  // Hàm xử lý rút tiền
  const handleWithdraw = async (agencyId: string) => {
    if (!amount || amount < 200000) {
      swal("Rút tiền", "Số tiền cần rút phải từ 200,000 VNĐ trở lên", "warning");
      return;
    }
    if (!password) {
      swal("Rút tiền", "Vui lòng nhập mật khẩu", "warning");
      return;
    }
    if (!bankUser || !bankUser.bankName || !bankUser.bankNumber || !bankUser.bankProvide) {
      swal("Ngân hàng", "Chưa thêm tài khoản ngân hàng", "error");
      return;
    }

    try {
      const res: any = await withdrawalsUser(
        bankUser.bankName,
        bankUser.bankNumber,
        bankUser.bankProvide,
        Number(amount),
        password,
        agencyId
      );
      if (res.status === true) {
        swal("Rút tiền", "Tạo lệnh rút tiền thành công", "success");
        setOpenDialog(false);
        setAmountMoney("");
        setPassword("");
        router.refresh();
        router.push("/profile/transaction-history/");
      } else {
        swal("Rút tiền", res.msg, "error");
      }
    } catch (error) {
      swal("Rút tiền", "Đã có lỗi xảy ra. Vui lòng thử lại.", "error");
    }
  };

  // Hàm mở dialog rút tiền
  const handleOpenDialog = (agencyId: string) => {
    if (!bankUser) {
      swal({
        title: "Không tìm thấy ngân hàng",
        text: "Vui lòng thêm tài khoản ngân hàng!",
        icon: "warning",
      });
      router.push("/profile/");
      return;
    }
    setSelectedAgentId(agencyId);
    setOpenDialog(true);
  };

  // Hàm đóng dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setAmountMoney("");
    setPassword("");
    setSelectedAgentId(null);
  };

  // Hàm hiển thị biểu tượng liên hệ
  const renderContactIcons = (contacts: string[]) => {
    if (!contacts || contacts.length === 0) {
      return "Chưa có";
    }
    return contacts.map((contact, index) => {
      if (contact === "messenger") return <span key={index} role="img" aria-label="Messenger">📩</span>;
      if (contact === "facebook") return <span key={index} role="img" aria-label="Facebook">👍</span>;
      if (contact === "zalo") return <span key={index} role="img" aria-label="Zalo">📱</span>;
      return null;
    });
  };

  if (loading) {
    return <Typography sx={{ color: "#fff", textAlign: "center" }}>Đang tải dữ liệu...</Typography>;
  }

  if (error) {
    return <Typography sx={{ color: "#ff0000", textAlign: "center" }}>{error}</Typography>;
  }

  return (
    <Box sx={{ backgroundColor: "#401c1c", padding: "20px", borderRadius: "10px", color: "#fff" }}>
      <Typography
        variant={isMobile ? "h5" : "h4"}
        sx={{ textAlign: "center", color: "#ffd700", marginBottom: "10px", fontWeight: 700 }}
      >
        DANH SÁCH ĐẠI LÝ
      </Typography>

      <Box sx={{ width: "100%" }}>
        <Box
          sx={{
            backgroundColor: "#2d1313",
            borderRadius: 5,
            color: "#ffd700",
            marginBottom: "5px",
            padding: "10px",
            display: { xs: "none", sm: "none", md: "flex", lg: "flex" },
            justifyContent: "space-between",
            minWidth: "600px",
          }}
        >
          <Typography sx={{ flex: 1 }}>STT</Typography>
          <Typography sx={{ flex: 2 }}>ĐẠI LÝ</Typography>
          <Typography sx={{ flex: 2 }}>NICKNAME</Typography>
          <Typography sx={{ flex: 2 }}>SỐ ĐIỆN THOẠI</Typography>
          <Typography sx={{ flex: 1 }}>LIÊN HỆ</Typography>
          <Typography sx={{ flex: 1 }}>GIAO DỊCH</Typography>
        </Box>

        {agents.map((agent) => (
          <Box
            key={agent.stt}
            sx={{
              backgroundColor: "#5d2d2d",
              borderRadius: 5,
              color: "white",
              marginBottom: "8px",
              padding: "10px",
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: isMobile ? "flex-start" : "space-between",
              alignItems: isMobile ? "flex-start" : "center",
              minWidth: isMobile ? "100%" : "600px",
            }}
          >
            {isMobile ? (
              <>
                <Box
                  sx={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ fontWeight: 600, color: "white" }}>{`${agent.stt}`}</Typography>
                  <Typography sx={{ fontWeight: 600, color: "white" }}>{agent.daiLy}</Typography>
                  <Button
                    sx={{
                      background: "#4c0101",
                      color: "white",
                      borderRadius: "5px",
                      textTransform: "none",
                      fontSize: "14px",
                      padding: "4px 10px",
                      fontWeight: 600,
                    }}
                    onClick={() => handleOpenDialog(agent.id)}
                  >
                    Rút tiền
                  </Button>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    fontSize: "16px",
                    color: "#ddd",
                    width: "100%",
                    marginTop: "6px",
                    gap: "2px",
                  }}
                >
                  <Typography sx={{ fontSize: "16px" }}>
                    <strong>Nickname:</strong> {agent.nickname}
                  </Typography>
                  <Typography sx={{ fontSize: "16px" }}>
                    <strong>SĐT:</strong> {agent.phone}
                  </Typography>
                  <Typography sx={{ fontSize: "16px" }}>
                    <strong>Liên hệ:</strong> {renderContactIcons(agent.contact)}
                  </Typography>
                </Box>
              </>
            ) : (
              <>
                <Typography sx={{ flex: 1 }}>{`${agent.stt} ⭐⭐`}</Typography>
                <Typography sx={{ flex: 2 }}>{agent.daiLy}</Typography>
                <Typography sx={{ flex: 2 }}>{agent.nickname}</Typography>
                <Typography sx={{ flex: 2 }}>{agent.phone}</Typography>
                <Typography sx={{ flex: 1 }}>{renderContactIcons(agent.contact)}</Typography>
                <Typography sx={{ flex: 1 }}>
                  <Button
                    sx={{
                      background: "#4c0101",
                      color: "white",
                      borderRadius: "5px",
                      textTransform: "none",
                      fontSize: "16px",
                      width: "100%",
                      fontWeight: 600,
                    }}
                    onClick={() => handleOpenDialog(agent.id)}
                  >
                    Rút tiền
                  </Button>
                </Typography>
              </>
            )}
          </Box>
        ))}
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Rút tiền qua đại lý</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ marginBottom: "15px", marginTop: "10px" }}>
            <Typography sx={{ color: "#73879a", fontSize: 14, mb: 1 }}>
              Nhập Số Tiền Cần Rút <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              sx={{
                backgroundColor: "#442a2a",
                borderRadius: "8px",
                "& .MuiInputBase-input": { color: "white" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { border: "none" },
                  "&:hover fieldset": { border: "none" },
                  "&.Mui-focused fieldset": { border: "none" },
                },
              }}
              fullWidth
              value={amountMoney}
              onChange={handleAmountMoney}
              placeholder="Từ 200,000đ trở lên"
              inputProps={{ inputMode: "numeric" }}
              type="text"
            />
          </FormControl>
          <FormControl fullWidth>
            <Typography sx={{ color: "#73879a", fontSize: 14, mb: 1 }}>
              Nhập Mật Khẩu <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              sx={{
                backgroundColor: "#442a2a",
                borderRadius: "8px",
                "& .MuiInputBase-input": { color: "white" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { border: "none" },
                  "&:hover fieldset": { border: "none" },
                  "&.Mui-focused fieldset": { border: "none" },
                },
              }}
              fullWidth
              value={password}
              onChange={handlePassword}
              placeholder="Nhập mật khẩu"
              type="password"
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button
            onClick={() => selectedAgentId && handleWithdraw(selectedAgentId)}
            variant="contained"
            sx={{
              backgroundImage:
                "url(/images/bg-btn.png), conic-gradient(from 0deg at 50% 50%, #ff0808 0deg, #e02626 89.73deg, #e02626 180.18deg, #ff0808 1turn)",
              color: "white",
              borderRadius: "20px",
              textTransform: "none",
            }}
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AgentList;
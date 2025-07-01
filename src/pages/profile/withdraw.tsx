"use client";
import LoadingComponent from "@/components/Loading";
import useAuth from "@/hook/useAuth";
import {
  BankIcon,
  BankMenuIcon,
  ProfileBettingHistory,
  ProfileDeposit,
  ProfileDiscount,
  ProfileEmptyIcon,
  ProfileGeneral,
  ProfileTransHistory,
  ProfileUserInfo,
  ProfileWBankAccount,
  ProfileWithdraw,
} from "@/shared/Svgs/Svg.component";
import {
  Avatar,
  Box,
  Button,
  CardContent,
  FormControl,
  Grid,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Select,
  Step,
  Stepper,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Tab from "@mui/material/Tab";
import SimpleBackdrop from "@/components/Loading/LoaddingPage";
import { contentInstance } from "@/configs/CustomizeAxios";
import { error } from "console";
import {
  changePassSecurity,
  checkSecurityPass,
  getListUserBank,
  withdrawalsUser,
} from "@/services/Bank.service";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import "./profile.css";
import swal from "sweetalert";
import { formatCurrency } from "@/utils/formatMoney";
import Image from "next/image";


interface WithdrawProps {
  goToTab?: (index: number) => void;
}

export default function Withdraw({ goToTab }: WithdrawProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [bankUser, setBankUser] = useState<any>();
  const [load, setLoad] = useState<boolean>(false);
  const [amountMoney, setAmountMoney] = useState<string>();
  const [amount, setAmount] = useState<number | null>();
  const [checkpass, setCheckpass] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [rePassword, setRePassword] = useState<string>("");

  useEffect(() => {
    fetchBankListByUser();
    CheckPass();
  }, []);
  const handleAmountMoney = (event: React.ChangeEvent<HTMLInputElement>) => {
    // setAmountMoney(event.target.value);
    // Allow only numbers (strip commas, decimals, and other characters)
    const rawValue = event.target.value.replace(/[^0-9]/g, "");
    const numericValue = rawValue ? parseInt(rawValue, 10) : null;
    setAmountMoney(numericValue ? formatCurrency(numericValue) : "");
    // Validate: only allow values > 50,000
    if (numericValue === null || numericValue > 50000) {
      setAmount(numericValue);
    } else {
      setAmount(null);
    }
  };

  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };
  const handleRePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRePassword(event.target.value);
  };

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const fetchBankListByUser = async () => {
    try {
      const response = await getListUserBank();
      const availableBanks = response.data;
      console.log("availableBankList", availableBanks);
      setBankUser(availableBanks[0]);
    } catch (error) {
      console.error("availableBankList is error", error);
    }
  };
  const CheckPass = async () => {
    try {
      const response: any = await checkSecurityPass();
      console.log("response", response);

      setCheckpass(response.isUpdated);
    } catch (error) {
      console.error("availableBankList is error", error);
    }
  };
  const WithdrawUser = async () => {
    if (!bankUser || bankUser === undefined || bankUser === "") {
      swal("Ngân hàng", "Chưa thêm tài khoản ngân hàng", "error");
    }
    if (!bankUser.bankName || !bankUser.bankNumber || !bankUser.bankProvide) {
      swal("Ngân hàng", "Chưa thêm tài khoản ngân hàng", "error");
    }
    if (bankUser && password !== "" && amount !== 0) {
      setLoad(true);
      withdrawalsUser(
        bankUser.bankName,
        bankUser.bankNumber,
        bankUser.bankProvide,
        Number(amount),
        password
      ).then((res: any) => {
        if (res.status === true) {
          setLoad(false);
          swal(
            "Rút tiền",
            "Tạo lệnh rút tiền thành công",
            "Vui lòng kiểm tra lịch sử giao dịch",
            "success"
          );
          router.push("/profile/transaction-history/");
        } else {
          setLoad(false);
          swal("Rút tiền", res.msg, "error");
          router.refresh();
        }
      });
    } else {
      swal("Rút tiền", "Vui lòng điền đẩy đủ thông tin", "warning");
    }
  };
  const UpdatePassWithdraw = async () => {
    setLoad(true);
    changePassSecurity("", password, rePassword).then((res: any) => {
      if (res.status === true) {
        setLoad(false);
        swal("Tạo mật khẩu", "Tạo mật khẩu rút tiền thành công", "success");
        router.refresh();
      } else {
        setLoad(false);
        swal("Tạo mật khẩu", res.msg, "error");
      }
    });
  };
  return (
    <Grid
      container
      sx={{
        backgroundColor: "#4f2323",
        width: "100%",
        borderRadius: "8px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: { xs: "column", sm: "row" },
        padding: 2,
      }}
    >
      {checkpass === true ? (
        <Grid
          container
          sx={{
            width: { xs: "100%", sm: "51%" },
            spacing: 1,
          }}
        >
          <Box
            sx={{
              width: "100%",
              marginBottom: 8,
              display: "flex",
              gap: "10px",
              justifyItems: "left",
              justifyContent: "left",
              borderBottom: "1px solid rgba(56, 67, 117, .3)",
            }}
          >
            <Button
              sx={{
                display: "flex",
                backgroundImage:
                  "url(/images/bg-btn.png), conic-gradient(from 0deg at 50% 50%, #ff0808 0deg, #e02626 89.73deg, #e02626 180.18deg, #ff0808 1turn)",
                color: "white",
                borderRadius: "5px",
                textTransform: "none",
                fontSize: "14px",
                width: "300px",
                height: "38px",
                border: "none",
                alignItems: "center",
                justifyContent: "center",
                justifyItems: "center",
                cursor: "pointer",
                fontWeight: 600,
                margin: 0,
              }}
            >
              <BankIcon /> Chuyển khoản ngân hàng
            </Button>
            <Button
              sx={{
                display: "flex",
                background: "#4c0101",
                color: "white",
                borderRadius: "5px",
                textTransform: "none",
                fontSize: "14px",
                width: "150px",
                height: "38px",
                border: "none",
                alignItems: "center",
                justifyContent: "center",
                justifyItems: "center",
                cursor: "pointer",
                fontWeight: 600,
                margin: 0,
              }}
              onClick={() => goToTab?.(5)}
            >
              <BankMenuIcon />

              Đại lý
            </Button>
          </Box>
          <Box sx={{ marginBottom: 2, width: "100%" }}>
            {bankUser ? (
              <Box sx={{ marginBottom: "15px" }}>
                <Typography sx={{ marginBottom: 1 }}>Ngân Hàng</Typography>
                <ListItem
                  sx={{
                    backgroundColor: "#5d2d2d",
                    width: "100%",
                    borderRadius: 5,
                    color: "white",
                  }}
                >
                  <ListItemAvatar>
                    <Avatar>
                      <AccountBalanceIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    color="white"
                    primary={bankUser?.bankName}
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{ color: "white", display: "inline" }}
                        >
                          {bankUser?.bankNumber || "0155784205502"}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
              </Box>
            ) : (
              <Box sx={{ marginBottom: "15px" }}></Box>
            )}
            <Grid item xs={24} md={12} sx={{ marginBottom: "15px" }}>
              <FormControl fullWidth sx={{ margin: "auto" }}>
                <Typography sx={{ color: "#73879a", fontSize: 14, mb: 1 }}>
                  {" "}
                  Nhập Số Tiền Cần Rút
                  <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  sx={{
                    backgroundColor: "#442a2a",
                    borderRadius: "8px",
                    "& .MuiInputBase-input": {
                      color: "white",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        border: "none",
                      },
                      "&:hover fieldset": {
                        border: "none",
                      },
                      "&.Mui-focused fieldset": {
                        border: "none",
                      },
                    },
                  }}
                  fullWidth
                  value={amountMoney} // Display formatted input with commas
                  onChange={handleAmountMoney}
                  placeholder="Từ 50,000đ trở lên"
                  inputProps={{
                    inputMode: "numeric", // Optimize for numeric input on mobile
                  }}
                  type="text"
                />
              </FormControl>
            </Grid>
            <Grid item xs={24} md={12}>
              <FormControl fullWidth>
                <Typography sx={{ color: "#808691", fontSize: 14, mb: 1 }}>
                  Nhập Mật Khẩu <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  sx={{
                    backgroundColor: "#442a2a",
                    borderRadius: "8px",
                    "& .MuiInputBase-input": {
                      color: "white",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        border: "none",
                      },
                      "&:hover fieldset": {
                        border: "none",
                      },
                      "&.Mui-focused fieldset": {
                        border: "none",
                      },
                    },
                  }}
                  fullWidth
                  value={password} // Display formatted input with commas
                  onChange={handlePassword}
                  placeholder="Nhập mật khẩu"
                  type="password"
                />
              </FormControl>
            </Grid>
          </Box>

          {/* Generate QR Code Button */}
          <Box sx={{ marginTop: 2, width: "100%" }}>
            <Button
              fullWidth
              variant="contained"
              color="success"
              onClick={() => WithdrawUser()}
              sx={{
                display: "flex",
                backgroundImage:
                  "url(/images/bg-btn.png), conic-gradient(from 0deg at 50% 50%, #ff0808 0deg, #e02626 89.73deg, #e02626 180.18deg, #ff0808 1turn)",
                color: "white",
                borderRadius: "20px",
                textTransform: "none",
                fontSize: "14px",
                width: "250px",
                height: "38px",
                border: "none",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                margin: "auto",
              }}
            >
              Rút Tiền
            </Button>
          </Box>

          <Box
            sx={{
              width: "100%",
              color: "white",
              padding: 2,
              borderRadius: "8px",
              marginTop: 5,
              border: "1px dashed #4c0101",
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: "#fbc16c", fontWeight: "bold", marginBottom: 1 }}
            >
              Lưu ý:
            </Typography>
            <ul style={{ paddingLeft: 20, margin: 0 }}>
              <li style={{ listStyle: "outside" }}>
                <Typography variant="body2" sx={{ color: "white" }}>
                  Nạp/Rút tiền tại tài khoản chính chủ.
                </Typography>
              </li>
              <li style={{ listStyle: "outside" }}>
                <Typography variant="body2" sx={{ color: "white" }}>
                  Nạp tiền vào tài khoản bên cạnh.
                </Typography>
              </li>
            </ul>
          </Box>
        </Grid>
      ) : (
        <Grid
          container
          sx={{
            width: { xs: "100%", sm: "51%" },
            spacing: 1,
          }}
        >
          {bankUser && checkpass && (
            <Box
              sx={{
                width: "100%",
                marginBottom: 8,
                display: "flex",
                gap: "10px",
                justifyItems: "left",
                justifyContent: "left",
                borderBottom: "1px solid rgba(56, 67, 117, .3)",
              }}
            >
              <Button
                sx={{
                  display: "flex",
                  backgroundImage:
                    "url(/images/bg-btn.png), conic-gradient(from 0deg at 50% 50%, #ff0808 0deg, #e02626 89.73deg, #e02626 180.18deg, #ff0808 1turn)",
                  color: "white",
                  borderRadius: "5px",
                  textTransform: "none",
                  fontSize: "14px",
                  width: "150px",
                  height: "38px",
                  border: "none",
                  alignItems: "center",
                  justifyContent: "center",
                  justifyItems: "center",
                  cursor: "pointer",
                  fontWeight: 600,
                  margin: "auto",
                  marginTop: "-20px",
                }}
              >
                <BankIcon /> Ví điện tử
              </Button>
            </Box>
          )}
          <Box sx={{ marginBottom: 1, width: "100%" }}>
            {bankUser && checkpass && (
              <Box sx={{ marginBottom: "15px" }}>
                <Typography sx={{ marginBottom: 1 }}>Ngân Hàng</Typography>
                <ListItem
                  sx={{
                    backgroundColor: "#5d2d2d",
                    width: "100%",
                    borderRadius: 5,
                    color: "white",
                  }}
                >
                  <ListItemAvatar>
                    <Avatar>
                      <AccountBalanceIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    color="white"
                    primary={bankUser?.bankName}
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{ color: "white", display: "inline" }}
                        >
                          {bankUser?.bankNumber || "0155784205502"}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
              </Box>
            )}

            <Grid item xs={24} md={12}>
              <Typography
                variant="h3"
                sx={{
                  color: "white",
                  fontSize: "25px",
                  marginTop: "-150px",
                  marginBottom: 4,
                }}
              >
                Thêm mật khẩu rút tiền
              </Typography>
              <FormControl fullWidth sx={{ color: " #808691", fontSize: 14, mb: 1, mt: 2, }}>
                <Typography
                  sx={{ color: " #808691", fontSize: 14, mb: 1, mt: 2, marginTop: "55px" }}
                  
                >
                 Nhập Mật Khẩu
                </Typography> 
                <TextField
                
                  sx={{
                    backgroundColor: "#442a2a",
                    borderRadius: "8px",
                    "& .MuiInputBase-input": {
                      color: "white",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        border: "none",
                      },
                      "&:hover fieldset": {
                        border: "none",
                      },
                      "&.Mui-focused fieldset": {
                        border: "none",
                      },
                    },
                  }}
                  fullWidth
                  value={password} // Display formatted input with commas
                  onChange={handlePassword}
                  placeholder="Nhập mật khẩu"
                  type="password"
                />
              </FormControl>
            </Grid>
            <Grid item xs={24} md={12}>
              <FormControl fullWidth>
                <Typography
                  sx={{ color: "#808691", fontSize: 14, mb: 1, mt: 2 }}
                >
                  Nhập lại Mật Khẩu <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  sx={{
                    backgroundColor: "#442a2a",
                    borderRadius: "8px",
                    "& .MuiInputBase-input": {
                      color: "white",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        border: "none",
                      },
                      "&:hover fieldset": {
                        border: "none",
                      },
                      "&.Mui-focused fieldset": {
                        border: "none",
                      },
                    },
                  }}
                  fullWidth
                  value={rePassword} // Display formatted input with commas
                  onChange={handleRePassword}
                  placeholder="Nhập lại mật khẩu"
                  type="password"
                />
              </FormControl>
            </Grid>
          </Box>

          {/* Generate QR Code Button */}
          <Box sx={{ marginTop: 2, width: "100%" }}>
            <Button
              fullWidth
              variant="contained"
              color="success"
              onClick={() => UpdatePassWithdraw()}
              sx={{
                display: "flex",
                backgroundImage:
                  "url(/images/bg-btn.png), conic-gradient(from 0deg at 50% 50%, #ff0808 0deg, #e02626 89.73deg, #e02626 180.18deg, #ff0808 1turn)",
                color: "white",
                borderRadius: "20px",
                textTransform: "none",
                fontSize: "14px",
                width: "250px",
                height: "38px",
                border: "none",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                margin: "auto",
              }}
            >
              Thêm mật khẩu rút tiền
            </Button>
          </Box>
        </Grid>
      )}
      {/* Instructions */}
      <Grid
        container
        sx={{
          width: { xs: "100%", sm: "47%" },
          spacing: 2,
          borderRadius: 5,
          padding: 1,
          height: { xs: "auto", sm: "auto" },
          marginTop: { xs: 2, sm: 0 },
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Image
          src={"/images/banner-crypto.webp"}
          width={500}
          height={500}
          alt=""
          style={{ width: "100%", objectFit: "contain" }}
        />
      </Grid>
    </Grid>
  );
}

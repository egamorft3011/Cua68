/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  TextField,
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Autocomplete,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import PersonIcon from "@mui/icons-material/Person";
import useAuth from "@/hook/useAuth";
import Image from "next/image";
import swal from "sweetalert";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import {
  AccountProfileIcon,
  ProfileBankIcon,
  ProfileEmptyIcon,
  WalletIcon,
} from "@/shared/Svgs/Svg.component";
import { formatCurrency } from "@/utils/formatMoney";
import {
  addBankUser,
  getListAllBank,
  getListUserBank,
} from "@/services/Bank.service";
import BankSelect from "@/components/Input/BankSelect.component";
type bank = {
  name: string;
  code: string;
};
export default function MainProfile() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("account"); // Quản lý tab: "account" hoặc "bank"
  const [bankUser, setBankUser] = useState<any>(null);
  const [load, setLoad] = useState<boolean>(false);
  const [bank, setBank] = useState<bank | null>();
  // State cho tab Quản lý tài khoản
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("********");
  const [bankNumber, setBankNumber] = useState<string>("");
  const [availableBankList, setAvailableBankList] = useState<bank[]>([]);

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setDisplayName(user.name || "");
      setPhone(user.phone || "");
      setEmail(user.email || "");
    }
  }, [user]);
  const fetchBankList = async () => {
    try {
      const response = await getListAllBank();
      const availableBanks = response.data;
      console.log("availableBankList", availableBanks);
      setAvailableBankList(availableBanks); // Update state with fetched data
    } catch (error) {
      console.error("availableBankList is error", error);
    }
  };

  const fetchBankListByUser = async () => {
    try {
      const response = await getListUserBank();
      const availableBanks = response.data;
      // setBankUser(null);
      setBankUser(availableBanks[0]);
    } catch (error) {
      console.error("availableBankList is error", error);
    }
  };

  useEffect(() => {
    fetchBankList();
    fetchBankListByUser();
  }, []);
  const handleSaveAccount = async () => {
    try {
      const updatedData = {
        username,
        name: displayName,
        phone,
        email,
      };

      const response = await fetch(`/update-info-user/${user.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        alert("Thông tin người dùng đã được cập nhật thành công!");
      } else {
        alert("Cập nhật thông tin thất bại.");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      alert("Đã xảy ra lỗi khi cập nhật thông tin.");
    }
  };

  const addbankNewUser = async () => {
    if (bank) {
      setLoad(true);
      addBankUser(bank.code, bank.code, bankNumber, bank.name).then(
        (res: any) => {
          console.log(res.data.length);
          if (res?.status === true) {
            setLoad(false);
            swal("Thêm ngân hàng", "Thêm ngân hàng mới thành công", "Success");
          } else {
            setLoad(false);
            swal("Thêm ngân hàng", res.msg, "error");
          }
        }
      );
    } else {
      swal("Thêm ngân hàng", "Vui lòng điền đầy đủ thông tin", "warning");
    }
  };

  if (loading) {
    return <Typography>Đang tải...</Typography>;
  }

  return (
    <Box
      sx={{
        paddingTop: "100px",
        paddingBottom: "10px",
      }}
    >
      <Box
        sx={{
          color: "white",
          padding: 2,
          borderRadius: 2,
          height: {
            xs: "auto",
            sm: "auto",
          },
          width: "93%",
          margin: "auto",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            alignItems: "center",
            backgroundImage:
              "url(https://staticda88.com/images/account/layout/account-info.webp)",
            backgroundSize: "100% 100%",
            borderRadius: "8px",
            display: {
              xs: "none",
              sm: "flex",
            },
            gap: "10px",
            height: "66px",
            minWidth: "400px",
            padding: "8px 34px",
            marginBottom: "20px",
          }}
        >
          <Avatar
            alt="User Avatar"
            src="/images/avatar-4.webp"
            sx={{ width: 40, height: 40 }}
          />
          <Box sx={{ display: "grid", gridTemplateRows: "1fr 1fr" }}>
            <Typography sx={{ color: "white", fontWeight: "600" }}>
              {user?.username || "N/A"}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <Image
                src={"/images/vip-1.webp"}
                width={15}
                height={16}
                alt=""
                style={{ objectFit: "contain" }}
              />
              <Typography sx={{ color: "white", fontWeight: "600" }}>
                VIP 1
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              width: "2px",
              height: "100%",
              background: "#3887fe",
              marginLeft: "20px",
              marginRight: "20px",
            }}
          ></Box>
          <Box sx={{ display: "flex", gap: "10px" }}>
            <WalletIcon />
            <Typography sx={{ color: "white", fontWeight: "600" }}>
              Ví của tôi
            </Typography>
            <Typography sx={{ color: "#fbc16c", fontWeight: "600" }}>
              {formatCurrency(user?.coin ?? 0)}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            backgroundColor: "#232b4f",
            color: "white",
            padding: 2,
            borderRadius: 2,
            height: {
              xs: "auto",
              sm: "auto",
            },
            width: "100%",
            margin: "auto",
          }}
        >
          {/* Navigation Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              paddingBottom: "20px",
            }}
          >
            <Button
              variant="contained"
              sx={{
                mr: 1,
                backgroundColor:
                  activeTab === "account" ? "#3B82F6" : "#4c0101",
                "&:hover": {
                  backgroundColor:
                    activeTab === "account" ? "#2563EB" : "#4A5894",
                },
              }}
              onClick={() => setActiveTab("account")}
            >
              <AccountProfileIcon /> Quản lý tài khoản
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: activeTab === "bank" ? "#3B82F6" : "#4c0101",
                "&:hover": {
                  backgroundColor: activeTab === "bank" ? "#2563EB" : "#4A5894",
                },
              }}
              onClick={() => setActiveTab("bank")}
            >
              <ProfileBankIcon /> Quản lý ngân hàng
            </Button>
          </Box>

          {/* Tab Content */}
          {activeTab === "account" ? (
            // Tab Quản lý tài khoản
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" sx={{ mb: 1, color: "white" }}>
                  Tên đăng nhập
                </Typography>
                <TextField
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <PersonIcon sx={{ color: "#4ADE80", mr: 1 }} />
                    ),
                    sx: {
                      backgroundColor: "#2A4066",
                      color: "white",
                      borderRadius: 1,
                      "& .MuiInputBase-input.Mui-disabled": {
                        color: "white",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" sx={{ mb: 1, color: "white" }}>
                  Email
                </Typography>
                <TextField
                  value={email || "Nhập email của bạn"}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <EmailIcon sx={{ color: "#4ADE80", mr: 1 }} />
                    ),
                    sx: {
                      backgroundColor: "#2A4066",
                      color: "white",
                      borderRadius: 1,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" sx={{ mb: 1, color: "white" }}>
                  Tên hiển thị
                </Typography>
                <TextField
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <PersonIcon sx={{ color: "#4ADE80", mr: 1 }} />
                    ),
                    sx: {
                      backgroundColor: "#2A4066",
                      color: "white",
                      borderRadius: 1,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" sx={{ mb: 1, color: "white" }}>
                  Mật khẩu
                </Typography>
                <TextField
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <LockIcon sx={{ color: "#4ADE80", mr: 1 }} />
                    ),
                    sx: {
                      backgroundColor: "#2A4066",
                      color: "white",
                      borderRadius: 1,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" sx={{ mb: 1, color: "white" }}>
                  Số điện thoại
                </Typography>
                <TextField
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <PhoneIcon sx={{ color: "#4ADE80", mr: 1 }} />
                    ),
                    sx: {
                      backgroundColor: "#2A4066",
                      color: "white",
                      borderRadius: 1,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundImage:
                      "url(https://staticda88.com/images/bg-btn.png), conic-gradient(from 0deg at 50% 50%, #ff0808 0deg, #e02626 89.73deg, #e02626 180.18deg, #ff0808 1turn)",
                    mt: 4,
                    width: "100%",
                    height: "44px",
                    borderRadius: "20px",
                    color: "white",
                  }}
                >
                  Lưu thay đổi
                </Button>
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={2}>
              {bankUser ? (
                <>
                  <ListItem
                    sx={{
                      alignItems: "center",
                      alignSelf: "stretch",
                      background:
                        "linear-gradient(90deg, rgba(39, 47, 82, .5), rgba(78, 87, 126, .5))",
                      backgroundImage: "url(/images/bg-bank.webp)",
                      backgroundPosition: "50%",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      borderRadius: "8px",
                      display: "flex",
                      height: "68px",
                      justifyContent: "space-between",
                      padding: "12px",
                      width: {
                        xs: "90%",
                        sm: "30%",
                      },
                      margin: "auto",
                      marginTop: "20px",
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <AccountBalanceIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      color="white"
                      primary={bankUser.bankName}
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            sx={{ color: "white", display: "inline" }}
                          >
                            {bankUser?.bankNumber !== ""
                              ? bankUser?.bankNumber
                              : "012145522112"}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                </>
              ) : (
                <>
                  <Box
                    sx={{
                      width: "60%",
                      margin: "auto",
                      mt: 4,
                      p: 3,
                      backgroundColor: "#2A4066",
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="h6" sx={{ color: "white", mb: 2 }}>
                      Thêm tài khoản ngân hàng
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6} sm={12}>
                        <Typography
                          variant="body1"
                          sx={{ mb: 1, color: "white" }}
                        >
                          Tên ngân hàng
                        </Typography>
                        <BankSelect
                          options={availableBankList}
                          value={bank ?? null}
                          onChange={setBank}
                        />
                      </Grid>
                      <Grid item xs={6} sm={12}>
                        <Typography
                          variant="body1"
                          sx={{ mb: 1, color: "white" }}
                        >
                          Số tài khoản
                        </Typography>
                        <TextField
                          fullWidth
                          variant="outlined"
                          placeholder="Nhập số tài khoản"
                          value={bankNumber}
                          onChange={(e) => setBankNumber(e.target.value)}
                          InputProps={{
                            sx: {
                              backgroundColor: "#3B4D7A",
                              color: "white",
                              borderRadius: 1,
                            },
                          }}
                          // Add onChange handler and state for bank number
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Button
                          variant="contained"
                          onClick={addbankNewUser}
                          sx={{
                            mt: 2,
                            width: "100%",
                            backgroundImage:
                              "url(https://staticda88.com/images/bg-btn.png), conic-gradient(from 0deg at 50% 50%, #ff0808 0deg, #e02626 89.73deg, #e02626 180.18deg, #ff0808 1turn)",
                            borderRadius: "20px",
                            color: "white",
                          }}
                        >
                          Thêm ngân hàng
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </>
              )}
            </Grid>
          )}
        </Box>
      </Box>
    </Box>
  );
}

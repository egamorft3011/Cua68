"use client";
import LoadingComponent from "@/components/Loading";
import useAuth from "@/hook/useAuth";
import "./profile.css";
import {
  BankIcon,
  BankMenuIcon,
  CopyIcon,
  EventMoblieIcon,
  GiftMenuIcon,
  HistoryMenuIcon,
  NapIcon,
  NapMenuIcon,
  ProfileBankIcon,
  RutIcon,
  RutMenuIcon,
  VipIcon,
} from "@/shared/Svgs/Svg.component";
import {
  Box,
  Button,
  Grid,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  createQRBank,
  createRequestManualBank,
  getListBankPayment,
} from "@/services/Bank.service";
import swal from "sweetalert";
import { toast } from "react-toastify";
import Image from "next/image";
import DepostQRBankComponent from "@/components/popup/DepostQRBank.component";
import SimpleBackdrop from "@/components/Loading/LoaddingPage";
import "./profile.css";
import NavigationGame from "@/hook/NavigationGame";
import Withdraw from "./withdraw";
import TransactionHistory from "./History";
import Promotion from "./promotion";
import VipProgress from "./vipProgress";
import AgentList from "./agentList";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
interface TabPProps {
  value: number;
  history: string | null;
}
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}
const formatCurrency = (value: any) => {
  if (!value && value !== 0) return "";
  // Format as integer with comma separators
  return Number(value).toLocaleString("vi-VN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};
export default function Deposit(props: TabPProps) {
  const { user, loading } = useAuth();
  const [load, setLoad] = useState<boolean>(false);
  const [bankAdmin, setBankAdmin] = useState<any>();
  const [bankList, setBankList] = useState<any[]>([]);
  const router = useRouter();
  const [qrData, setQrData] = useState<any | null>(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const [value, setValue] = useState(props.value ?? (user ? 0 : 0));
  const [amount, setAmount] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState<string>(""); // Track raw input
  const instructionsRef = useRef<HTMLDivElement>(null); // Ref for Instructions Grid

  const agnecyBool = props.value === 5 ? 1 : 0;
  useEffect(() => {
    setValue(user ? props.value : agnecyBool); // Default to Khuyến mãi (index 0) if not authenticated
  }, [props.value, user]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    // Reset timer when the dialog is opened
    if (qrData) {
      setTimeLeft(30 * 60); // Reset to 30 minutes
    }

    let timer: NodeJS.Timeout;

    if (qrData) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(timer); // Stop timer when timeLeft reaches 0
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer); // Cleanup timer when component unmounts or dialog closes
  }, [qrData]);

  // Scroll to Instructions Grid on mobile when qrData is set
  useEffect(() => {
    if (qrData && instructionsRef.current && window.innerWidth < 600) {
      // xs breakpoint ~600px
      instructionsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center", // Center the Instructions Grid in the viewport
      });
    }
  }, [qrData]);

  // Format timeLeft into MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const copyToClipboard = (text: any) => {
    navigator.clipboard.writeText(text);
    alert(`sao chép: ${text}`);
  };

  useEffect(() => {
    getListBankPayment().then((res) => {
      if (res.status && res.data.length > 0) {
        setBankList(res.data);
        setBankAdmin(res.data[0]); // Set default to first bank
      }
    });
  }, []);

  const handleBankChange = (bank: any) => {
    setBankAdmin(bank);
  };

  const quickOptions = [
    50000, 100000, 200000, 300000, 400000, 500000, 1000000, 2000000,
  ];

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers (strip commas, decimals, and other characters)
    const rawValue = event.target.value.replace(/[^0-9]/g, "");
    const numericValue = rawValue ? parseInt(rawValue, 10) : null;

    // Update input value for display (with commas)
    setInputValue(numericValue ? formatCurrency(numericValue) : "");

    // Validate: only allow values > 50,000
    if (numericValue === null || numericValue > 50000) {
      setAmount(numericValue);
    } else {
      setAmount(null);
    }
  };

  const deposit = () => {
    if (bankAdmin && amount) {
      setLoad(true);
      // Send integer value to backend
      createQRBank(bankAdmin?.bankProvide, Math.floor(Number(amount))).then(
        (res: any) => {
          if (res.status === true) {
            console.log(res);
            setQrData(res);
            setLoad(false);
          } else {
            swal("Nạp tiền", res.msg, "error");
            setLoad(false);
          }
        }
      );
    } else {
      swal(
        "Nạp Tiền",
        "Không thể nạp tiền vào lúc này, Vui lòng nạp tiền vào thời điểm khác",
        "error"
      );
    }
  };

  const RequestDeposit = () => {
    if (bankAdmin && amount) {
      setLoad(true);
      // Send integer value to backend
      createRequestManualBank(
        "nope",
        qrData?.inforPayment.bankName,
        qrData?.inforPayment.bankProvide,
        qrData?.inforPayment.bankNumber,
        qrData?.inforPayment.fullContent,
        Number(amount)
      ).then((res: any) => {
        if (res.status === true) {
          swal(
            "Nạp tiền",
            "Hệ thống sẽ tự động kiểm tra và thêm điểm cho bạn",
            "success"
          );
          setQrData(null);
          setAmount(null);
          setInputValue("");
        }
      });
    }
  };

  // Tabs with authenticate
  const tabs = user
    ? [
        {
          label: "Nạp Tiền",
          icon: (
            <RutIcon
              width="25px"
              height="25px"
              fill={value === 0 ? "white" : undefined}
            />
          ),
          index: 0,
        },
        {
          label: "Rút Tiền",
          icon: (
            <NapIcon
              width="25px"
              height="25px"
              fill={value === 1 ? "white" : undefined}
            />
          ),
          index: 1,
        },
        {
          label: "Lịch sử",
          icon: (
            <HistoryMenuIcon
              width="25px"
              height="25px"
              fill={value === 2 ? "white" : undefined}
            />
          ),
          index: 2,
        },
        {
          label: "Khuyến mãi",
          icon: (
            <GiftMenuIcon
              width="23px"
              height="23px"
              fill={value === 3 ? "white" : undefined}
            />
          ),
          index: 3,
        },
        {
          label: "Cấp độ VIP",
          icon: (
            <VipIcon
              width="23px"
              height="25px"
              fill={value === 4 ? "white" : undefined}
            />
          ),
          index: 4,
        },
        {
          label: "Danh Sách Đại Lý",
          icon: (
            <BankMenuIcon
              width="23px"
              height="25px"
              fill={value === 5 ? "white" : undefined}
            />
          ),
          index: 5,
        },
      ]
    : [
        {
          label: "Khuyến mãi",
          icon: (
            <GiftMenuIcon
              width="23px"
              height="23px"
              fill={value === 0 ? "white" : undefined}
            />
          ),
          index: 0,
        },
        {
          label: "Danh sách dại lý",
          icon: (
            <BankMenuIcon
              width="23px"
              height="23px"
              fill={value === 0 ? "white" : undefined}
            />
          ),
          index: 1,
        },
      ];

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: { xs: "97%", sm: "80%" },
        height: "auto",
        paddingTop: { xs: 9, sm: 12 },
        paddingBottom: { xs: 1, sm: "20px" },
        margin: "auto",
        gap: 2,
      }}
    >
      <Box
        sx={{
          width: "100%",
          borderRadius: 6.5,
          backgroundColor: "#4f2323",
        }}
      >
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            backgroundColor: "#240202",
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            sx={{
              "& .MuiTab-root": {
                color: "white",
                "&.Mui-selected": {
                  backgroundColor: " #4f2323",
                  color: "white",
                  borderRadius: "10px 10px 0px 0px",
                },
              },
              "& .MuiTabs-indicator": {
                backgroundColor: " #4f2323",
              },
            }}
            aria-label="Profile navigation tabs"
          >
            {tabs.map((tab) => (
              <Tab
                key={tab.index}
                label={tab.label}
                icon={tab.icon}
                iconPosition="start"
                {...a11yProps(tab.index)}
              />
            ))}
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          {user ? (
            <Grid
              container
              sx={{
                backgroundColor: " #4f2323",
                width: "100%",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: { xs: "column", sm: "row" },
                padding: 2,
              }}
            >
              <Grid
                container
                sx={{
                  width: { xs: "100%", sm: "51%" },
                  spacing: 1,
                }}
              >
                <Box sx={{ marginBottom: 8, display: "flex", gap: "10px" }}>
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
                    }}
                  >
                    <BankIcon /> Ví điện tử
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
                      margin: "auto",
                    }}
                    onClick={() => setValue(user ? 5 : 1)}
                  >
                   <BankMenuIcon />

                    Đại lý
                  </Button>
                </Box>
                <Box sx={{ marginBottom: 2, width: "100%" }}>
                  <Grid display={"flex"} justifyContent={"space-between"}>
                    <Typography
                      sx={{ color: "white", marginBottom: 2, fontWeight: 600 }}
                      variant="body2"
                      gutterBottom
                    >
                      Chọn ngân hàng
                    </Typography>
                  </Grid>
                  <Grid container sx={{ flexWrap: "wrap", gap: "10px" }}>
                    {bankList.map((bank) => (
                      <Grid item key={bank.id}>
                        <Button
                          sx={{
                            width: "150px",
                            height: "60px",
                            background: bankAdmin?.id === bank.id
                              ? "linear-gradient(45deg, #008AFF 30%, #2692e0 90%)"
                              : "linear-gradient(45deg, #3A4566 30%, #59638d 90%)",
                            color: "white",
                            borderRadius: "8px",
                            padding: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            transition: "all 0.3s",
                            "&:hover": {
                              background: "linear-gradient(45deg, #ff0000 30%, #e02626 90%)",
                            },
                            boxShadow: bankAdmin?.id === bank.id
                              ? "0 4px 8px rgba(255, 0, 0, 0.3)"
                              : "0 2px 4px rgba(0, 0, 0, 0.2)",
                          }}
                          onClick={() => handleBankChange(bank)}
                        >
                          <Image
                            src={`/images/banklist/${bank.bankProvide.toLowerCase()}.png`}
                            width={100}
                            height={100}
                            alt={bank.bankProvide}
                            style={{ objectFit: "contain" }}
                          />
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
                <Box sx={{ marginBottom: 2, width: "100%" }}>
                  <Grid display={"flex"} justifyContent={"space-between"}>
                    <Typography
                      sx={{ color: "white", marginBottom: 2, fontWeight: 600 }}
                      variant="body2"
                      gutterBottom
                    >
                      Nhập số tiền cần nạp (đ)
                    </Typography>
                  </Grid>
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
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="Từ 50,000đ trở lên"
                    inputProps={{
                      inputMode: "numeric",
                    }}
                    type="text"
                  />
                </Box>
                <Box sx={{ marginBottom: 2, width: "100%" }}>
                  <Grid
                    container
                    sx={{ flexWrap: "wrap", gap: "10px", width: "100%" }}
                  >
                    {quickOptions.map((option) => (
                      <Grid item key={option}>
                        <Button
                          sx={{
                            minWidth: "135px",
                            backgroundColor:
                              amount === option ? "#ff0000" : "#8d5959",
                            color: amount === option ? "#fff" : "#fff",
                            fontWeight: "bold",
                            borderRadius: "8px",
                            cursor: "pointer",
                            transition: "all 0.3s",
                            "&:hover": {
                              backgroundColor: "#ff0000",
                            },
                          }}
                          onClick={() => {
                            setAmount(option);
                            setInputValue(formatCurrency(option));
                          }}
                        >
                          {Number(option).toLocaleString("vi-VN")}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
                <Box sx={{ marginTop: 2, width: "100%" }}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    onClick={() => deposit()}
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
                    Tạo Mã QR nạp
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
              <Grid
                container
                ref={instructionsRef}
                sx={{
                  width: { xs: "100%", sm: "47%" },
                  spacing: 2,
                  borderRadius: 5,
                  padding: 1,
                  backgroundColor: "#5d2d2d",
                  height: { xs: "auto", sm: "auto" },
                  marginTop: { xs: 2, sm: 0 },
                  gap: { xs: 2, sm: 0 },
                }}
              >
                <Box
                  sx={{
                    padding: { xs: "5px", sm: "10px" },
                    textAlign: "center",
                    width: { xs: "90%", sm: "100%" },
                    margin: "auto",
                  }}
                >
                  <Image
                    width={80}
                    height={80}
                    src={qrData?.qrCodeUrl ?? "/images/deposit-qr.webp"}
                    alt="QR Code"
                    style={{
                      width: "auto",
                      height: "150px",
                      borderRadius: "8px",
                      marginBottom: "15px",
                    }}
                  />
                  <Typography
                    variant="h5"
                    sx={{
                      color: "#ff4d4f",
                      fontWeight: "bold",
                      marginBottom: "15px",
                    }}
                  >
                    {qrData ? formatTime(timeLeft) : ""}
                  </Typography>
                  <Stack spacing={2}>
                    {[
                      {
                        label: "Ngân hàng",
                        value: qrData?.inforPayment.bankProvide,
                      },
                      {
                        label: "Số tài khoản",
                        value: qrData?.inforPayment.bankNumber,
                      },
                      {
                        label: "Chủ tài khoản",
                        value: qrData?.inforPayment.bankName,
                      },
                      {
                        label: "Số tiền nạp",
                        value: qrData?.inforPayment.amount
                          ? formatCurrency(qrData?.inforPayment.amount)
                          : "...",
                      },
                      {
                        label: "Mã chuyển tiền",
                        value: qrData?.inforPayment.fullContent,
                      },
                    ].map((item, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontSize: "12px",
                          lineHeight: "10px",
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: "bold",
                            fontSize: "12px",
                          }}
                        >
                          {item.label ?? "..."}
                        </Typography>
                        <Stack direction="row" spacing={1}>
                          <Typography
                            sx={{
                              fontWeight: "bold",
                              color: "white",
                              fontSize: "12px",
                              textAlign: "right",
                            }}
                          >
                            {item.value ?? "..."}
                          </Typography>
                          {qrData ? (
                            <Button
                              size="small"
                              onClick={() => copyToClipboard(item.value)}
                            >
                              <CopyIcon />
                            </Button>
                          ) : (
                            ""
                          )}
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                  {qrData ? (
                    <button
                      style={{
                        display: "flex",
                        backgroundImage:
                          "url(/images/bg-btn.png), conic-gradient(from 0deg at 50% 50%, #ff0808 0deg, #e02626 89.73deg, #e02626 180.18deg, #ff0808 1turn)",
                        color: "white",
                        borderRadius: "20px",
                        textTransform: "none",
                        fontSize: "14px",
                        width: "200px",
                        height: "38px",
                        border: "none",
                        alignItems: "center",
                        justifyContent: "center",
                        justifyItems: "center",
                        cursor: "pointer",
                        fontWeight: 600,
                        margin: "auto",
                        marginTop: "15px",
                      }}
                      onClick={RequestDeposit}
                    >
                      Xác nhận đã nạp tiền
                    </button>
                  ) : (
                    ""
                  )}
                </Box>
              </Grid>
            </Grid>
          ) : (
            <>
              <Typography
                variant="h5"
                sx={{ fontWeight: 600, color: "white", mb: 1 }}
              >
                Danh sách khuyến mãi
              </Typography>
              <Promotion />
            </>
          )}
        </CustomTabPanel>
        {!user && (
          <CustomTabPanel value={value} index={1}>
            <AgentList />
          </CustomTabPanel>
        )}
        {user && (
          <>
            <CustomTabPanel value={value} index={1}>
              <Withdraw goToTab={setValue} />
            </CustomTabPanel>

            <CustomTabPanel value={value} index={2}>
              <TransactionHistory value={props.history ?? "transaction"} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>
              <Box
                sx={{
                  width: "100%",
                  height: { xs: 150, md: 250 },
                  backgroundImage: "url('https://z1.zbet.tv/bmp/61397dba1944b1ec02b087a53471a123/hero_banner/vi/event-banner.webp?HMEOp?a=2')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: 2,
                  mb: 3,
                }}
              />
              <Typography
                variant="h5"
                sx={{ fontWeight: 600, color: "white", mb: 1 }}
              >
                Danh sách khuyến mãi
              </Typography>
              <Promotion />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={4}>
              <VipProgress />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={5}>
              <AgentList />
            </CustomTabPanel>
          </>
        )}
      </Box>
    </Box>
  );
}
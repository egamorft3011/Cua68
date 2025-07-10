"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "@mui/material";
import { formatCurrency } from "@/utils/formatMoney";
import {
  BankMenuIcon,
  GiftMenuIcon,
  HistoryBetMenuIcon,
  HistoryMenuIcon,
  HoanIcon,
  LiveChatMenuIcon,
  LogoutMenuIcon,
  NapMenuIcon,
  P2PMenuIcon,
  ProfileIcon,
  RutMenuIcon,
  VipIcon,
} from "@/shared/Svgs/Svg.component";
import { contentInstance } from "@/configs/CustomizeAxios";
import { userResponse } from "@/interface/user.interface";
import { PageConfig } from "@/interface/PageConfig.interface";
import ClaimFunds from "./ClaimFunds";

export interface UserProps {
  user: {
    coin: number;
    username: string;
  };
  pageConfig: PageConfig;
  status?: string;
  message?: string;
}

export default function MenuProfileMobile({ user: initialUser, message, pageConfig }: UserProps) {
  const [anchorEl1, setAnchorEl1] = React.useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [user, setUser] = React.useState(initialUser);
  const open1 = Boolean(anchorEl1);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Hàm gọi API để lấy dữ liệu người dùng
  const fetchUserData = async () => {
    const token = window.localStorage.getItem("tokenCUA68");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const response: UserProps = await contentInstance.get("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status) {
        setUser({
          coin: response.user.coin,
          username: response.user.username,
        });
      } else {
        console.error("Lỗi từ API");
        router.push("/");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API /api/auth/me:", error);
      router.push("/");
    }
  };

  // Gọi API khi URL thay đổi hoặc component mount
  React.useEffect(() => {
    fetchUserData();
  }, [pathname, searchParams]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleClick1 = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl1(event.currentTarget);
  };

  const handleClose1 = () => {
    setAnchorEl1(null);
  };

  const handleMenuItemClick = (onClick: () => void) => {
    onClick();
    handleDrawerClose();
  };

  const menuItems = [
    {
      text: "Quản lý tài khoản",
      icon: <ProfileIcon />,
      onClick: () => router.push("/profile"),
    },
    {
      text: "Quản lý ngân hàng",
      icon: <BankMenuIcon />,
      onClick: () => router.push("/profile"),
    },
    {
      text: "Khuyến mãi",
      icon: <GiftMenuIcon />,
      onClick: () => router.push("/promotion"),
    },
    {
      text: "Cấp độ VIP",
      icon: <VipIcon />,
      onClick: () => router.push("/vip"),
    },
    {
      text: "Lịch sử giao dịch",
      icon: <HistoryMenuIcon />,
      onClick: () => router.push("/profile/transaction-history"),
    },
    {
      text: "Lịch sử cược",
      icon: <HistoryBetMenuIcon />,
      onClick: () => router.push("/profile/betting-history"),
    },
    {
      text: "Live chat 24/7",
      icon: <LiveChatMenuIcon />,
      onClick: () => window.open(pageConfig.contact.telegram, "_blank"),
    },
  ];

  const drawerList = () => (
    <Box
      sx={{
        width: 350,
        background: "#4f2323",
        color: "white",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
      role="presentation"
    >
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px",
          borderBottom: "1px solid #562f2f",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Avatar src="/images/avatar-4.webp" sx={{ width: 40, height: 40 }} />
          <Box>
            <Typography sx={{ fontSize: "16px", fontWeight: "bold" }}>
              {user?.username || "huyn19e6bffa5"}
            </Typography>
            <Typography sx={{ fontSize: "12px", color: "#fbc16c" }}>
              Ví của tui {formatCurrency(user?.coin ?? 0)}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={handleDrawerClose}>
          <CloseIcon sx={{ color: "white" }} />
        </IconButton>
      </Box>

      {/* Action Buttons */}
      <Box
        sx={{
          display: "flex",
          gap: "12px",
          padding: "16px",
          borderBottom: "1px solid #562f2f",
        }}
      >
        <Button
          onClick={() =>
            handleMenuItemClick(() => router.push("/profile/account-withdraw"))
          }
          sx={{
            flex: 1,
            backgroundImage:
              "url(/images/bg-btn.png), conic-gradient(from 0deg at 50% 50%, #ff0808 0deg, #e02626 89.73deg, #e02626 180.18deg, #ff0808 1turn)",
            color: "white",
            borderRadius: "20px",
            textTransform: "none",
            fontSize: "14px",
            "&:hover": {
              backgroundImage:
                "url(/images/bg-btn.png), conic-gradient(from 0deg at 50% 50%, #ff0808 0deg, #e02626 89.73deg, #e02626 180.18deg, #ff0808 1turn)",
            },
          }}
        >
          <RutMenuIcon />
          RÚT
        </Button>
        <Button
          onClick={() => handleMenuItemClick(() => router.push("/profile/account-deposit"))}
          sx={{
            flex: 1,
            backgroundImage:
              "url(/images/bg-btn.png), conic-gradient(from 0deg at 50% 50%, #1f50d6 0deg, #4a02ff 89.73deg, #003daf 180.18deg, #2b1fd6 1turn)",
            color: "white",
            borderRadius: "20px",
            textTransform: "none",
            fontSize: "14px",
            "&:hover": {
              background: "#e00000",
            },
          }}
        >
          <NapMenuIcon />
          NẠP
        </Button>
      </Box>

      {/* Menu Items */}
      <List sx={{ flex: 1 }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            disablePadding
            sx={{
              padding: "0 4.2666666667vw 4.2666666667vw",
            }}
          >
            <ListItemButton
              onClick={() => handleMenuItemClick(item.onClick)}
              sx={{
                padding: "2.6666666667vw 0",
                height: "12.8vw",
                "&:hover": {
                  background: "#2f3b56",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: "40px" }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: "3.7333333333vw !important",
                  lineHeight: "5.3333333333vw !important",
                  fontFamily: "Lexend, sans-serif !important",
                  fontWeight: "400 !important",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Sign Out Button */}
      <Box sx={{ padding: "16px", borderTop: "1px solid #562f2f" }}>
        <Button
          onClick={() =>
            handleMenuItemClick(() => {
              window.localStorage.removeItem("tokenCUA68");
              window.localStorage.removeItem("txInfo");
              window.location.href = "/";
            })
          }
          sx={{
            width: "100%",
            background: "transparent",
            color: "white",
            border: "1px solid #562f2f",
            borderRadius: "8px",
            textTransform: "none",
            fontSize: "14px",
            padding: "8px 0",
            "&:hover": {
              background: "#562f2f",
            },
          }}
        >
          <LogoutMenuIcon />
          ĐĂNG XUẤT
        </Button>
      </Box>
    </Box>
  );

  return (
    <React.Fragment>
      <Box
        sx={{
          display: "flex",
          gap: "8px",
          justifyContent: "flex-end",
          background: "#1a263f",
          borderRadius: "20px",
          marginLeft: "-20px",
        }}
      >
        <Tooltip title={formatCurrency(user?.coin ?? 0)}>
          <Button
            sx={{
              background: "#1a263f",
              color: "#fbc16c",
              borderRadius: "16px",
              padding: "4px 12px",
              fontSize: "14px",
              textTransform: "none",
              maxWidth: "80px",
              width: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              display: "block",
              "&:hover": {
                background: "#562f2f",
              },
            }}
          >
            {formatCurrency(user?.coin ?? 0)}
          </Button>
        </Tooltip>
        <Button
          onClick={() => router.push("/profile/account-deposit")}
          sx={{
            backgroundImage:
              "url(/images/bg-btn.png), conic-gradient(from 0deg at 50% 50%, #d61f1f 0deg, #ff0202 89.73deg, #af0036 180.18deg, #d61f1f 1turn)",
            color: "white",
            borderRadius: "16px",
            margin: "6px 0px",
            fontSize: "10px",
            textTransform: "none",
            "&:hover": {
              background: "#e00000",
            },
          }}
        >
          NẠP
        </Button>
        <Button
          onClick={() => router.push("/agency")}
          sx={{
            backgroundImage:
              "url(/images/bg-btn.png), conic-gradient(from 0deg at 50% 50%, #ff9900 0deg, #ff6600 90deg, #ff3300 180deg, #ff6600 270deg, #ff9900 360deg)",
            color: "white",
            borderRadius: "16px",
            margin: "6px 0px",
            fontSize: "10px",
            textTransform: "none",
            "&:hover": {
              background: "#e00000",
            },
          }}
        >
          ĐẠI LÝ
        </Button>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            aria-controls={drawerOpen ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={drawerOpen ? "true" : undefined}
          >
            <Avatar
              src="/images/avatar-4.webp"
              sx={{ width: 32, height: 32 }}
            ></Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerClose}
        sx={{
          zIndex: 9999999,
          "& .MuiDrawer-paper": {
            background: "#4f2323",
            border: "none",
            borderRadius: "0",
          },
        }}
      >
        {drawerList()}
      </Drawer>
      <ClaimFunds refreshUserData={fetchUserData} />
    </React.Fragment>
  );
}
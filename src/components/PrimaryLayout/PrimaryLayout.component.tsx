"use client";
import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import HeaderPage from "../../pages/Header/Header.page";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import swal from "sweetalert";
import MenuI from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import SportsEsports from '@mui/icons-material/SportsEsports';
import {
  AccountBalance,
  AccountBalanceWallet,
  AccountCircle,
  CardGiftcard,
  Support,
  Menu,
  Event,
  History,
  Campaign,
  Diamond,
  AccountCircleOutlined,
} from "@mui/icons-material";
import LoadingComponent from "../Loading";
import { getMe } from "@/services/User.service";
import { GameConfig } from "@/configs/GameConfig";
import { getWalletGameByUser, walletTransfer } from "@/services/Wallet.service";
import MenuPopupComponent from "../popup/MenuPopup.component";
import SearchPopupComponent from "../popup/SearchPopup.component";
import SupportPopupComponent from "../popup/SupportPopup.component";
import DialogLogin from "../login/loginForm";
import "./PrimaryLayout.css";
import {
  CasioIcon,
  DPGameIcon,
  SportsIcon,
} from "@/shared/Svgs/Svg.component";
import { Button, Drawer, Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar, IconButton, Typography } from "@mui/material";
import MiniGameComponent from "../popup/MiniGameComponent";
import MiniGameIframeComponent from "../popup/MiniGameIframeComponent";
import Draggable from "react-draggable";
import { pageInfo } from "@/services/Info.service";
import { PageConfig } from "@/interface/PageConfig.interface";
import FloatingRefund from "../popup/RefundComponent";
import axios from "axios";
import { userResponse } from "@/interface/user.interface";
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
import CloseIcon from "@mui/icons-material/Close";

// Lazy load components
const SidebarPage = dynamic(() => import("../../pages/Sidebar/Sidebar.page"), {
  ssr: false,
});
const FooterPage = dynamic(() => import("@/pages/Footer/Footer.page"), {
  ssr: false,
});

interface PrimaryLayoutProps {
  children: React.ReactNode;
  pageConfig: PageConfig;
  user?: userResponse;
}

export default function PrimaryLayoutComponent({ children, pageConfig, user }: PrimaryLayoutProps) {
  const [menu, setMenu] = useState<number | undefined>(undefined);
  const router = useRouter();
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [openSupport, setOpenSupport] = useState(false);
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [currentUser, setUser] = useState<any>(null);
  const [load, setLoad] = useState(true);
  const [isMiniGameOpen, setIsMiniGameOpen] = useState(false);
  const [isIframeOpen, setIsIframeOpen] = useState(false);
  const nodeRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Define handleClick before handleMenu
  const handleClick = () => {
    setDrawerOpen(true);
  };

  const handleOpenMiniGame = () => {
    if (!isDragging) {
      setIsMiniGameOpen(true);
      setIsIframeOpen(false);
    }
  };

  const handleStart = () => {
    setIsDragging(true);
    console.log("Dragging started");
  };

  const handleDrag = () => {
    console.log("Dragging...");
  };

  const handleStop = () => {
    setIsDragging(false);
    console.log("Dragging stopped");
  };

  const handleCloseMiniGame = () => {
    setIsMiniGameOpen(false);
  };

  const handleOpenIframe = async () => {
    setIsIframeOpen(true);
  };

  const handleCloseIframe = () => {
    setIsIframeOpen(false);
  };

  const handleClose = () => setOpen(false);

  const handleLoginDialogClose = () => setOpenLoginDialog(false);

  const handleDrawerClose = () => {
    setDrawerOpen(false);
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
    // {
    //   text: "Hoàn Tiền",
    //   icon: <HoanIcon />,
    //   onClick: () => router.push("/profile/account-withdraw"),
    // },
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
    {
      text: 'Game Yêu Thích',
      icon: <SportsEsports sx={{ color: '#ff9a9a' }} />,
      onClick: () => router.push('/profile/favorite-games'),
    },
  ];

  const drawerList = () => (
    <Box
      id="drawer-list"
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
              {currentUser?.username || "huyn19e6bffa5"}
            </Typography>
            <Typography sx={{ fontSize: "12px", color: "#fbc16c" }}>
              Ví của tui {formatCurrency(currentUser?.coin ?? 0)}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={handleDrawerClose}>
          <CloseIcon sx={{ color: "white" }} />
        </IconButton>
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: "12px",
          padding: "16px",
          borderBottom: "1px solid #562f2f",
        }}
      >
        <Button
          onClick={() => {
            if (currentUser) {
              router.push("/profile/account-withdraw");
            } else {
              setOpenLoginDialog(true);
            }
            handleDrawerClose();
          }}
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
          onClick={() => {
            if (currentUser) {
              router.push("/profile/account-deposit");
            } else {
              setOpenLoginDialog(true);
            }
            handleDrawerClose();
          }}
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
              onClick={() => {
                if (["Quản lý tài khoản", "Quản lý ngân hàng", "Hoàn Tiền", "Lịch sử giao dịch", "Lịch sử cược"].includes(item.text) && !currentUser) {
                  setOpenLoginDialog(true);
                } else {
                  item.onClick();
                }
                handleDrawerClose();
              }}
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
      <Box sx={{ padding: "16px", borderTop: "1px solid #562f2f" }}>
        <Button
          onClick={() => {
            window.localStorage.removeItem("tokenCUA68");
            window.localStorage.removeItem("txInfo");
            window.location.href = "/";
          }}
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

  // Renamed hanldMenu to handleMenu
  const handleMenu = (menu: number) => {
    setMenu(menu);
    setOpenSupport(false);

    switch (menu) {
      case 1: // Nạp Tiền
        if (currentUser) {
          router.replace("/profile/account-deposit/");
        } else {
          swal("Vui lòng đăng nhập!", "", "error").then(() => {
            setOpenLoginDialog(true);
          });
        }
        break;
      case 2:
        router.replace("/promotion");
        break;
      case 3:
        if (currentUser) {
          router.replace("/vip");
        } else {
          router.replace("/vip/privileges/");
        }
        break;
      case 4: // Tài khoản
        if (currentUser) {
          handleClick(); // Call handleClick to open drawer
        } else {
          swal("Vui lòng đăng nhập!", "", "error").then(() => {
            setOpenLoginDialog(true);
          });
        }
        break;
      case 5:
        setOpen(true);
        break;
    }
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        const res: any = await getMe();
        if (path?.startsWith("/profile") && !res.user) {
          // setOpenLoginDialog(true); // Uncomment if you want to show login dialog on profile access
          router.replace("/");
          return;
        }
        setUser(res.user);
        if (res?.user) {
          await widrawals();
          const updatedRes: any = await getMe();
          setUser(updatedRes?.user);
        }
      } catch (error) {
        console.error("Error during initialization:", error);
      } finally {
        setLoad(false);
      }
    };

    initialize();

    const updateMenuState = () => {
      if (path?.startsWith("/profile/account-deposit")) {
        setMenu(1);
      } else if (path?.startsWith("/promotion")) {
        setMenu(2);
      } else if (path?.startsWith("/vip")) {
        setMenu(3);
      } else {
        setMenu(undefined);
      }
    };

    updateMenuState();
  }, [path, router]);

  const widrawals = async () => {
    const withdrawalPromises = GameConfig.map(async (item) => {
      try {
        const WalletUser: any = await getWalletGameByUser(item.code);
        if (WalletUser.status === true && WalletUser.balance > 0) {
          await walletTransfer(WalletUser.balance, String(item.type), 2);
        }
      } catch (error) {
        console.error(`Error processing ${item.name}:`, error);
      }
    });

    await Promise.allSettled(withdrawalPromises);
  };

  return (
    <>
      {load ? (
        <LoadingComponent />
      ) : (
        <div className="container">
          <HeaderPage user={currentUser} pageConfig={pageConfig} />
          <div className="menu-sidebar-left">
            <SidebarPage pageConfig={pageConfig} />
          </div>
          <main>{children}</main>
          <FooterPage pageConfig={pageConfig} />
          <nav className="menu-mobile">
            <ul>
              <li>
                <button type="button" onClick={() => handleMenu(5)}>
                  <Menu
                    width="25px"
                    height="25px"
                    className="moblie-icon"
                    style={menu === 5 ? { color: "#d7ca63" } : { color: "white" }}
                  />
                  <p className={menu === 5 ? "mobile-active" : "mobile-p"}>
                    Danh mục
                  </p>
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleMenu(2)}>
                  <Campaign
                    width="25px"
                    height="25px"
                    className="moblie-icon"
                    style={menu === 2 ? { color: "#d7ca63" } : { color: "white" }}
                  />
                  <p className={menu === 2 ? "mobile-active" : "mobile-p"}>
                    Ưu đãi
                  </p>
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleMenu(1)}>
                  <Image
                    className="img-nap"
                    src={"/images/icon-deposit.svg"}
                    width={45}
                    height={45}
                    alt=""
                  />
                  <p className={menu === 1 ? "mobile-active" : "mobile-p"}>
                    Nạp Tiền
                  </p>
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleMenu(3)}>
                  <Diamond
                    width="25px"
                    height="25px"
                    className="moblie-icon"
                    style={menu === 3 ? { color: "#d7ca63" } : { color: "white" }}
                  />
                  <p className={menu === 3 ? "mobile-active" : "mobile-p"}>
                    Vip Club
                  </p>
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleMenu(4)}>
                  <AccountCircleOutlined
                    width="25px"
                    height="25px"
                    className="moblie-icon"
                    style={menu === 4 ? { color: "#d7ca63" } : { color: "white" }}
                  />
                  <p className={menu === 4 ? "mobile-active" : "mobile-p"}>
                    Tài khoản
                  </p>
                </button>
              </li>
            </ul>
          </nav>

          <MenuPopupComponent
            open={open}
            onClose={handleClose}
            title="Danh mục"
          />

          <SupportPopupComponent
            open={openSupport}
            onClose={() => setOpenSupport(false)}
            title="Support"
          />

          <DialogLogin
            activeTab={0}
            open={openLoginDialog}
            onClose={handleLoginDialogClose}
          />

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

          {currentUser ? (
            <div className="game-open">
              <div className="floating-refund">
                <FloatingRefund />
              </div>
            </div>
          ) : null}

        </div>
      )}
    </>
  );
}
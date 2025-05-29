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
import {
  AccountBalance,
  AccountBalanceWallet,
  AccountCircle,
  CardGiftcard,
  Support,
  Menu,
  Event,
  History,
} from "@mui/icons-material";
import LoadingComponent from "../Loading";
import { getMe } from "@/services/User.service";
import { GameConfig } from "@/configs/GameConfig";
import { getWalletGameByUser, walletTransfer } from "@/services/Wallet.service";
import MenuPopupComponent from "../popup/MenuPopup.component";
import SupportPopupComponent from "../popup/SupportPopup.component";
import "./PrimaryLayout.css";
import {
  CasioIcon,
  DPGameIcon,
  SearchIcon,
  SportsIcon,
} from "@/shared/Svgs/Svg.component";
import { Button } from "@mui/material";
import MiniGameComponent from "../popup/MiniGameComponent";
import MiniGameIframeComponent from "../popup/MiniGameIframeComponent";
import Draggable from "react-draggable"
import { pageInfo } from "@/services/Info.service";
import { PageConfig } from "@/interface/PageConfig.interface";
import FloatingRefund from "../popup/RefundComponent";
import axios from "axios";
// Lazy load các component ít ưu tiên
const SidebarPage = dynamic(() => import("../../pages/Sidebar/Sidebar.page"), {
  ssr: false,
});
const FooterPage = dynamic(() => import("@/pages/Footer/Footer.page"), {
  ssr: false,
});

interface PrimaryLayoutProps {
  children: React.ReactNode;
  pageConfig: PageConfig;
}

export default function PrimaryLayoutComponent({ children, pageConfig }: PrimaryLayoutProps) {
  const [menu, setMenu] = useState(2);
  const router = useRouter();
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [openSupport, setOpenSupport] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [load, setLoad] = useState(true);
  const [isMiniGameOpen, setIsMiniGameOpen] = useState(false);
  const [isIframeOpen, setIsIframeOpen] = useState(false);
  const nodeRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

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

  const hanldMenu = (menu: number) => {
    setMenu(menu);
    setOpenSupport(false);

    switch (menu) {
      case 1:
        router.replace("/sport");
        break;
      case 2:
        router.replace("/");
        break;
      case 3:
        router.replace("/livecasino");
        break;
      case 4:
        router.replace("/tablegame");
        break;
      case 5:
        router.replace("/promotion");
        break;
    }
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        const res: any = await getMe();
        if (path?.startsWith("/profile") && !res.user) {
          router.replace("/");
          return;
        }
        setUser(res.user);
        if (res?.user) {
          await widrawals(); // Thực hiện widrawals
          const updatedRes: any = await getMe(); // Gọi lại API sau khi hoàn thành
          setUser(updatedRes?.user);
        }
      } catch (error) {
        console.error("Error during initialization:", error);
      } finally {
        setLoad(false);
      }
    };

    initialize();
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

    await Promise.allSettled(withdrawalPromises); // Đợi tất cả promise, kể cả lỗi
  };

  return (
    <>
      {load ? (
        <LoadingComponent />
      ) : (
        <div className="container">
          <HeaderPage user={user} pageConfig={pageConfig}/>
          <div className="menu-sidebar-left">
            <SidebarPage pageConfig={pageConfig}/>
          </div>
          <main>{children}</main>
          <FooterPage pageConfig={pageConfig}/>
          <nav className="menu-mobile">
            <ul>
              <li>
                <button type="button" onClick={() => hanldMenu(5)}>
                  <Image
                    src={"/images/khuyenmai.webp"}
                    width={25}
                    height={25}
                    style={
                      menu === 5 ? { color: "#d7ca63" } : { color: "white" }
                    }
                    alt=""
                    className="moblie-icon"
                  />

                  <p className={menu === 5 ? "mobile-active" : "mobile-p"}>
                    Khuyến mãi
                  </p>
                </button>
              </li>

              <li>
                <button type="button" onClick={() => hanldMenu(1)}>
                  <SportsIcon className="moblie-icon" />
                  <p className={menu === 1 ? "mobile-active" : "mobile-p"}>
                    Thể thao
                  </p>
                </button>
              </li>
              <li>
                <button type="button" onClick={() => hanldMenu(2)}>
                  {/* <SearchIcon
                    width="25px"
                    height="25px"
                    className="moblie-icon"
                  /> */}
                  <Image
                    src={"/images/home.png"}
                    width={34}
                    height={34}
                    alt=""
                    style={{ objectFit: "cover" }}
                  />
                  <p className={menu === 2 ? "mobile-active" : "mobile-p"}>
                    Trang chủ
                  </p>
                </button>
              </li>
              <li>
                <button type="button" onClick={() => hanldMenu(3)}>
                  <CasioIcon className="moblie-icon" />
                  <p className={menu === 3 ? "mobile-active" : "mobile-p"}>
                    Live casino
                  </p>
                </button>
              </li>
              <li>
                <button type="button" onClick={() => hanldMenu(4)}>
                  <DPGameIcon className="moblie-icon" />
                  <p className={menu === 4 ? "mobile-active" : "mobile-p"}>
                    Games
                  </p>
                </button>
              </li>
            </ul>
          </nav>

          {/* <MenuPopupComponent
            open={open}
            onClose={handleClose}
            title="Category"
          /> */}

          <SupportPopupComponent
            open={openSupport}
            onClose={() => setOpenSupport(false)}
            title="Support"
          />
          {/* Refund */}
          { user ? <FloatingRefund /> : <></>}
        </div>
      )}
    </>
  );
}

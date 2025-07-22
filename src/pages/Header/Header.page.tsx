"use client";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import "./Header.css";
import dayjs from "dayjs";
import DialogLogin from "@/components/login/loginForm";
import Link from "next/link";
import { IUser } from "@/shared/interfaces";
import { useRouter } from "next/navigation";
import swal from "sweetalert";
import { getMe, getMessage } from "@/services/User.service";
import {
  Avatar,
  Button,
  IconButton,
  Skeleton,
  Tooltip,
  Typography,
  Box,
} from "@mui/material";
import { HomeIcon } from "@/shared/Svgs/Svg.component";
import TranslateContextComponent from "../../components/GgTranstale/TranslateContext.component";
import { userResponse } from "@/interface/user.interface";
import MenuProfile from "@/components/subMenu/MenuProfile";
import MenuProfileMobile from "@/components/subMenu/MenuProfileMobile";
import { getToken } from "@/configs/client-store";
import usePlayGame from "@/hook/usePlayGame";
import LoadingComponent from "@/components/Loading";
import SimpleBackdrop from "@/components/Loading/LoaddingPage";
import { MenuMobile, MenuWebsite } from "@/datafake/Menu";
import { GameConfig } from "@/configs/GameConfig";
import { NoticationIconMobile } from "@/shared/Svgs/Svg.component";
import { pageInfo } from "@/services/Info.service";
import { PageConfig } from "@/interface/PageConfig.interface";
import { contentInstance } from "@/configs/CustomizeAxios";
import PromotionPopup from "@/components/popup/PromotionPopup";

// Define Promotion interface
interface Promotion {
  id: number;
  title: string;
  thumbnail: string;
  isRegister: boolean;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

interface propUser {
  user: userResponse;
  pageConfig: PageConfig
}

export default function HeaderPage(props: propUser) {
  const { loading, playGame } = usePlayGame();
  const [show, setShow] = useState(false);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [user, setUser] = useState<any>(props.user);
  const [pageConfig, setPageConfig] = useState<any>(props.pageConfig);
  const [message, setMessage] = React.useState<any>(null);
  
  // Promotion popup states
  const [showPopup, setShowPopup] = useState(true);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loadingPromotions, setLoadingPromotions] = useState(true);
  
  const handleClose = () => setShow(false);
  const [anchorEl1, setAnchorEl1] = React.useState<null | HTMLElement>(null);
  const [isHover, setIsHover] = useState(false);

  const open = Boolean(anchorEl1);
  const handleSetActiveTab = useCallback((tabIndex: number) => {
    setActiveTab(tabIndex);
    setShow(true);
  }, []);
  const handleClick1 = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl1(event.currentTarget);
  };
  const [device, setDevice] = useState("");

  // Fetch promotions data
  const getPromotionData = async () => {
    setLoadingPromotions(true);
    try {
      const response = await contentInstance.get("/api/promotion", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status) {
        setPromotions(response.data);
      } else {
        swal("Không thể tải danh sách khuyến mãi", "error");
      }
    } catch (error: any) {
      console.error("API error:", error.response || error);
      swal("Lỗi", "Có lỗi xảy ra khi tải danh sách khuyến mãi", "error");
    } finally {
      setLoadingPromotions(false);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  useEffect(() => {
    // Fetch promotions on component mount
    getPromotionData();

    const initialize = async () => {
      try {
        const res: any = await getMe();
        if (res?.user) {
          setUser(res.user);
          const updatedRes: any = await getMe();
          setUser(updatedRes?.user);
        }
      } catch (error) {
        console.error("Error during initialization:", error);
      }
    };
    
    getMessage().then((res) => {
      if (res.data) {
        setMessage(res.data);
      }
    });
    initialize();
  }, []);

  useEffect(() => {
    const userAgent = navigator.userAgent;
    if (/iPhone|iPad|iPod/i.test(userAgent)) {
      setDevice("iOS");
    } else if (/Android/i.test(userAgent)) {
      setDevice("Android");
    } else {
      setDevice("Khác");
    }
  }, []);

  const router = useRouter();

  return (
    <>
      {/* Promotion Popup */}
      {showPopup && !loadingPromotions && promotions.length > 0 && (
        <PromotionPopup promotions={promotions} onClose={handleClosePopup} />
      )}
      {loadingPromotions && (
        <Box sx={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 9999
        }}>
          <Typography sx={{ color: "#fff" }}>Đang tải khuyến mãi...</Typography>
        </Box>
      )}

      <header>
        <div className="main-header">
          <div className="header-top">
            <div className="header-left">
              <div className="logo">
                <Link
                  href={"/"}
                  prefetch={false}
                  style={{
                    textDecoration: "none",
                    color: "#fff",
                    fontFamily: "sans-serif",
                    fontStyle: "italic",
                  }}
                >
                  <Image src={"/images/logo.png"} width="63" height="50" alt="" />
                </Link>
              </div>
            </div>
            <nav className="header-bottom">
              <ul>
                <li key={0} style={{ fontSize: "14px", display: "flex", alignItems: "center", gap: "4px" }}
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
                >
                  <Link href="/" style={{ display: "inline-flex", alignItems: "center" }}>
                    <HomeIcon width={"30"} height={"30"}  fill={isHover ? "#e74c31" : "#fff"} />
                  </Link>
                </li>
                {MenuWebsite.map((item) => (
                  <li key={item.id}>
                    <Link href={item.link} style={{ fontSize: "16px" }}>
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="header-right">
              {user ? (
                <div className="header-right-menu">
                  <span></span>
                  <MenuProfile user={user} pageConfig={pageConfig}/>
                </div>
              ) : (
                <div className="header-right-menu non-login">
                  <button className="agentList" onClick={() => router.push('/agency')}>Đại lý</button>
                  <button className="vip" onClick={() => router.push('/vip/privileges/')}>Vip</button>
                  <div className="split"></div>
                  <button
                    className="login"
                    onClick={() => handleSetActiveTab(0)}
                  >
                    Đăng Nhập
                  </button>
                  <button
                    className="register"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSetActiveTab(1)}
                  >
                    Đăng ký
                  </button>
                  <DialogLogin
                    activeTab={activeTab}
                    onClose={handleClose}
                    open={show}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="main-header-mobile">
          <div className="header-mobile">
            <div
              className={device === "Android" ? "header-left" : "header-left-ios"}
            >
              <div className="logo">
                <Link href={"/"} prefetch={false}>
                   <Image src={"/images/logo.png"} width="38" height="30" alt="" />
                </Link>
              </div>
            </div>

            <div
              className={
                device === "Android" ? "header-right" : "header-right-ios"
              }
            >
              {user ? (
                <div className="header-right-menu">
                  <MenuProfileMobile user={user} message={message} pageConfig={pageConfig}/>
                </div>
              ) : (
                <div className="header-right-menu">
                  <span></span>

                  <button
                    className="login"
                    onClick={() => handleSetActiveTab(0)}
                  >
                    Đăng nhập
                  </button>

                  <button
                    className="register"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSetActiveTab(1)}
                  >
                    Đăng ký
                  </button>
                  <button className="agentList" onClick={() => router.push('/agency')}>Đại lý</button>

                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
"use client";
import React, { useCallback, useState } from "react";
import "./Sidebar.css";
import Link from "next/link";
import Image from "next/image";
import {
  AgentIcon,
  ClaimIcon,
  DownloadAppIcon,
  EventIcon,
  HistoryIcon,
  InterestIcon,
  MissionIcon,
  NextIcon,
  RebateIcon,
  ReportIcon,
  SupportIcon,
  VIPIcon,
} from "@/shared/Svgs/Svg.component";
import { Icon, IconButton, Tooltip } from "@mui/material";
import TelegramIcon from "@mui/icons-material/Telegram";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import YouTubeIcon from "@mui/icons-material/YouTube";
import MarkChatUnreadIcon from "@mui/icons-material/MarkChatUnread";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { MenuSupport } from "@/datafake/Menu";
import { PageConfig } from "@/interface/PageConfig.interface";

interface SidebarProps {
  pageConfig?: PageConfig;
}

export default function SidebarPage({ pageConfig }: SidebarProps) {
  const [login, setLogin] = useState<boolean>(false);
  const handlePopupLogin = useCallback((isReload: boolean) => {
    if (isReload) {
      setLogin(false);
    }
  }, []);

  const contactFieldMap: { [key: string]: keyof PageConfig["contact"] } = {
    Telegram: "telegram",
    Facebook: "fanpage",
    Phone: "hotline",
    Chat: "telegram"
  };

  const getLink = (item: (typeof MenuSupport)[0]) => {
    const field = contactFieldMap[item.title];
    if (field && pageConfig?.contact?.[field]) {
      if (item.title === "Phone") {
        return `tel:${pageConfig.contact[field]}`;
      }
      return pageConfig.contact[field];
    }
    return item.link;
  };
  
  return (
    <div className="asider">
      <div className="sidebar">
        <nav>
          <ul className="menu-up">
            {MenuSupport.map((item) => (
              <li key={item.id}>
                <Link target="_blank" href={getLink(item)}>
                  <Tooltip title={item.title} placement="right" color="white">
                    <Image src={item.icon} width={35} height={35} alt="" />
                  </Tooltip>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}

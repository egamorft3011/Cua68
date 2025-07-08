import { useState } from "react";
import { PageConfig } from "@/interface/PageConfig.interface";
import {
  CasinoCardsIcon,
  CasinoIcon,
  ChickenIcon,
  FishIcon,
  FishMenuIcon,
  GameCasinoMenuIcon,
  GameFastMenuIcon,
  GameIcon,
  HomeMobileIcon,
  LoDeMenuIcon,
  LottoIcon,
  MasterCardIcon,
  MoneybagIcon,
  MonyExchangeIcon,
  QuaySoMenuIcon,
  SlotMenuIcon,
  SlotsIcon,
  SpinsIcon,
  SportIcon,
  TableGameMenuIcon,
  TabletGameIcon,
  USDTIcon,
  VisaIcon,
} from "@/shared/Svgs/Svg.component";
import {
  Facebook,
  Message,
  SupportAgent,
  Telegram,
  YouTube,
} from "@mui/icons-material";
import Image from "next/image";

export const MenuWebsite = [
  {
    id: "2",
    link: "/sport",
    title: "Thể thao",
  },
  {
    id: "3",
    link: "/livecasino",
    title: "Live Casino",
  },
  {
    id: "4",
    link: "/slots",
    title: "Nổ hũ",
  },
  {
    id: "5",
    link: "/lotto",
    title: "Xổ số",
  },
  {
    id: "6",
    link: "/chicken",
    title: "Đá gà",
  },
  {
    id: "7",
    link: "/gamecasio",
    title: "Game bài",
  },
];

export const MenuMobile = [
  {
    id: "1",
    link: "/sport",
    title: "Thể Thao",
    icon: <SportIcon width="20px" height="20px" className="icon-header" />,
  },
  {
    id: "2",
    link: "/livecasino",
    title: "Live Casino",
    icon: (
      <CasinoIcon
        fill="#fff"
        width="20px"
        height="20px"
        className="icon-header"
      />
    ),
  },
  {
    id: "3",
    link: "/slots",
    title: "Nổ hũ",
    icon: <SlotsIcon width="20px" height="20px" className="icon-header" />,
  },
  {
    id: "4",
    link: "/fish",
    title: "Bắn Cá",
    icon: <FishIcon width="20px" height="20px" className="icon-header" />,
    
  },
  {
    id: "5",
    link: "/chicken",
    title: "Đá gà",
    icon: <ChickenIcon width="20px" height="20px" className="icon-header" />,
  },

  {
    id: "6",
    link: "/lotto",
    title: "Xổ số",
    icon: <LottoIcon width="20px" height="20px" className="icon-header" />,
  },
  {
    id: "7",
    link: "/lotto",
    title: "Lô đề ",
    icon: <SpinsIcon width="20px" height="20px" className="icon-header" />,
  },
  {
    id: "8",
    link: "/gamecasio",
    title: "Game Bài",
    icon: (
      <CasinoCardsIcon width="20px" height="20px" className="icon-header" />
    ),
  },
];

export const MenuSupport = [
  {
    id: "1",
    title: "Telegram",
    link: "https://t.me/HitJuwa",
    icon: "/images/icon-telegram.webp",
  },
  // {
  //   id: "2",
  //   title: "Phone",
  //   link: "tel:14699013597",
  //   icon: "/images/icon-phone.webp",
  // },
  // {
  //   id: "3",
  //   title: "Youtube",
  //   link: "#",
  //   icon: "/images/icon-community.webp",
  // },
  // {
  //   id: "4",
  //   title: "Facebook",
  //   link: "https://www.facebook.com/profile.php?id=61570404908772",
  //   icon: "/images/icon-fb.webp",
  // },
  // {
  //   id: "5",
  //   title: "Chat",
  //   link: "",
  //   icon: "/images/icon-livechat.webp",
  // },
];

export const PaymentMenuFooter = [
  {
    id: "1",
    icon: <VisaIcon width="25px" height="25px" />,
    title: "Visa",
    link: "#",
  },
  {
    id: "2",
    icon: <MasterCardIcon width="25px" height="25px" />,
    title: "MasterCard",
    link: "#",
  },
  {
    id: "3",
    icon: <USDTIcon width="25px" height="25px" />,
    title: "USDT",
    link: "#",
  },
];

export const ListMenu = [
  {
    id: "1",
    icon: <TableGameMenuIcon />,
    title: "Thể Thao ",
    link: "/sport",
  },
  {
    id: "2",
    icon: <SlotMenuIcon />,
    title: "Nổ hũ",
    link: "/slots",
  },
  {
    id: "3",
    icon: <GameCasinoMenuIcon />,
    title: "Game Bài ",
    link: "/gamecasio",
  },
  {
    id: "4",
    icon: <FishMenuIcon />,
    title: "Bắn Cá ",
    link: "/fish",
  },
  {
    id: "5",
    icon: <GameFastMenuIcon />,
    title: "Game Nhanh ",
    link: "/gamesfast",
  },
  {
    id: "6",
    icon: <LoDeMenuIcon />,
    title: "Xổ số ",
    link: "/lotto",
  },
  {
    id: "7",
    icon: <QuaySoMenuIcon />,
    title: "Quay Số ",
    link: "/spins",
  },
];

export const GameSlotsMenu = [
  {
    id: "1",
    icon: <Image src={"/images/jl.png"} width={40} height={40} alt="" />,
    title: "JILI ",
    productType: "JL",
    gameType: "RNG",
  },
  {
    id: "2",
    icon: <Image src={"/images/pg.png"} width={40} height={40} alt="" />,
    title: "PG",
    productType: "PG",
    gameType: "RNG",
  },
  {
    id: "3",
    icon: <Image src={"/images/ka.png"} width={40} height={40} alt="" />,
    title: "KA ",
    productType: "KA",
    gameType: "RNG",
  },
  {
    id: "4",
    icon: <Image src={"/images/cq9.png"} width={40} height={40} alt="" />,
    title: "CQ9 ",
    productType: "CQ9",
    gameType: "RNG",
  },
  {
    id: "5",
    icon: <Image src={"/images/jdb.png"} width={40} height={40} alt="" />,
    title: "JDB ",
    productType: "JDB",
    gameType: "RNG",
  },
];

export const GameCasinoMenu = [
  {
    id: "1",
    icon: <Image src={"/images/v8.png"} width={40} height={40} alt="" />,
    title: "V8 ",
    productType: "LCC",
    gameType: "CHESS",
  },

];

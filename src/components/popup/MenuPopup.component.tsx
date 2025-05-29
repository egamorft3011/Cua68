import React from "react";
import CustomizedDialog from "../subMenu/SubMenu.component";
import Link from "next/link";
import {
  CasinoCardsIcon,
  CasinoIcon,
  ChickenIcon,
  FishIcon,
  GameIcon,
  LottoIcon,
  MoneybagIcon,
  MonyExchangeIcon,
  SlotsIcon,
  SpinsIcon,
  SportIcon,
  TabletGameIcon,
} from "@/shared/Svgs/Svg.component";
import usePlayGame from "@/hook/usePlayGame";
import { MenuMobile } from "@/datafake/Menu";

type CustomizedDialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
};

export default function MenuPopupComponent({
  open,
  onClose,
  title,
}: CustomizedDialogProps) {
  const { loading, playGame } = usePlayGame();

  return (
    <CustomizedDialog open={open} onClose={onClose} title={title}>
      <nav className="header-bottom-menu">
        <ul>
          {MenuMobile.map((item) => (
            <li key={item.id}>
              <Link
                href={item.link}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  justifyItems: "center",
                  gap: 5,
                }}
                onClick={onClose}
              >
                {item.icon}
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </CustomizedDialog>
  );
}

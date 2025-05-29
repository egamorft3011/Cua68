"use client";
import React, { cloneElement, useEffect, useState } from "react";
import Image from "next/image";
import { Box, Typography, Button, Pagination } from "@mui/material";
import { getListGame } from "@/services/GameApi.service";
import SlotsGameItemPage from "../Slots/SlotsGameItem.page";
import { GameSlotsMenu, ListMenu } from "@/datafake/Menu";

export default function TableGamesPage() {
  const [acctiveMenu, setAcctiveMenu] = useState<string>("1");
  const [GameType, setGameType] = useState<string>("RNG");
  const [ProductType, setProductType] = useState<string>("CQ9");

  return (
    <Box
      sx={{
        width: {
          xs: "98%",
          sm: "100%",
        },
        margin: "auto",
        paddingTop: 10,
        paddingBottom: {
          xs: 0,
          sm: 2,
        },
      }}
    >
      <Image
        src={"/images/tables.png"}
        width={1000}
        height={150}
        alt=""
        style={{ width: "100%" }}
        className="banner-games"
        loading="lazy"
      />
      <Box
        sx={{
          width: {
            xs: "98%",
            sm: "80%",
          },
          margin: "auto",
          paddingBottom: {
            xs: 0,
            sm: 2,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            textAlign: "center",
            flexWrap: "nowrap",
            overflowX: "auto",
            gap: "15px",
            paddingBottom: {
              xs: "5px",
              sm: "20px",
            },
            marginTop: {
              xs: 0,
              sm: "-40px",
            },
            justifyContent: { xs: "flex-start", sm: "center" },
            WebkitOverflowScrolling: "touch",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            "-ms-overflow-style": "none",
            "scrollbar-width": "none",
          }}
        >
          {ListMenu.map((item) => (
            <Button
              onClick={() => {}}
              sx={{
                minWidth: "160px",
                maxWidth: "200px",
                flexShrink: 0,
                background:
                  item?.id == "1"
                    ? "#0063ff"
                    : "linear-gradient(180deg,rgb(89, 41, 41), rgba(79, 35, 35, 0.7));",
                border: "1px solidrgb(117, 56, 56)",
                color: "white",
                gap: "5px",
                fontSize: { xs: "12px", sm: "14px" },
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
                display: "grid",
                gridTemplateRows: "1fr 1fr",
                justifyItems: "center",
                "&:hover": {
                  background: "#0063ff",
                },
              }}
              key={item.id}
              href={item.link}
            >
              {cloneElement(
                item.icon,
                item?.id == "1"
                  ? {
                      fill: "#FFFFFF",
                    }
                  : {}
              )}
              {item.title}
            </Button>
          ))}
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            textAlign: "center",
            flexWrap: "nowrap",
            overflowX: "auto",
            gap: "10px",
            paddingBottom: "20px",
            justifyContent: { xs: "flex-start", sm: "center" },
            WebkitOverflowScrolling: "touch",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            "-ms-overflow-style": "none",
            "scrollbar-width": "none",
          }}
        >
          {GameSlotsMenu.map((item) => (
            <Button
              onClick={() => {
                setGameType(item.gameType);
                setProductType(item.productType);
                setAcctiveMenu(item.id);
              }}
              sx={{
                display: "flex",
                minWidth: "164px",
                maxWidth: "200px",
                flexShrink: 0,
                background:
                  item?.id === acctiveMenu
                    ? "#0063ff"
                    : "linear-gradient(180deg,rgb(89, 41rgba(79, 35, 35, 0.7)79, .7));",
                border: "1px solidrgb(117, 56, 56)",
                color: "white",
                gap: "5px",
                fontSize: { xs: "12px", sm: "14px" },
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
                "&:hover": {
                  background: "#0063ff",
                },
              }}
              key={item.id}
            >
              {item.icon}
              {item.title}
            </Button>
          ))}
        </Box>
        <SlotsGameItemPage GameType={GameType} ProductType={ProductType} />
      </Box>
    </Box>
  );
}

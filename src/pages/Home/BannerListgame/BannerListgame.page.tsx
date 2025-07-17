import React, { useState } from "react";
import "./BannerListgame.css";
import Carousel from "react-multi-carousel";
import { getPlayGameById } from "@/services/GameApi.service";
import NavigationGameComponent from "@/hook/NavigationGame";
import Image from "next/image";
import NumberCount from "@/components/NumberCount/NumberCount";
import swal from "sweetalert";
import usePlayGame from "@/hook/usePlayGameInPage";
import { Box, Button } from "@mui/material";
import { ListGameLiveCasino } from "@/datafake/ListGame";

interface BannerListgamePageProps {
  onPlayGame: (codeGame: any, gameId: any) => void;
  gameLoading: boolean;
}

export default function BannerListgamePage({ onPlayGame, gameLoading }: BannerListgamePageProps) {
  const commonImgStyles = {
    height: {
      xs: "110px",
      sm: "300px",
    },
    position: "absolute",
    transition: "0.2s ease-in-out",
    zIndex: 1,
    top: 0,
    left: 0,
    width: "100%",
    "&:hover": {
      filter: "blur(3px)",
    },
  };

  const commonTextBoxStyles = {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    zIndex: 2,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
  };

  const commonCardStyles = {
    width: {
      xs: "100px",
      sm: "240px",
    },
    height: {
      xs: "130px",
      sm: "300px",
    },
    borderRadius: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    transition: "0.2s ease-in-out",
    position: "relative",
    overflow: "hidden",
    "&:hover .MuiButton-root": {
      opacity: 1,
    },
    "&:hover": {
      transform: "scale(1.04) rotate(-1deg)",
    },
  };

  const buttonStyles = {
    backgroundImage:
      "url(/images/bg-btn.png), conic-gradient(from 0deg at 50% 50%, #ff0808 0deg, #e02626 89.73deg, #e02626 180.18deg, #ff0808 1turn)",
    color: "white",
    padding: {
      xs: "3px 5px",
      sm: "10px 20px",
    },
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    zIndex: 3,
    fontSize: {
      xs: "10px",
      sm: "16px",
    },
    pointerEvents: "auto",
    opacity: 0,
    transition: "opacity 0.2s ease-in-out",
    "&:hover": {
      backgroundImage:
        "url(/images/bg-btn.png), conic-gradient(from 0deg at 50% 50%, #ff0808 0deg, #e02626 89.73deg, #e02626 180.18deg, #ff0808 1turn)",
      opacity: 1,
      filter: "none",
    },
  };

  return (
    <>
      <div className="casino">
        <div className="title-casino">
          <Image src={"/images/casino.webp"} width={20} height={20} alt="" />
          <p>Casino</p>
        </div>
      </div>
      <Box
        sx={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        {ListGameLiveCasino.map((item) => (
          <Box key={item.id} sx={commonCardStyles}>
            <Box sx={commonImgStyles}>
              <Image
                src={item.images}
                alt=""
                width={1800}
                height={2400}
                style={{
                  height: "100%",
                  width: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>

            <Box sx={commonTextBoxStyles}>
              <Button
                sx={buttonStyles}
                onClick={() => onPlayGame(item.codeGame, item.gameId)}
                disabled={gameLoading}
              >
                {gameLoading ? "Đang tải..." : "Chơi Game"}
              </Button>
            </Box>
          </Box>
        ))}
      </Box>
    </>
  );
}
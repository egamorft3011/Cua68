import React, { useState } from "react";
import Image from "next/image";
import usePlayGame from "@/hook/usePlayGame";
import { ListGamesHot } from "@/datafake/ListGame";
import Link from "next/link";
import { Box, Button } from "@mui/material";
import MixedGameItemPage from "@/pages/Slots/MixedGameItem.page";

export default function ListCasioPage() {
  const { loading, playGame } = usePlayGame();
  const commonImgStyles = {
    height: {
      xs: "110px",
      sm: "240px",
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
      xs: "110px",
      sm: "237px",
    },
    height: {
      xs: "110px",
      sm: "240px",
    },
    borderRadius: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    // justifyContent: "center",
    objectFit: "cover",
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
    fontSize: {
      xs: "10px",
      sm: "16px",
    },
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    zIndex: 3,
    pointerEvents: "auto",
    opacity: 0,
    transition: "opacity 0.2s ease-in-out",
    "&:hover": {
      backgroundImage:
        "url(/images/bg-btn.png), conic-gradient(from 0deg at 50% 50%, #085cff 0deg, #2692e0 89.73deg, #263be0 180.18deg, #085cff 1turn)",
      opacity: 1,
      filter: "none",
    },
  };
  return (
    <div className="list-casio">
      <>
        <div className="casino">
          <h2 style={{ color: "white" }}>Nhiều Người Chơi</h2>
        </div>

        <Box
          sx={{
            width: "90%",
            margin: "0 auto",
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {/* {ListGamesHot.map((item) => (
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
                  onClick={() => playGame(item.codeGame, item.gameId)}
                >
                  Chơi Game
                </Button>
              </Box>
            </Box>
          ))} */}
          <MixedGameItemPage GameType1="RNG" ProductType1="CQ9" GameType2="RNG" ProductType2="JL"/>
        </Box>
      </>
    </div>
  );
}

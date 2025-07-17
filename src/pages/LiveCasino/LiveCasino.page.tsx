"use client";
import React from "react";
import Image from "next/image";
import NumberCount from "@/components/NumberCount/NumberCount";
import swal from "sweetalert";
import usePlayGame from "@/hook/usePlayGame";
import SimpleBackdrop from "@/components/Loading/LoaddingPage";
import { ListGameLiveCasino } from "@/datafake/ListGame";
import { Box, Typography, Button } from "@mui/material";

export default function LiveCasinoPage() {
  const { loading, playGame } = usePlayGame();
  const commonImgStyles = {
    height: {
      xs: "210px",
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
      xs: "130px",
      sm: "180px",
    },
    height: {
      xs: "210px",
      sm: "240px",
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
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    zIndex: 3,
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
      {loading ? (
        <>
          <SimpleBackdrop />
          <Box
            sx={{
              width: "80%",
              margin: "auto",
              marginTop: 10,
              paddingTop: 10,
              paddingBottom: {
                xs: 80,
                sm: 20,
              },
            }}
          >
            <Typography
              variant="h2"
              sx={{
                color: "white",
                fontWeight: 600,
                fontSize: "30px",
                height: 50,
              }}
            >
              Live Casino
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: "15px",
                flexWrap: "wrap",
                justifyContent: "center",
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
                      onClick={() => playGame(item.codeGame, item.gameId)}
                    >
                      Chơi ngay
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </>
      ) : (
        <Box
          sx={{
            width: "100%",
            margin: "auto",
            paddingTop: {
              xs: 4,
              sm: 10,
            },
            paddingBottom: {
              xs: 0,
              sm: 2,
            },
          }}
        >
          <Image
            src={"/images/icon-bg-casino.png"}
            width={1000}
            height={150}
            alt=""
            style={{ width: "100%", objectFit: "contain" }}
            className="banner-games"
            loading="lazy"
          />
          <Box
            sx={{
              width: "80%",
              margin: "auto",
              paddingBottom: {
                xs: 0,
                sm: 5,
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: "15px",
                flexWrap: "wrap",
                justifyContent: "center",
                marginTop: 5,
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
                      onClick={() => playGame(item.codeGame, item.gameId)}
                    >
                      Chơi ngay
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import NumberCount from "@/components/NumberCount/NumberCount";
import swal from "sweetalert";
import usePlayGame from "@/hook/usePlayGameInPage";
import SimpleBackdrop from "@/components/Loading/LoaddingPage";
import { ListGameSport } from "@/datafake/ListGame";
import { Box, Typography, Button, useMediaQuery, useTheme } from "@mui/material";
import DraggableCloseButton from "@/components/subMenu/DraggableCloseButton";

export default function SportPage() {
  const { loading, playGame } = usePlayGame();
  const [gameUrl, setGameUrl] = useState("");
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [gameLoading, setGameLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (isGameOpen) {
      document.body.classList.add("game-open");
    } else {
      document.body.classList.remove("game-open");
    }
    return () => {
      document.body.classList.remove("game-open");
    };
  }, [isGameOpen]);

  const handlePlayGame = async (codeGame: any, gameId: any) => {
    setGameLoading(true);
    try {
      const url = await playGame(codeGame, gameId);
      if (url) {
        setGameUrl(url);
        setIsGameOpen(true);
      }
    } catch (error) {
      console.error("Error playing game:", error);
    } finally {
      setGameLoading(false);
    }
  };

  const handleCloseGame = () => {
    setIsGameOpen(false);
    setGameUrl("");
  };

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
      <style jsx global>{`
          .game-open .floating-refund,
          .game-open .menu-mobile,
          .game-open footer,
          .game-open .footer-mobile {
            display: none;
          }
        `}</style>
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
              Sport Game
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: "15px",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {ListGameSport.map((item) => (
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
                      onClick={() => handlePlayGame(item.codeGame, item.gameId)}
                      disabled={gameLoading}
                    >
                      {gameLoading ? "Đang tải..." : "Chơi ngay"}
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </>
      ) : isGameOpen ? (
        // Hiển thị game fullscreen với draggable close button
        <Box
          sx={{
            width: "100%",
            height: "100vh",
            position: "relative",
            overflow: "hidden",
            paddingTop: isMobile ? "60px" : "80px",
          }}
        >
          {/* Draggable Close Button */}
          <DraggableCloseButton onClose={handleCloseGame} isMobile={isMobile} />
          
          {/* Iframe game */}
          <Box sx={{ height: 'calc(100vh - 80px)', width: '100%'}}>
            {gameUrl && (
              <iframe
                src={gameUrl}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
                title="Sport Game"
                allow="camera; microphone; fullscreen; payment"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
              />
            )}
          </Box>
        </Box>
      ) : (
        // Hiển thị danh sách game
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
            src={"/images/banner-sports.webp"}
            width={1000}
            height={150}
            alt=""
            style={{ width: "100%" }}
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
              {ListGameSport.map((item) => (
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
                      onClick={() => handlePlayGame(item.codeGame, item.gameId)}
                      disabled={gameLoading}
                    >
                      {gameLoading ? "Đang tải..." : "Chơi ngay"}
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
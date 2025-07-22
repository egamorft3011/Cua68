"use client";
import React, { cloneElement, useEffect, useRef, useState } from "react";
import Image from "next/image";
import usePlayGame from "@/hook/usePlayGameInPage"; // Changed to usePlayGameInPage
import SimpleBackdrop from "@/components/Loading/LoaddingPage";
import {
  Box,
  Typography,
  Button,
  Pagination,
  Tooltip,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { getListGame } from "@/services/GameApi.service";
import { GameLotto } from "@/datafake/ListGame";
import { GameSlotsMenu, ListMenu } from "@/datafake/Menu";
import DraggableCloseButton from "@/components/subMenu/DraggableCloseButton";

const commonImgStyles = {
  height: {
    xs: "160px",
    sm: "220px",
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
    xs: "160px",
    sm: "200px",
  },
  height: {
    xs: "160px",
    sm: "200px",
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

export default function LottoPage() {
  const { loading, playGame } = usePlayGame(); // Using usePlayGameInPage hook
  const [acctiveMenu, setAcctiveMenu] = useState<string>("1");
  const listMenuRef = useRef<HTMLDivElement>(null);
  const gameSlotsMenuRef = useRef<HTMLDivElement>(null);
  
  // New state for iframe functionality
  const [gameUrl, setGameUrl] = useState("");
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [gameLoading, setGameLoading] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Add body class when game is open (hide other elements)
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

  // Handle play game with iframe
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

  // Handle close game
  const handleCloseGame = () => {
    setIsGameOpen(false);
    setGameUrl("");
  };

  // Hàm cuộn item active vào giữa màn hình
  const scrollToCenter = (
    containerRef: React.RefObject<HTMLDivElement>,
    itemId: string
  ) => {
    if (containerRef.current) {
      const activeItem = containerRef.current.querySelector(
        `[data-id="${itemId}"]`
      );
      if (activeItem instanceof HTMLElement) {
        const containerWidth = containerRef.current.offsetWidth;
        const itemWidth = activeItem.offsetWidth;
        const itemOffsetLeft = activeItem.offsetLeft;
        const scrollPosition =
          itemOffsetLeft - (containerWidth - itemWidth) / 2;

        containerRef.current.scrollTo({
          left: scrollPosition,
          behavior: "smooth",
        });
      }
    }
  };

  // Cuộn menu active vào giữa khi activeMenu thay đổi hoặc component mount
  useEffect(() => {
    if (isMobile) {
      // Chờ DOM render hoàn tất
      const timer = setTimeout(() => {
        scrollToCenter(listMenuRef, "6"); // Cuộn ListMenu đến id="4"
        scrollToCenter(gameSlotsMenuRef, acctiveMenu); // Cuộn GameSlotsMenu
      }, 100);
      return () => clearTimeout(timer); // Dọn dẹp timer
    }
  }, [acctiveMenu, isMobile]);

  return (
    <>
      {/* Global styles to hide elements when game is open */}
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
              height: "1000px",
              marginTop: 10,
              paddingTop: 10,
              paddingBottom: {
                xs: 80,
                sm: 20,
              },
            }}
          ></Box>
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
          <Box sx={{
            height: isMobile ? 'calc(100vh - 60px)' : 'calc(100vh - 130px)',
            width: '100%',
          }}>
            {gameUrl && (
              <iframe
                src={gameUrl}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
                title="Lotto Game"
                allow="camera; microphone; fullscreen; payment"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
              />
            )}
          </Box>
        </Box>
      ) : (
        // Hiển thị danh sách game lotto
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
            src={"/images/lo_de.png"}
            width={1000}
            height={150}
            alt=""
            style={{ width: "100%" }}
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
            <Box sx={{mb: '20px'}}></Box>
            <Box
              sx={{
                display: "flex",
                gap: "15px",
                flexWrap: "wrap",
                justifyContent: "center",
                marginBottom: "20px",
              }}
            >
              {GameLotto.map((item: any) => (
                <Box key={item.id} sx={commonCardStyles}>
                  <Box sx={commonImgStyles}>
                    <Image
                      src={item.images}
                      alt=""
                      width={200}
                      height={200}
                      layout="responsive"
                      placeholder="blur"
                      blurDataURL="/images/Quay số - techplay - Lô đề 3 miền_1727969202.webp"
                      style={{
                        height: "100%",
                        width: "100%",
                        objectFit: "cover",
                      }}
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "/images/Quay số - techplay - Lô đề 3 miền_1727969202.webp"; // Đường dẫn fallback
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
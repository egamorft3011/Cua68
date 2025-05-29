"use client";
import React, { cloneElement, useEffect, useRef, useState } from "react";
import Image from "next/image";
import usePlayGame from "@/hook/usePlayGame";
import SimpleBackdrop from "@/components/Loading/LoaddingPage";
import {
  Box,
  Typography,
  Button,
  Pagination,
  Tooltip,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { getListGame } from "@/services/GameApi.service";
import { GameLotto } from "@/datafake/ListGame";
import { GameSlotsMenu, ListMenu } from "@/datafake/Menu";

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
    "url(/images/bg-btn.png), conic-gradient(from 0deg at 50% 50%, #085cff 0deg, #2692e0 89.73deg, #263be0 180.18deg, #085cff 1turn)",

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
      "url(/images/bg-btn.png), conic-gradient(from 0deg at 50% 50%, #085cff 0deg, #2692e0 89.73deg, #263be0 180.18deg, #085cff 1turn)",

    opacity: 1,
    filter: "none",
  },
};

export default function LottoPage() {
  const { loading, playGame } = usePlayGame();
  const [acctiveMenu, setAcctiveMenu] = useState<string>("1");
  const listMenuRef = useRef<HTMLDivElement>(null);
  const gameSlotsMenuRef = useRef<HTMLDivElement>(null);
  // Sử dụng media query string thay vì theme.breakpoints
  const isMobile = useMediaQuery("(max-width: 600px)"); // Breakpoint xs thường là 600px

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
      ) : (
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
              ref={listMenuRef}
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
                  data-id={item.id}
                  onClick={() => {}}
                  sx={{
                    minWidth: "160px",
                    maxWidth: "200px",
                    flexShrink: 0,
                    background:
                      item?.id == "6"
                        ? "#0063ff"
                        : "linear-gradient(180deg, #293259, rgba(35, 43, 79, .7));",
                    border: "1px solid #384375",
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
                    item?.id == "6"
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
              ref={gameSlotsMenuRef}
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
                  data-id={item.id}
                  onClick={() => {
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
                        : "linear-gradient(180deg, #293259, rgba(35, 43, 79, .7));",
                    border: "1px solid #384375",
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
                      blurDataURL="/images/Quay số - techplay - Lô đề 3 miền_1727969202.webp"
                      style={{
                        height: "100%",
                        width: "100%",
                        objectFit: "cover",
                      }}
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "/images/Quay số - techplay - Lô đề 3 miền_1727969202.webp"; // Đường dẫn fallback
                      }}
                    />
                  </Box>

                  <Box sx={commonTextBoxStyles}>
                    <Button
                      sx={buttonStyles}
                      onClick={() =>
                        playGame(item.codeGame, item.gameId)
                      }
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

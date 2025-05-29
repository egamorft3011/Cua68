"use client";
import React, { cloneElement, useEffect, useRef, useState } from "react";
import Image from "next/image";
import usePlayGame from "@/hook/usePlayGame";
import SimpleBackdrop from "@/components/Loading/LoaddingPage";
import { Box, Button } from "@mui/material";
import { useMediaQuery } from "@mui/system"; // Thay đổi import
import { getListGame, getListGameFish } from "@/services/GameApi.service";
import { GameSlotsMenu, ListMenu } from "@/datafake/Menu";
import FishGameItemPage from "./FishGameItem.page";

export default function FishPage() {
  const { loading } = usePlayGame();
  const [activeMenu, setActiveMenu] = useState<string>("1");
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
        scrollToCenter(listMenuRef, "4"); // Cuộn ListMenu đến id="4"
        scrollToCenter(gameSlotsMenuRef, activeMenu); // Cuộn GameSlotsMenu
      }, 100);
      return () => clearTimeout(timer); // Dọn dẹp timer
    }
  }, [activeMenu, isMobile]);

  return (
    <>
      {loading ? (
        <SimpleBackdrop />
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
            src={"/images/fishing.png"}
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
                paddingBottom: "20px",
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
                      item?.id === "4"
                        ? "#ff0000"
                        : "linear-gradient(180deg, #592929, #4f2323)",
                    border: "1px solid #4c0101",
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
                      background: "#ff0000",
                      "& svg": {
                        fill: "#FFFFFF", // Đổi màu icon sang trắng khi hover
                      },
                    },
                  }}
                  key={item.id}
                  href={item.link}
                >
                  {cloneElement(item.icon, {
                    fill: item?.id === "4" ? "#FFFFFF" : "#CCCCCC", // Màu trắng cho active, xám cho non-active
                  })}
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
                  data-id={item.id} // Thêm data-id
                  onClick={() => {
                    setActiveMenu(item.id);
                  }}
                  sx={{
                    display: "flex",
                    minWidth: "164px",
                    maxWidth: "200px",
                    flexShrink: 0,
                    background:
                      item?.id === activeMenu
                        ? "#ff0000"
                        : "linear-gradient(180deg, #592929, #4f2323)",
                    border: "1px solid #4c0101",
                    color: "white",
                    gap: "5px",
                    fontSize: { xs: "12px", sm: "14px" },
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    "&:hover": {
                      background: " #ff0000",
                      "& svg": {
                        fill: "#FFFFFF", // Đổi màu icon sang trắng khi hover
                      },
                    },
                  }}
                  key={item.id}
                >
                  {item.icon}
                  {item.title}
                </Button>
              ))}
            </Box>
            <FishGameItemPage />
          </Box>
        </Box>
      )}
    </>
  );
}

"use client";
import React, { cloneElement, useEffect, useRef, useState } from "react";
import Image from "next/image";
import usePlayGame from "@/hook/usePlayGame";
import SimpleBackdrop from "@/components/Loading/LoaddingPage";
import {
  Box,
  Typography,
  Button,
  InputBase,
  IconButton,
  AppBar,
  Toolbar,
  Container,
  useMediaQuery,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { getListGame, getListGameFish } from "@/services/GameApi.service";
import { GameSlotsMenu, ListMenu } from "@/datafake/Menu";
import FishGameItemPage from "./favoriteGameItem.page";

export default function FishPage() {
  const { loading } = usePlayGame();
  const [activeMenu, setActiveMenu] = useState<string>("1");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const listMenuRef = useRef<HTMLDivElement>(null);
  const gameSlotsMenuRef = useRef<HTMLDivElement>(null);
  // Sử dụng media query string thay vì theme.breakpoints
  const isMobile = useMediaQuery("(max-width: 600px)"); // Breakpoint xs thường là 600px

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = () => {
    if (searchTerm.trim()) {
      console.log("Tìm kiếm game:", searchTerm);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSearchSubmit();
    }
  };

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
            src={"/images/favoritegames.jpg"}
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
            <Box sx={{mb: '20px', display: { xs: "none", sm: "block" },}}></Box>
            <Box sx={{ background: "#350f0f", borderRadius: 2, color: "white", p: 2 }}>
              <AppBar position="static" elevation={0} sx={{ background: "transparent" }}>
                <Toolbar sx={{ justifyContent: "space-between" }}>
                  <Box
                    sx={{
                      display: { xs: "none", sm: "block" },
                    }}
                  >
                    <Image
                      src="/images/favoritegame-logo.png"
                      alt="fishinggame"
                      width={200}
                      height={50}
                      style={{ objectFit: "contain" }}
                    />
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.1)", borderRadius: 3, p: 1 }}>
                    <InputBase
                      placeholder="Tìm game..."
                      value={searchTerm}
                      onChange={handleSearch}
                      onKeyPress={handleKeyPress}
                      sx={{ color: "white", width: 200, px: 1 }}
                    />
                    <IconButton sx={{ color: "#ffd700" }} onClick={handleSearchSubmit}>
                      <Search />
                    </IconButton>
                  </Box>
                </Toolbar>
              </AppBar>
    
              <Container sx={{ px: 0, mt: 3 }}>
                <Box sx={{ width: "100%", textAlign: "left", mb: 2 }}>
                  <Box
                    sx={{
                      backgroundColor: "#ffd700",
                      color: "#fff",
                      borderRadius: "8px 8px 0 0",
                      textTransform: "none",
                      padding: "4px 16px",
                      fontSize: "14px",
                      fontWeight: 600,
                      display: "inline-block",
                    }}
                  >
                    {searchTerm ? `Kết quả tìm kiếm: "${searchTerm}"` : "Game Yêu Thích Của Bạn"}
                  </Box>
                  <Box sx={{ height: "2px", background: "#ffd700", width: "100%" }} />
                </Box>
                <FishGameItemPage
                  GameType={""}
                  ProductType={""}
                  searchTerm={searchTerm}
                />
              </Container>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
}

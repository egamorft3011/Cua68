"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import usePlayGame from "@/hook/usePlayGame";
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
import { getListGame } from "@/services/GameApi.service";
import { GameSlotsMenu } from "@/datafake/Menu";
import SlotsGameItemPage from "./SlotsGameItem.page";

export default function SlotsPage() {
  const [GameType, setGameType] = useState<string>("RNG");
  const [ProductType, setProductType] = useState<string>("JL");
  const [activeMenu, setActiveMenu] = useState<string>("1");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const gameSlotsMenuRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 600px)");

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
    <Box sx={{ width: "100%", paddingTop: 10 }}>
      <Image
        src="/images/slots.png"
        width={1000}
        height={150}
        alt="Banner"
        style={{ width: "100%" }}
        loading="lazy"
      />

      {/* Desktop Layout */}
      <Box
        sx={{
          display: { xs: "none", sm: "block" },
          width: "80%",
          margin: "auto",
        }}
      >
        <Box
          ref={gameSlotsMenuRef}
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "10px",
            padding: 2,
            justifyContent: "center",
            background: "#350f0f",
            borderRadius: "12px",
            my: 3,
          }}
        >
          {GameSlotsMenu.map((item) => (
            <Button
              key={item.id}
              data-id={item.id}
              onClick={() => {
                setGameType(item.gameType);
                setProductType(item.productType);
                setActiveMenu(item.id);
                setSearchTerm("");
              }}
              sx={{
                width: "calc(100% / 6 - 10px)",
                background:
                  item.id === activeMenu
                    ? "#ff0000"
                    : "linear-gradient(180deg, #592929, #4f2323)",
                color: "white",
                fontSize: "14px",
                overflow: "hidden",
                whiteSpace: "nowrap",
                "&:hover": { background: "#ff0000" },
              }}
            >
              {item.icon} {item.title}
            </Button>
          ))}
        </Box>

        <Box sx={{ background: "#350f0f", borderRadius: 2, color: "white", p: 2 }}>
          <AppBar position="static" elevation={0} sx={{ background: "transparent" }}>
            <Toolbar sx={{ justifyContent: "space-between" }}>
              <Image
                src={`/images/${ProductType.toLowerCase()}.png`}
                alt={ProductType}
                width={60}
                height={60}
                style={{ objectFit: "contain" }}
              />
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
                {searchTerm ? `Kết quả tìm kiếm: "${searchTerm}"` : "Trò Chơi Hot Nhất"}
              </Box>
              <Box sx={{ height: "2px", background: "#ffd700", width: "100%" }} />
            </Box>
            <SlotsGameItemPage
              GameType={GameType}
              ProductType={ProductType}
              searchTerm={searchTerm}
            />
          </Container>
        </Box>
      </Box>

      {/* Mobile Layout */}
      <Box sx={{ display: { xs: "flex", sm: "none" }, flexDirection: "row", gap: 1, p: 1 }}>
        <Box
          sx={{
            width: "90px",
            display: "flex",
            flexDirection: "column",
            gap: 1,
            overflowY: "auto",
            flexShrink: 0,
          }}
        >
          {GameSlotsMenu.map((item) => (
            <Button
              key={item.id}
              data-id={item.id}
              onClick={() => {
                setGameType(item.gameType);
                setProductType(item.productType);
                setActiveMenu(item.id);
                setSearchTerm("");
              }}
              sx={{
                background:
                  item.id === activeMenu
                    ? "#ff0000"
                    : "linear-gradient(180deg, #592929, #4f2323)",
                color: "white",
                fontSize: "12px",
                textAlign: "center",
                whiteSpace: "nowrap",
                px: 1,
                py: 0.5,
                borderRadius: 1,
              }}
            >
              {item.icon} {item.title}
            </Button>
          ))}
        </Box>

        <Box sx={{ flexGrow: 1, background: "#350f0f", borderRadius: 2, color: "white", p: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "rgba(255,255,255,0.1)",
              borderRadius: 2,
              mb: 2,
              p: 1,
            }}
          >
            <InputBase
              placeholder="Tìm game..."
              value={searchTerm}
              onChange={handleSearch}
              onKeyPress={handleKeyPress}
              sx={{ color: "white", fontSize: "12px", width: "100%" }}
            />
            <IconButton sx={{ color: "#ffd700" }} onClick={handleSearchSubmit}>
              <Search fontSize="small" />
            </IconButton>
          </Box>

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
              {searchTerm ? `Kết quả tìm kiếm: "${searchTerm}"` : "Trò Chơi Hot Nhất"}
            </Box>
            <Box sx={{ height: "2px", background: "#ffd700", width: "100%" }} />
          </Box>
          <SlotsGameItemPage
            GameType={GameType}
            ProductType={ProductType}
            searchTerm={searchTerm}
          />
        </Box>
      </Box>
    </Box>
  );
}
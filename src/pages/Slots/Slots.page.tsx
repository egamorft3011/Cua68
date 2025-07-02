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
  AppBar,
  Toolbar,
  InputBase,
  Container,
} from "@mui/material";
import { Info, CardGiftcard, AttachMoney, Casino, History, Search } from '@mui/icons-material';
import { getListGame } from "@/services/GameApi.service";
import { GameSlotsMenu, ListMenu } from "@/datafake/Menu";
import SlotsGameItemPage from "./SlotsGameItem.page";
import { styled } from "@mui/system";
import { useRouter } from 'next/navigation';

export default function SlotsPage() {
  const [GameType, setGameType] = useState<string>("RNG");
  const [ProductType, setProductType] = useState<string>("JL");
  const [activeMenu, setActiveMenu] = useState<string>("1");
  const listMenuRef = useRef<HTMLDivElement>(null);
  const gameSlotsMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 600px)"); // Breakpoint xs thường là 600px

  const [activeTab, setActiveTab] = useState('all');
  
    const tabs = [
      { id: 'all', label: 'Trò chơi hot nhất'},
      { id: 'new', label: 'Trò chơi mới nhất'},
      { id: 'fish', label: 'Chuyên gia bắn cá'},
      { id: 'other', label: 'Trò chơi khác'}
    ];

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
      const timer = setTimeout(() => {
        scrollToCenter(listMenuRef, "2"); // Cuộn ListMenu đến id="4"
        scrollToCenter(gameSlotsMenuRef, activeMenu); // Cuộn GameSlotsMenu
      }, 100);
      return () => clearTimeout(timer); // Dọn dẹp timer
    }
  }, [activeMenu, isMobile]);

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
        src={"/images/slots.png"}
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
          ref={gameSlotsMenuRef}
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            textAlign: "center",
            gap: "10px",
            paddingBottom: "20px",
            justifyContent: "flex-start",
          }}
        >
          {GameSlotsMenu.map((item) => (
            <Button
              data-id={item.id}
              onClick={() => {
                setGameType(item.gameType);
                setProductType(item.productType);
                setActiveMenu(item.id);
              }}
              sx={{
                display: "flex",
                width: "calc(100% / 6 - 10px)",
                flexShrink: 0,
                background:
                  item?.id === activeMenu
                    ? "#ff0000"
                    : "linear-gradient(180deg, #592929, #4f2323);",
                border: "1px solid #4c0101",
                color: "white",
                gap: "5px",
                fontSize: { xs: "12px", sm: "14px" },
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
                "&:hover": {
                  background: "#ff0000",
                },
              }}
              key={item.id}
            >
              {item.icon}
              {item.title}
            </Button>
          ))}
        </Box>
        <Box sx={{ 
          background: '#350f0f',
          borderRadius: '8px',
          color: 'white',
          width: '100%',
          pb: { xs: 4, sm: 6 } 
        }}>
          {/* Header */}
          <AppBar position="static" elevation={0} sx={{ backgroundColor: 'transparent', height: 'auto !important'}}>
            <Toolbar sx={{ justifyContent: 'space-between',  px: { xs: 1, sm: 2 }, minHeight: { xs: 48, sm: 64 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Image
                    src={`/images/${ProductType.toLowerCase()}.png`} // Thay đổi theo ProductType
                    alt={`${ProductType} Logo`}
                    width={60} // Đặt chiều rộng
                    height={60} // Đặt chiều cao
                    style={{ objectFit: 'contain' }} // Giữ tỷ lệ ảnh
                  />

              </Box>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '15px',
                px: 1,
                py: 0.5
              }}>
                <InputBase
                  placeholder="Vui lòng nhập tên trò chơi"
                  sx={{
                    color: 'white',
                    fontSize: { xs: '10px', sm: '12px' },
                    '& .MuiInputBase-input': {
                      padding: '8px 12px',
                      width: { xs: '150px', sm: '200px' }
                    }
                  }}
                />
                <IconButton sx={{ color: '#ffd700' }}>
                  <Search />
                </IconButton>
              </Box>
            </Toolbar>
          </AppBar>

          {/* Navigation Tabs */}
          <Container sx={{ paddingLeft: '0 !important', paddingRight: '0 !important' }}>
            <Box sx={{ 
              display: 'flex', 
              gap: 1,
              mb: { xs: 2, sm: 4 },
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'center', sm: 'flex-start' },
              background: 'rgba(255,255,255,0.1)',
              padding: '10px 200px'
            }}>
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "contained" : "outlined"}

                  onClick={() => setActiveTab(tab.id)}
                  sx={{
                    borderRadius: '25px',
                    px: { xs: 2, sm: 3 },
                    py: { xs: 0.5, sm: 1 },
                    textTransform: 'none',
                    fontSize: { xs: '10px', sm: '12px' },
                    width: { xs: '100%', sm: 'auto' }, // Full width on mobile
                    maxWidth: { xs: 300, sm: 'none' }, // Limit width on mobile
                    backgroundColor: activeTab === tab.id ? '#901d1d' : 'transparent',
                    borderColor: activeTab === tab.id ? '#901d1d' : 'rgba(255,255,255,0.3)',
                    color: activeTab === tab.id ? 'white' : 'rgba(255,255,255,0.8)',
                    '&:hover': {
                      backgroundColor: activeTab === tab.id ? '#901d1d' : 'rgba(255,255,255,0.1)',
                      borderColor: activeTab === tab.id ? '#901d1d' : 'rgba(255,255,255,0.5)',
                    }
                  }}
                >
                  {tab.label}
                </Button>
              ))}
            </Box>

            {/* Main Content */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '50vh',
              textAlign: 'center',
              px: { xs: 2, sm: 0 }
            }}>
              <Box sx={{ width: '100%', textAlign: 'left', px: '50px !important', mb: '20px' }}>
                <Box
                  sx={{
                    backgroundColor: '#ffd700',
                    color: '#fff',
                    borderRadius: '8px 8px 0 0',
                    textTransform: 'none',
                    padding: '4px 16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    display: 'inline-block',
                  }}
                >
                  Trò Chơi Mới Nhất
                </Box>
                <Box
                  sx={{
                    height: '2px',
                    backgroundColor: '#ffd700',
                    width: '100%',
                  }}
                />
              </Box>
              <SlotsGameItemPage GameType={GameType} ProductType={ProductType} />
            </Box>
          </Container>
        </Box>
        {/* <SlotsGameItemPage GameType={GameType} ProductType={ProductType} /> */}
      </Box>
    </Box>
  );
}
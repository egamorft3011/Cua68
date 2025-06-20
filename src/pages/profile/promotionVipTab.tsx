"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; 
import {
  Box,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import Swal from "sweetalert";
import { AxiosResponse } from "axios";
import { contentInstance } from "@/configs/CustomizeAxios";
import useMediaQuery from '@mui/material/useMediaQuery';

// Define API response interfaces
interface Promotion {
  id: number;
  title: string;
  thumbnail: string;
  isRegister: boolean;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PromotionDetails {
  id: number;
  title: string;
  thumbnail: string;
  content: string;
  isRegister?: boolean;
  createdAt?: string;
}

interface ApiResponse<T> {
  status: boolean;
  msg?: string;
  data: T;
}

const PromotionsPage: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width:576px)');

  // Fetch all promotions
  const getPromotionData = async () => {
    setLoading(true);
    try {
      const response = await contentInstance.get("/api/promotion", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status) {
        setPromotions(response.data);
      } else {
        Swal("Không thể tải danh sách khuyến mãi", "error");
      }
    } catch (error: any) {
      Swal("Lỗi", error.response?.msg || "Có lỗi xảy ra khi tải danh sách khuyến mãi", "error");
    } finally {
      setLoading(false);
    }
  };

  // Register for a promotion
  const registerPromotion = async (id: number) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      Swal("Lỗi", "Vui lòng đăng nhập để đăng ký khuyến mãi", "error");
      return;
    }
    try {
      const response: AxiosResponse<ApiResponse<any>> = await contentInstance.post(
        `/api/promotion/register/${id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      if (response.data.status) {
        Swal("Thành công", response.data.msg || "Đăng ký khuyến mãi thành công", "success");
        getPromotionData();
      } else {
        Swal("Lỗi", response.data.msg || "Không thể đăng ký khuyến mãi", "error");
      }
    } catch (error: any) {
      Swal("Lỗi", error.response?.data?.msg || "Có lỗi xảy ra khi đăng ký khuyến mãi", "error");
    }
  };

  useEffect(() => {
    getPromotionData();
  }, []);

  const handleOpen = (item: Promotion) => {
    router.push(`/promotion/detail/?promotionID=${item.id}`);
    window.scrollTo(0, 0);
  };

  const handlePrev = () => {
    if (isTransitioning || currentIndex === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleNext = () => {
    if (isTransitioning || currentIndex >= promotions.length - (isMobile ? 1 : 2)) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const getVisiblePromotions = () => {
    if (promotions.length === 0) return [];
    return promotions.slice(currentIndex, Math.min(currentIndex + 3, promotions.length));
  };

  return (
    <Box
      sx={{
        backgroundImage: "url(https://zbet.tv/assets/images/components/common/vip-club/bg-promotion.webp)",
        backgroundSize: "cover",
        display: "flex",
        p: 2,
        overflow: "hidden",
        borderRadius: 3,
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2, px: 2 }}>
        <Box
          component="img"
          src="https://zbet.tv/assets/images/components/common/vip-club/icon-promotion.webp"
          sx={{ width: 24, height: 24, mr: 1 }}
        />
        <Typography variant="h6" color="white" fontWeight="bold">
          Khuyến mãi
        </Typography>
        <Box flexGrow={1} />
        <Typography
          variant="body2"
          color="#00ff66"
          sx={{ textDecoration: "underline", cursor: "pointer" }}
          onClick={() => router.push("/promotion")}
        >
          Xem thêm
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box
          sx={{
            width: "30%",
            alignItems: "center",
            justifyContent: "center",
            display: { xs: "none", sm: "flex" },
          }}
        >
          <img
            src="https://zbet.tv/assets/images/components/common/vip-club/model.webp"
            alt="model"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </Box>

        <Box
          sx={{
            width: { xs: "100%", sm: "70%" },
            position: "relative",
            display: "flex",
            overflow: "hidden",
            borderRadius: 2,
          }}
        >
          {/* Navigation Buttons */}
          <IconButton
            onClick={handlePrev}
            disabled={isTransitioning || currentIndex === 0}
            sx={{
              position: "absolute",
              left: 8,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              backgroundColor: "rgba(0,0,0,0.3)",
              color: "#fff",
              width: 40,
              height: 40,
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#00C853",
                transform: "translateY(-50%) scale(1.1)",
                boxShadow: "0 4px 15px rgba(0,200,83,0.5)",
              },
              "&:disabled": {
                opacity: 0.5,
              },
            }}
          >
            <ChevronLeft />
          </IconButton>

          <IconButton
            onClick={handleNext}
            disabled={isTransitioning || currentIndex >= promotions.length - (isMobile ? 1 : 2)}
            sx={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              backgroundColor: "rgba(0,0,0,0.3)",
              color: "#fff",
              width: 40,
              height: 40,
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#00C853",
                transform: "translateY(-50%) scale(1.1)",
                boxShadow: "0 4px 15px rgba(0,200,83,0.5)",
              },
              "&:disabled": {
                opacity: 0.5,
              },
            }}
          >
            <ChevronRight />
          </IconButton>

          {/* Promotions Container */}
          <Box
            sx={{
              display: "flex",
              width: "100%",
              transform: {
                xs: `translateX(-${currentIndex * 101}%)`,
                sm: `translateX(-${currentIndex * 42}%)`,
              },
              transition: isTransitioning ? "transform 0.3s ease-in-out" : "none",
              gap: 1,
            }}
          >
            {promotions.map((item, idx) => (
              <Box
                key={`${item.id}-${idx}`}
                sx={{
                  flex: { xs: "0 0 100%", sm: "0 0 42%" },
                  height: "380px",
                  backgroundImage: `url('${item.thumbnail}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  p: 2,
                  minHeight: 300,
                  cursor: "pointer",
                  color: "#fff",
                  position: "relative",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                  transition: "all 0.3s ease",
                  opacity: 1,
                  transform: "scale(1)",
                  "&:hover": {
                    transform: "scale(1.02)",
                    boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
                  },
                  overflow: "hidden",
                }}
                onClick={() => handleOpen(item)}
              >
                {/* Gradient Overlay */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 1,
                  }}
                />

                {/* Content */}
                <Box
                  sx={{
                    position: "relative",
                    zIndex: 2,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    sx={{
                      mt: 1,
                      backgroundColor: "#00C853",
                      borderRadius: 5,
                      px: 3,
                      py: 1,
                      fontWeight: "bold",
                      textTransform: "none",
                      boxShadow: "0 4px 15px rgba(0,200,83,0.4)",
                      "&:hover": {
                        backgroundColor: "#00A843",
                        boxShadow: "0 6px 20px rgba(0,200,83,0.6)",
                      },
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpen(item);
                    }}
                  >
                    Tìm hiểu ngay
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PromotionsPage;
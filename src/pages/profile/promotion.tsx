"use client";
import React, { useEffect, useState, useRef  } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Modal,
  Button,
  IconButton,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import useAuth from "@/hook/useAuth";
import Image from "next/image";
import { contentInstance } from "@/configs/CustomizeAxios";
import Swal from "sweetalert";
import { AxiosResponse } from "axios";
import CloseIcon from "@mui/icons-material/Close";


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
  const [selectedPromotion, setSelectedPromotion] = useState<PromotionDetails | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch all promotions
  const getPromotionData = async () => {
    setLoading(true);
    try {
      const response = await contentInstance.get("/api/promotion", {
        headers: {
          "Content-Type": "application/json"
        },
      });
      if (response.status) {
        console.log(response.data)
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

  // Fetch promotion details by ID
  const getPromotionInfo = async (id: number) => {
    try {
      const response = await contentInstance.get(`/api/promotion/promotion-info/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status) {
        setSelectedPromotion(response.data);
        setModalOpen(true);
      } else {
        Swal("Không thể tải chi tiết khuyến mãi", "error");
      }
    } catch (error: any) {
      Swal("Lỗi", error.response?.msg || "Có lỗi xảy ra khi tải chi tiết khuyến mãi", "error");
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
        // Refresh promotions to update isRegister status
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

  const handleCardClick = (id: number) => {
    getPromotionInfo(id);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedPromotion(null);
  };

  const [index, setIndex] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(null);

  const handleOpen = (item: any) => {
    setSelected(item);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handlePrev = () => setIndex((prev) => (prev > 0 ? prev - 1 : promotions.length - 1));
  const handleNext = () => setIndex((prev) => (prev + 1) % promotions.length);

  return (
    <Box
      sx={{
        backgroundImage: 'url(https://zbet.tv/assets/images/components/common/vip-club/bg-promotion.webp)',
        backgroundSize: 'cover',
        display: 'flex',
        p: 2,
        overflow: 'hidden',
        minHeight: 360,
        borderRadius: 3,
        flexDirection: 'column',
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
        <Typography variant="body2" color="#00ff66" sx={{ textDecoration: "underline", cursor: 'pointer' }}>
          Xem thêm
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2, px: 2 }}>
        <Box
          sx={{
            width: '30%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src="https://zbet.tv/assets/images/components/common/vip-club/model.webp"
            alt="model"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </Box>

        <Box
          sx={{
            width: '70%',
            position: 'relative',
            display: 'flex',
            gap: 2,
            overflow: 'hidden',
          }}
        >
          <IconButton
            onClick={handlePrev}
            sx={{ position: 'absolute', left: 0, top: '40%', zIndex: 1, backgroundColor: '#00000055', color: '#fff' }}
          >
            <ChevronLeft />
          </IconButton>

          {promotions.slice(index, index + 2).map((item, idx) => (
            <Box
              key={idx}
              sx={{
                width: '50%',
                background: item.thumbnail
                  ? `url(${item.thumbnail}) center/cover`
                  : '#f1c40f',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                p: 2,
                minHeight: 300,
                cursor: 'pointer',
                color: '#fff',
                position: 'relative',
                boxShadow: 3,
              }}
              onClick={() => handleOpen(item)}
            >
              <Typography variant="h6" fontWeight="bold">
                {item.title}
              </Typography>
              <Button
                variant="contained"
                sx={{ mt: 1, backgroundColor: '#00C853', borderRadius: 5 }}
              >
                Tìm hiểu ngay
              </Button>
            </Box>
          ))}

          <IconButton
            onClick={handleNext}
            sx={{ position: 'absolute', right: 0, top: '40%', zIndex: 1, backgroundColor: '#00000055', color: '#fff' }}
          >
            <ChevronRight />
          </IconButton>
        </Box>
      </Box>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          <Typography variant="h5" mb={2}>
            Test
          </Typography>
        </Box>
      </Modal>
    </Box>
  );
};

export default PromotionsPage;
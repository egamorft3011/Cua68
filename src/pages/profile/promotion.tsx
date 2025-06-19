"use client";
import React, { useEffect, useState } from "react";
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

  return (
    <Box sx={{ p: 2, backgroundColor: "none", minHeight: "100vh" }}>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
          <Typography sx={{ color: "#fff" }}>Đang tải...</Typography>
        </Box>
      ) : (
        <Grid container spacing={2} className="promo-container">
          {promotions.map((promotion) => (
            <Grid item xs={12} sm={6} md={6} key={promotion.id}>
              <Card
                sx={{
                   cursor: "pointer",
                  "&:hover": { boxShadow: "0 6px 12px rgba(0,0,0,0.3)" },
                }}
                onClick={() => handleCardClick(promotion.id)}
              >
                <CardMedia
                  component="img"
                   image={promotion.thumbnail}
                  alt={promotion.title}
                sx={{
                  height: { xs: 143, sm: 143, md: 240 },  }}                
                  />

                <CardContent sx={{ p: 1, bgcolor: "#fff" }}>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    {promotion.title}
                  </Typography>
                  <Typography variant="caption" display="block">
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Promotion Details Modal */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            // position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 600 },
            bgcolor: "#382525",
            color: "#fff",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            maxHeight: "80vh",
            overflowY: "auto",
            position: "relative",
          }}
        >
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "#fff",
              "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
            }}
          >
            <CloseIcon/>
          </IconButton>
          {selectedPromotion ? (
            <>
              <Box sx={{ mb: 2, textAlign: "center" }}>
                <Image
                  src={selectedPromotion.thumbnail}
                  alt={selectedPromotion.title}
                  width={300}
                  height={200}
                  style={{ width: "100%", height: "auto", objectFit: "cover", borderRadius: 8 }}
                />
              </Box>
              <Box
                className="content"
                dangerouslySetInnerHTML={{ __html: selectedPromotion.content }}
                sx={{ mb: 2 }}
              />
              <Typography variant="body2" sx={{ mb: 2 }}>
              </Typography>
            </>
          ) : (
            <Typography>Đang tải...</Typography>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default PromotionsPage;
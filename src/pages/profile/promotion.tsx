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
import { useRouter } from "next/navigation";

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
  const router = useRouter();

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

  useEffect(() => {
    getPromotionData();
  }, []);

  const handleCardClick = (id: number) => {
    router.push(`/promotion/detail/?promotionID=${id}`);
    window.scrollTo(0, 0);
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
            <Grid item xs={12} sm={6} md={4} key={promotion.id}>
              <Card
                sx={{
                   cursor: "pointer",
                   height: 320,
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

    </Box>
  );
};

export default PromotionsPage;
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
                  height: "auto",
                  position: "relative",
                  overflow: "hidden",
                  background: "transparent",
                  boxShadow: "none", 
                }}
                onClick={() => handleCardClick(promotion.id)}
              >
                <CardMedia
                  component="img"
                  image={promotion.thumbnail}
                  alt={promotion.title}
                  sx={{
                    height: "100%",
                    width: "100%",
                    objectFit: "cover",
                    borderRadius: 3,
                    
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    display: "flex",
                    justifyContent: "center",
                    pb: 2,
                  }}
                >
                  <Button
                    variant="contained"
                   sx={{
                    color: "#fff",
                    fontWeight: "bold",
                    width: "80%",
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    background: "transparent",
                    backgroundImage: `url(/images/bg-btn.png), conic-gradient(from 0deg at 50% 50%, #ff0808 0deg, #e02626 89.73deg, #e02626 180.18deg, #ff0808 1turn)`,
                    backgroundBlendMode: "overlay",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    "&:hover": {
                      backgroundBlendMode: "multiply",
                    },
                  }}
                  >
                    Tìm hiểu ngay
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default PromotionsPage;
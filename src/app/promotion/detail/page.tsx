"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Swal from "sweetalert";
import { AxiosResponse } from "axios";
import { contentInstance } from "@/configs/CustomizeAxios";

// Define API response interfaces
interface PromotionDetails {
  id: number;
  title: string;
  thumbnail: string;
  content: string;
  isRegister?: boolean;
  createdAt?: string;
  tableData?: { totalDeposit: string; bonus: string }[];
}

interface ApiResponse<T> {
  status: boolean;
  msg?: string;
  data: T;
}

const PromotionDetailPage: React.FC = () => {
  const [selectedPromotion, setSelectedPromotion] = useState<PromotionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const promotionID = searchParams?.get("promotionID") ?? null;

  // Fetch promotion details by ID
  const getPromotionInfo = async (promotionId: string) => {
    setLoading(true);
    try {
      const response = await contentInstance.get(`/api/promotion/promotion-info/${promotionID}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status) {
        setSelectedPromotion(response.data);
      } else {
        Swal("Không thể tải chi tiết khuyến mãi", "error");
      }
    } catch (error: any) {
      Swal("Lỗi", error.response?.data?.msg || "Có lỗi xảy ra khi tải chi tiết khuyến mãi", "error");
    } finally {
      setLoading(false);
    }
  };

  // Register for a promotion
  const registerPromotion = async (promotionId: number) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      Swal("Lỗi", "Vui lòng đăng nhập để đăng ký khuyến mãi", "error");
      return;
    }
    try {
      const response: AxiosResponse<ApiResponse<any>> = await contentInstance.post(
        `/api/promotion/register/${promotionId}`,
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
      } else {
        Swal("Lỗi", response.data.msg || "Không thể đăng ký khuyến mãi", "error");
      }
    } catch (error: any) {
      Swal("Lỗi", error.response?.data?.msg || "Có lỗi xảy ra khi đăng ký khuyến mãi", "error");
    }
  };

  useEffect(() => {
    if (promotionID) {
      getPromotionInfo(promotionID as string);
    }
  }, [promotionID]);

  return (
    <Box
       sx={{
        backgroundColor: "#240202",
        display: "flex",
        flexDirection: "column",
        p: 4,
        color: "#fff",
        mt: 7,
        width: { xs: '100%', sm: '80%' }, 
        mx: 'auto',
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <IconButton onClick={() => router.push("/promotion")} sx={{ mr: 1, color: "#fff" }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" color="white" fontWeight="bold">
          Chi Tiết Khuyến Mãi
        </Typography>
      </Box>

      {/* Content */}
      {loading ? (
        <Typography variant="h6" color="white" textAlign="center">
          Đang tải...
        </Typography>
      ) : selectedPromotion ? (
        <Box
          sx={{
            bgcolor: "#4f2323",
            p: 4,
            borderRadius: 2,
            mx: "auto",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
          }}
        >
          {selectedPromotion.thumbnail && (
            <Box
              component="img"
              src={selectedPromotion.thumbnail}
              alt="Promotion Banner"
              sx={{
                display: "block",   
                mx: "auto", 
                width: "auto",
                height: 300,
                objectFit: "cover",
                borderRadius: 1,
                mb: 3,
              }}
            />
          )}

          <Typography variant="h4" fontWeight="bold" sx={{ mb: 2, color: "#00FF00" }}>
            {selectedPromotion.title}
          </Typography>

          <Typography
            variant="body1"
            sx={{ mb: 3, color: "#fff" }}
            dangerouslySetInnerHTML={{ __html: selectedPromotion.content }}
          />


          {selectedPromotion.tableData && (
            <TableContainer component={Paper} sx={{ mb: 3, backgroundColor: "#2A2A3E" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Tổng cược hợp lệ</TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Tiền thưởng (VND)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedPromotion.tableData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ color: "#fff" }}>{row.totalDeposit}</TableCell>
                      <TableCell sx={{ color: "#fff" }}>{row.bonus}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* <Typography variant="body2" sx={{ mb: 2, color: "#00FF00" }}>
            ĐIỀU KIỆN, ĐIỀU KHOẢN:
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: "#fff" }}>
            - Tiền thưởng sẽ được trả tự động khi đạt điều kiện cược hợp lệ trong vòng 24h.
            - Tất cả các loại tiền thưởng đều cần phải hoàn thành điều kiện cược trước khi rút tiền.
          </Typography> */}

          {/* <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              onClick={() => router.push("/promotion")}
              sx={{ borderRadius: 2, color: "#fff", borderColor: "#fff" }}
            >
              Quay lại
            </Button>
            <Button
              variant="contained"
              onClick={() => registerPromotion(selectedPromotion.id)}
              sx={{
                borderRadius: 2,
                backgroundColor: "#00C853",
                "&:hover": { backgroundColor: "#00A843" },
              }}
            >
              Đăng ký ngay
            </Button>
          </Box> */}
        </Box>
      ) : (
        <Typography variant="h6" color="white" textAlign="center">
          Không tìm thấy khuyến mãi.
        </Typography>
      )}
    </Box>
  );
};

export default PromotionDetailPage;
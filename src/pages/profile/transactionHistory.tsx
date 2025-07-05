"use client";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Chip,
  Tooltip,
  IconButton,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { EmptyIcon } from "@/shared/Svgs/Svg.component";
import "./profile.css";
import { TransactionHistoryItem } from "@/interface/TransactionHistory.interface";
import { getTransactionHistory } from "@/services/Bank.service";

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");
  // return `${year}-${month}-${day}`;
  return `${day}/${month}-${year};`;
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'success':
    case 'thành công':
      return {
        backgroundColor: '#4caf50',
        color: '#fff',
      };
    case 'pending':
    case 'đang xử lý':
    case 'chờ duyệt':
      return {
        backgroundColor: '#ff9800',
        color: '#fff',
      };
    case 'error':
    case 'lỗi':
    case 'thất bại':
      return {
        backgroundColor: '#f44336',
        color: '#fff',
      };
    default:
      return {
        backgroundColor: '#757575',
        color: '#fff',
      };
  }
};

const getVietnameseStatus = (status: string) => {
  switch (status.toLowerCase()) {
    case 'success':
      return 'Thành công';
    case 'pending':
      return 'Chờ duyệt';
    case 'error':
      return 'Thất bại';
    default:
      return status;
  }
};

export default function TransactionHistoryPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  
  const handleChangePage = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const toggleRowExpansion = (index: number) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(index)) {
      newExpandedRows.delete(index);
    } else {
      newExpandedRows.add(index);
    }
    setExpandedRows(newExpandedRows);
  };

  const [rows, setRows] = useState<TransactionHistoryItem[]>([]);
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);
  const [fromDate, setFromDate] = useState<string>(formatDate(sevenDaysAgo));
  const [toDate, setToDate] = useState<string>(formatDate(now));
  console.log("formatDate(now)", formatDate(now));

  const fetchBettingHistory = async () => {
    try {
      if (!fromDate || !toDate) return;
      // Ensure proper date format
      const response = await getTransactionHistory(
        page,
        limit,
        fromDate,
        toDate
      );

      const { dataExport, total } = response.data;
      setRows(dataExport);
      setTotal(total);
    } catch (error) {
      console.error("Error fetching betting history:", error);
    }
  };

  useEffect(() => {
    fetchBettingHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, fromDate, toDate]);

  const truncateText = (text: string, maxLength: number = 10) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <>
      {rows.length > 0 ? (
        <Box
          sx={{
            width: "100%",
            overflowX: "auto", // scroll chỉ tại đây
            background: "#361414",
            borderRadius: "10px",
          }}
        >
          <Box sx={{ minWidth: 800 }}>
            {/* Header */}
            <Box
              display="flex"
              justifyContent="space-between"
              px={1}
              mb={2}
              color=" #ccc"
              sx={{
                background: "#401c1c",
                p: 2,
                borderRadius: "10px 10px 0 0",
              }}
            >
              <Typography sx={{ flex: "1 1 20%", whiteSpace: "nowrap" }}>
                Tên Ngân Hàng
              </Typography>
              <Typography sx={{ flex: "1 1 10%", whiteSpace: "nowrap" }}>
                Số tài khoản
              </Typography>
              <Typography sx={{ flex: "1 1 30%", whiteSpace: "nowrap" }}>
                Nội dung
              </Typography>
              <Typography sx={{ flex: "1 1 20%", whiteSpace: "nowrap" }}>
                Số tiền
              </Typography>
              <Typography sx={{ flex: "1 1 20%", whiteSpace: "nowrap" }}>
                Trạng thái
              </Typography>
            </Box>

            {/* Rows */}
            {rows?.map((t, i) => (
              <Card
                key={i}
                sx={{
                  background: "#361414",
                  borderBottom: "1px solid rgba(117, 56, 56, 0.35)",
                  boxShadow: "none",
                }}
              >
                <CardContent
                  sx={{
                    px: 2,
                    py: 1,
                  }}
                >
                  {/* Main row */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography sx={{ flex: "1 1 20%", whiteSpace: "nowrap" }}>
                      {t.bankName}
                    </Typography>
                    <Typography 
                      sx={{ 
                        flex: "1 1 10%", 
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontSize: "0.9rem"
                      }}
                    >
                      {t.bankNumber}
                    </Typography>
                    <Box sx={{ flex: "1 1 30%", display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography 
                        sx={{ 
                          whiteSpace: expandedRows.has(i) ? "normal" : "nowrap",
                          wordBreak: expandedRows.has(i) ? "break-word" : "normal",
                          overflow: expandedRows.has(i) ? "visible" : "hidden",
                          textOverflow: expandedRows.has(i) ? "clip" : "ellipsis",
                          flex: 1,
                        }}
                      >
                        {expandedRows.has(i) ? t.info : truncateText(t.info)}
                      </Typography>
                      {t.info.length > 10 && (
                        <IconButton
                          size="small"
                          onClick={() => toggleRowExpansion(i)}
                          sx={{
                            color: "#ccc",
                            "&:hover": {
                              color: "#fff",
                            },
                            minWidth: "24px",
                            height: "24px",
                          }}
                        >
                          {expandedRows.has(i) ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                      )}
                    </Box>
                    <Typography
                      fontWeight="bold"
                      color="success.main"
                      sx={{ 
                        flex: "1 1 20%", 
                        whiteSpace: "nowrap",
                        fontSize: "0.95rem"
                      }}
                    >
                      {new Intl.NumberFormat('vi-VN').format(Number(t.amount ?? 0))}

                    </Typography>
                    <Box sx={{ flex: "1 1 20%", display: "flex", justifyContent: "flex-start" }}>
                      <Chip
                        label={getVietnameseStatus(t.status)}
                        size="small"
                        sx={{
                          ...getStatusColor(t.status),
                          fontWeight: "bold",
                          minWidth: "70px",
                          fontSize: "0.75rem",
                        }}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            backgroundColor: "#350f0f",
            borderRadius: 2,
            py: 15,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#aaa",
          }}
        >
          <Box textAlign="center">
            <EmptyIcon />
            <Typography>Không tìm thấy kết quả Giao dịch gần đây</Typography>
          </Box>
        </Box>
      )}
    </>
  );
}
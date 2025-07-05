"use client";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { EmptyIcon } from "@/shared/Svgs/Svg.component";
import "./profile.css";
import { getHistoryTransaction } from "@/services/Bank.service";

// Interface cho dữ liệu giao dịch mới
interface HistoryTransactionItem {
  id: number;
  uid: number;
  type: string;
  amount: number;
  before_amount: number;
  after_amount: number;
  info: string;
  status: number; // 0: trừ tiền, 1: cộng tiền
  createdAt: string;
  updatedAt: string;
}

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${day}/${month}/${year}`;
};

const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes} ${day}/${month}/${year}`;
};

const getTransactionColor = (status: number) => {
  return status === 1 ? "#4caf50" : "#f44336"; // Xanh cho cộng tiền, đỏ cho trừ tiền
};

const getTransactionSign = (status: number) => {
  return status === 1 ? "+" : "-";
};

// Desktop Table Component
const DesktopTable = ({ 
  rows, 
  expandedRows, 
  toggleRowExpansion, 
  truncateText 
}: { 
  rows: HistoryTransactionItem[], 
  expandedRows: Set<number>, 
  toggleRowExpansion: (index: number) => void,
  truncateText: (text: string, maxLength?: number) => string
}) => (
  <Box
    sx={{
      width: "100%",
      overflowX: "auto",
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
        color="#ccc"
        sx={{
          background: "#401c1c",
          p: 2,
          borderRadius: "10px 10px 0 0",
        }}
      >
        <Typography sx={{ flex: "1 1 20%", whiteSpace: "nowrap" }}>
          Thời gian giao dịch
        </Typography>
        <Typography sx={{ flex: "1 1 15%", whiteSpace: "nowrap" }}>
          Số tiền
        </Typography>
        <Typography sx={{ flex: "1 1 15%", whiteSpace: "nowrap" }}>
          Số dư cũ
        </Typography>
        <Typography sx={{ flex: "1 1 15%", whiteSpace: "nowrap" }}>
          Số dư mới
        </Typography>
        <Typography sx={{ flex: "1 1 35%", whiteSpace: "nowrap" }}>
          Ghi chú
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
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{ 
                  flex: "1 1 20%", 
                  whiteSpace: "nowrap",
                  fontSize: "0.85rem"
                }}
              >
                {formatDateTime(t.createdAt)}
              </Typography>
              <Typography
                fontWeight="bold"
                sx={{ 
                  flex: "1 1 15%", 
                  whiteSpace: "nowrap",
                  fontSize: "0.95rem",
                  color: getTransactionColor(t.status)
                }}
              >
                {getTransactionSign(t.status)}{new Intl.NumberFormat('vi-VN').format(Number(t.amount ?? 0))}
              </Typography>
              <Typography
                sx={{ 
                  flex: "1 1 15%", 
                  whiteSpace: "nowrap",
                  fontSize: "0.9rem"
                }}
              >
                {new Intl.NumberFormat('vi-VN').format(Number(t.before_amount ?? 0))}
              </Typography>
              <Typography
                sx={{ 
                  flex: "1 1 15%", 
                  whiteSpace: "nowrap",
                  fontSize: "0.9rem"
                }}
              >
                {new Intl.NumberFormat('vi-VN').format(Number(t.after_amount ?? 0))}
              </Typography>
              <Box sx={{ flex: "1 1 35%", display: "flex", alignItems: "center", gap: 1 }}>
                <Typography 
                  sx={{ 
                    whiteSpace: expandedRows.has(i) ? "normal" : "nowrap",
                    wordBreak: expandedRows.has(i) ? "break-word" : "normal",
                    overflow: expandedRows.has(i) ? "visible" : "hidden",
                    textOverflow: expandedRows.has(i) ? "clip" : "ellipsis",
                    flex: 1,
                    fontSize: "0.9rem"
                  }}
                >
                  {expandedRows.has(i) ? t.info : truncateText(t.info, 50)}
                </Typography>
                {t.info.length > 50 && (
                  <IconButton
                    size="small"
                    onClick={() => toggleRowExpansion(i)}
                    sx={{
                      color: "#ccc",
                      "&:hover": {
                        color: "#fff",
                      },
                      minWidth: "20px",
                      height: "20px",
                    }}
                  >
                    {expandedRows.has(i) ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  </Box>
);

// Mobile Cards Component
const MobileCards = ({ 
  rows, 
  expandedRows, 
  toggleRowExpansion, 
  truncateText 
}: { 
  rows: HistoryTransactionItem[], 
  expandedRows: Set<number>, 
  toggleRowExpansion: (index: number) => void,
  truncateText: (text: string, maxLength?: number) => string
}) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
    {rows?.map((t, i) => (
      <Card
        key={i}
        sx={{
          background: "linear-gradient(135deg, #2a1810 0%, #1a1410 100%)",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ color: "#ccc", fontSize: "0.9rem" }}>
                Thời gian:
              </Typography>
              <Typography sx={{ color: "#fff", fontWeight: "500", fontSize: "0.85rem" }}>
                {formatDateTime(t.createdAt)}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ color: "#ccc", fontSize: "0.9rem" }}>
                Số tiền:
              </Typography>
              <Typography 
                sx={{ 
                  color: getTransactionColor(t.status),
                  fontWeight: "bold",
                  fontSize: "1rem"
                }}
              >
                {getTransactionSign(t.status)}{new Intl.NumberFormat('vi-VN').format(Number(t.amount ?? 0))}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ color: "#ccc", fontSize: "0.9rem" }}>
                Số dư cũ:
              </Typography>
              <Typography sx={{ color: "#fff", fontWeight: "500" }}>
                {new Intl.NumberFormat('vi-VN').format(Number(t.before_amount ?? 0))}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ color: "#ccc", fontSize: "0.9rem" }}>
                Số dư mới:
              </Typography>
              <Typography sx={{ color: "#fff", fontWeight: "500" }}>
                {new Intl.NumberFormat('vi-VN').format(Number(t.after_amount ?? 0))}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography sx={{ color: "#ccc", fontSize: "0.9rem" }}>
                Ghi chú:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography 
                  sx={{ 
                    color: "#fff", 
                    fontWeight: "500",
                    wordBreak: expandedRows.has(i) ? "break-word" : "normal",
                    overflow: expandedRows.has(i) ? "visible" : "hidden",
                    textOverflow: expandedRows.has(i) ? "clip" : "ellipsis",
                    flex: 1,
                  }}
                >
                  {expandedRows.has(i) ? t.info : truncateText(t.info, 30)}
                </Typography>
                {t.info.length > 30 && (
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
            </Box>
          </Box>
        </CardContent>
      </Card>
    ))}
  </Box>
);

export default function HistoryTransactionPage() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
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

  const [rows, setRows] = useState<HistoryTransactionItem[]>([]);
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);
  const [fromDate, setFromDate] = useState<string>(formatDate(sevenDaysAgo));
  const [toDate, setToDate] = useState<string>(formatDate(now));

  const fetchHistoryTransaction = async () => {
    try {
      if (!fromDate || !toDate) return;
      const response = await getHistoryTransaction(
        page,
        limit,
        fromDate,
        toDate
      );

      const { dataExport, total } = response.data;
      setRows(dataExport);
      setTotal(total);
    } catch (error) {
      console.error("Error fetching history transaction:", error);
    }
  };

  useEffect(() => {
    fetchHistoryTransaction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, fromDate, toDate]);

  const truncateText = (text: string, maxLength: number = 25) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <>
      {rows.length > 0 ? (
        isDesktop ? (
          <DesktopTable 
            rows={rows} 
            expandedRows={expandedRows} 
            toggleRowExpansion={toggleRowExpansion} 
            truncateText={truncateText}
          />
        ) : (
          <MobileCards 
            rows={rows} 
            expandedRows={expandedRows} 
            toggleRowExpansion={toggleRowExpansion} 
            truncateText={truncateText}
          />
        )
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
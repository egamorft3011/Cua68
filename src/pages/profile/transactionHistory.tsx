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
import { TransactionHistoryItem } from "@/interface/TransactionHistory.interface";
import { getTransactionHistory } from "@/services/Bank.service";

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${day}/${month}/${year}`;
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "success":
    case "thành công":
      return { backgroundColor: "#4caf50", color: "#fff" };
    case "pending":
    case "đang xử lý":
    case "chờ duyệt":
      return { backgroundColor: "#ff9800", color: "#fff" };
    case "error":
    case "lỗi":
    case "thất bại":
      return { backgroundColor: "#f44336", color: "#fff" };
    default:
      return { backgroundColor: "#757575", color: "#fff" };
  }
};

const getVietnameseStatus = (status: string) => {
  switch (status.toLowerCase()) {
    case "success":
      return "Thành công";
    case "pending":
      return "Chờ duyệt";
    case "error":
      return "Thất bại";
    default:
      return status;
  }
};

// Desktop Table
const DesktopTable = ({
  rows,
  expandedRows,
  toggleRowExpansion,
}: {
  rows: TransactionHistoryItem[];
  expandedRows: Set<number>;
  toggleRowExpansion: (index: number) => void;
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
          Tên Ngân Hàng
        </Typography>
        <Typography sx={{ flex: "1 1 20%", whiteSpace: "nowrap" }}>
          Số tài khoản
        </Typography>
        <Typography sx={{ flex: "1 1 30%", whiteSpace: "nowrap" }}>
          Nội dung
        </Typography>
        <Typography sx={{ flex: "1 1 15%", whiteSpace: "nowrap" }}>
          Số tiền
        </Typography>
        <Typography sx={{ flex: "1 1 15%", whiteSpace: "nowrap" }}>
          Trạng thái
        </Typography>
      </Box>

      {rows?.map((t, i) => (
        <Card
          key={i}
          sx={{
            background: "#361414",
            borderBottom: "1px solid rgba(117, 56, 56, 0.35)",
            boxShadow: "none",
          }}
        >
          <CardContent sx={{ px: 2, py: 1 }}>
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
                  flex: "1 1 20%",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontSize: "0.9rem",
                }}
              >
                {t.bankNumber}
              </Typography>
              <Box
                sx={{
                  flex: "1 1 30%",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Typography
                  sx={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: expandedRows.has(i) ? "unset" : 1, // 1 dòng khi ẩn, full khi mở
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: expandedRows.has(i) ? "pre-wrap" : "normal",
                    wordBreak: "break-word",
                    flex: 1,
                  }}
                >
                  {t.info}
                </Typography>
                {t.info.length > 10 && (
                  <IconButton
                    size="small"
                    onClick={() => toggleRowExpansion(i)}
                    sx={{
                      color: "#ccc",
                      "&:hover": { color: "#fff" },
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
                  flex: "1 1 15%",
                  whiteSpace: "nowrap",
                  fontSize: "0.95rem",
                }}
              >
                {new Intl.NumberFormat("vi-VN").format(Number(t.amount ?? 0))}
              </Typography>
              <Box
                sx={{
                  flex: "1 1 15%",
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
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
);

// Mobile Cards
const MobileCards = ({
  rows,
  expandedRows,
  toggleRowExpansion,
}: {
  rows: TransactionHistoryItem[];
  expandedRows: Set<number>;
  toggleRowExpansion: (index: number) => void;
}) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
          <Typography
            variant="h6"
            sx={{
              color: "#fff",
              mb: 2,
              fontWeight: "bold",
              fontSize: "1.1rem",
            }}
          >
            {t.bankName}
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography sx={{ color: "#ccc", fontSize: "0.9rem" }}>
                Số tài khoản:
              </Typography>
              <Typography sx={{ color: "#fff", fontWeight: "500" }}>
                {t.bankNumber}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography sx={{ color: "#ccc", fontSize: "0.9rem" }}>
                Nội dung:
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                  sx={{
                    color: "#fff",
                    fontWeight: "500",
                    whiteSpace: expandedRows.has(i) ? "normal" : "nowrap",
                    overflow: expandedRows.has(i) ? "visible" : "hidden",
                    textOverflow: expandedRows.has(i) ? "unset" : "ellipsis",
                    wordBreak: "break-word",
                    flex: 1,
                  }}
                >
                  {t.info}
                </Typography>
                {t.info.length > 10 && (
                  <IconButton
                    size="small"
                    onClick={() => toggleRowExpansion(i)}
                    sx={{
                      color: "#ccc",
                      "&:hover": { color: "#fff" },
                      minWidth: "24px",
                      height: "24px",
                    }}
                  >
                    {expandedRows.has(i) ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                )}
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography sx={{ color: "#ccc", fontSize: "0.9rem" }}>
                Số tiền:
              </Typography>
              <Typography
                sx={{
                  color: "#4caf50",
                  fontWeight: "bold",
                  fontSize: "1rem",
                }}
              >
                {new Intl.NumberFormat("vi-VN").format(Number(t.amount ?? 0))}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography sx={{ color: "#ccc", fontSize: "0.9rem" }}>
                Trạng thái:
              </Typography>
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
);

export default function TransactionHistoryPage() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [rows, setRows] = useState<TransactionHistoryItem[]>([]);

  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);
  const [fromDate, setFromDate] = useState<string>(formatDate(sevenDaysAgo));
  const [toDate, setToDate] = useState<string>(formatDate(now));

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

  const fetchBettingHistory = async () => {
    try {
      if (!fromDate || !toDate) return;
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
  }, [page, fromDate, toDate]);

  return rows.length > 0 ? (
    isDesktop ? (
      <DesktopTable
        rows={rows}
        expandedRows={expandedRows}
        toggleRowExpansion={toggleRowExpansion}
      />
    ) : (
      <MobileCards
        rows={rows}
        expandedRows={expandedRows}
        toggleRowExpansion={toggleRowExpansion}
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
  );
}

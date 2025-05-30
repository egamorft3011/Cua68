"use client";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
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
export default function TransactionHistoryPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const handleChangePage = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
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
              }}
            >
              <Typography sx={{ flex: "1 1 20%", whiteSpace: "nowrap" }}>
                Tên Ngân Hàng
              </Typography>
              <Typography sx={{ flex: "1 1 10%", whiteSpace: "nowrap" }}>
                Số tài khoản
              </Typography>
              <Typography sx={{ flex: "1 1 25%", whiteSpace: "nowrap" }}>
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
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    px: 2,
                    py: 1,
                  }}
                >
                  <Typography sx={{ flex: "1 1 20%", whiteSpace: "nowrap" }}>
                    {t.bankName}
                  </Typography>
                  <Typography sx={{ flex: "1 1 10%", whiteSpace: "nowrap" }}>
                    {t.bankNumber}
                  </Typography>
                  <Typography sx={{ flex: "1 1 25%", whiteSpace: "nowrap" }}>
                    {t.info}
                  </Typography>
                  <Typography
                    fontWeight="bold"
                    color="success.main"
                    sx={{ flex: "1 1 20%", whiteSpace: "nowrap" }}
                  >
                    {t.amount}
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      background: "linear-gradient(45deg, #ff9800, #ff5722)",
                      color: "#fff",
                      flex: "1 1 20%",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {t.status}
                  </Button>
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

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  ToggleButtonGroup,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@mui/material";
import {
  BetsHistoryIcon,
  EmptyIcon,
  TransactionHistoryIcon,
} from "@/shared/Svgs/Svg.component";
import {
  getBettingHistory,
  getTransactionHistory,
} from "@/services/Bank.service";
import { TransactionHistoryItem } from "@/interface/TransactionHistory.interface";
import TransactionHistoryPage from "./transactionHistory";
import { BetHistoryItem } from "@/interface/BetHistory.interface";

const formatDate = (date: any): string => {
  if (!(date instanceof Date)) {
    date = new Date(date); // Convert to Date if it's not
  }
  
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date");
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${day}/${month}/${year}`;
};
export default function BettingHistoryPage() {
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  const [rows, setRows] = useState<BetHistoryItem[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
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
      const response = await getBettingHistory(page, limit, fromDate, toDate);

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

  const handleChangePage = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  return (
    <Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "space-between",
          mb: 1,
        }}
      >
        <Typography color="#ccc" mb={2}>
          Lịch sử cá cược của bạn trong vòng 7 ngày gần nhất.
        </Typography>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            gap: "10px",
            mb: 1,
          }}
        >
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            displayEmpty
            sx={{
              backgroundColor: "#5c2929",
              color: "#fff",
              width: {
                xs: "50%",
                sm: "180px",
              },
              height: "35px",
              borderRadius: "5px",
            }}
          >
            <MenuItem value="">Thể loại</MenuItem>
            <MenuItem value="bongda">Bóng đá</MenuItem>
            <MenuItem value="casino">Casino</MenuItem>
          </Select>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            displayEmpty
            sx={{
              backgroundColor: "#5c2929",
              color: "#fff",
              width: {
                xs: "50%",
                sm: "180px",
              },
              height: "35px",
              borderRadius: "5px",
            }}
          >
            <MenuItem value="">Trạng thái</MenuItem>
            <MenuItem value="win">Thắng</MenuItem>
            <MenuItem value="lose">Thua</MenuItem>
          </Select>
        </Box>
      </Box>

      <>
        {rows.length > 0 ? (
          <Box
            sx={{
              width: "100%",
              overflowX: "auto", // scroll chỉ tại đây
              background: "#141b36",
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
                  background: "#1c2340",
                  p: 2,
                }}
              >
                <Typography sx={{ flex: "1 1 20%", whiteSpace: "nowrap" }}>
                  Tên game
                </Typography>
                <Typography sx={{ flex: "1 1 10%", whiteSpace: "nowrap" }}>
                  Thời gian giao dịch
                </Typography>
                <Typography sx={{ flex: "1 1 10%", whiteSpace: "nowrap" }}>
                  Số tiền cược
                </Typography>
                <Typography sx={{ flex: "1 1 25%", whiteSpace: "nowrap" }}>
                  Số tiền cược hợp lệ
                </Typography>
                <Typography sx={{ flex: "1 1 20%", whiteSpace: "nowrap" }}>
                  Số tiền thắng
                </Typography>
                <Typography sx={{ flex: "1 1 20%", whiteSpace: "nowrap" }}>
                  Thời gian đặt cược
                </Typography>
                <Typography sx={{ flex: "1 1 20%", whiteSpace: "nowrap" }}>
                  Đơn vị tiền tệ
                </Typography>
              </Box>

              {/* Rows */}
              {rows?.map((t, i) => (
                <Card
                  key={i}
                  sx={{
                    background: "#141b36",
                    borderBottom: "1px solid rgba(56,67,117,.35)",
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
                      {t.gameName}
                    </Typography>
                    <Typography sx={{ flex: "1 1 10%", whiteSpace: "nowrap" }}>
                      {formatDate(t.transactionTime)}
                    </Typography>
                    <Typography sx={{ flex: "1 1 10%", whiteSpace: "nowrap" }}>
                      {t.betAmount}
                    </Typography>
                    <Typography sx={{ flex: "1 1 25%", whiteSpace: "nowrap" }}>
                      {t.validBetAmount}
                    </Typography>
                    <Typography
                      fontWeight="bold"
                      color="success.main"
                      sx={{ flex: "1 1 20%", whiteSpace: "nowrap" }}
                    >
                      {t.winAmount}
                    </Typography>
                    <Typography
                      fontWeight="bold"
                      color="success.main"
                      sx={{ flex: "1 1 20%", whiteSpace: "nowrap" }}
                    >
                      {t.betTime}
                    </Typography>
                    <Typography
                      fontWeight="bold"
                      color="success.main"
                      sx={{ flex: "1 1 20%", whiteSpace: "nowrap" }}
                    >
                      {t.currency}
                    </Typography>
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
    </Box>
  );
}

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
  useMediaQuery,
  useTheme,
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

// Desktop Table Component
const DesktopTable = ({ rows }: { rows: BetHistoryItem[] }) => (
  <Box
    sx={{
      width: "100%",
      overflowX: "auto",
      background: "#141b36",
      borderRadius: "10px",
    }}
  >
    <Box>
      {/* Header */}
      <Box
        display="flex"
        px={2}
        py={2}
        color="#ccc"
        sx={{
          background: "#1c2340",
          borderRadius: "10px 10px 0 0",
        }}
      >
        <Typography sx={{ width: "15%", fontSize: "12px", textAlign: "center" }}>
          Tên game
        </Typography>
        <Typography sx={{ width: "21%", fontSize: "12px", textAlign: "center" }}>
          Thời gian giao dịch
        </Typography>
        <Typography sx={{ width: "12%", fontSize: "12px", textAlign: "center" }}>
          Số tiền cược
        </Typography>
        <Typography sx={{ width: "15%", fontSize: "12px", textAlign: "center" }}>
          Số tiền cược hợp lệ
        </Typography>
        <Typography sx={{ width: "12%", fontSize: "12px", textAlign: "center" }}>
          Số tiền thắng
        </Typography>
        <Typography sx={{ width: "21%", fontSize: "12px", textAlign: "center" }}>
          Thời gian đặt cược
        </Typography>
        <Typography sx={{ width: "15%", fontSize: "12px", textAlign: "center" }}>
          Đơn vị tiền tệ
        </Typography>
      </Box>

      {/* Rows */}
      {rows?.map((t, i) => (
        <Box
          key={i}
          display="flex"
          px={2}
          py={2}
          sx={{
            background: "#141b36",
            borderBottom: i < rows.length - 1 ? "1px solid rgba(56,67,117,.35)" : "none",
            color: "#fff",
            alignItems: "center",
          }}
        >
          <Typography sx={{ width: "15%", fontSize: "12px", textAlign: "center" }}>
            {t.gameName}
          </Typography>
          <Typography sx={{ width: "21%", fontSize: "12px", textAlign: "center" }}>
            {formatDate(t.transactionTime)}
          </Typography>
          <Typography sx={{ width: "12%", fontSize: "12px", textAlign: "center" }}>
            {t.betAmount}
          </Typography>
          <Typography sx={{ width: "15%", fontSize: "12px", textAlign: "center" }}>
            {t.validBetAmount}
          </Typography>
          <Typography 
            sx={{ 
              width: "12%", 
              minWidth: "100px",
              color: Number(t.winAmount) > 0 ? "#4caf50" : "#fff",
              fontSize: "12px", 
              textAlign: "center"
            }}
          >
            {t.winAmount}
          </Typography>
          <Typography sx={{ width: "21%", fontSize: "12px", textAlign: "center" }}>
            {t.betTime}
          </Typography>
          <Typography sx={{ width: "15%", fontSize: "12px", textAlign: "center" }}>
            {t.currency}
          </Typography>
        </Box>
      ))}
    </Box>
  </Box>
);

// Mobile Cards Component
const MobileCards = ({ rows }: { rows: BetHistoryItem[] }) => (
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
          <Typography 
            variant="h6" 
            sx={{ 
              color: "#fff", 
              mb: 2, 
              fontWeight: "bold",
              fontSize: "1.1rem"
            }}
          >
            {t.gameName}
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ color: "#ccc", fontSize: "0.9rem" }}>
                Thời gian giao dịch:
              </Typography>
              <Typography sx={{ color: "#fff", fontWeight: "500" }}>
                {formatDate(t.transactionTime)}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ color: "#ccc", fontSize: "0.9rem" }}>
                Số tiền cược:
              </Typography>
              <Typography sx={{ color: "#fff", fontWeight: "500" }}>
                {t.betAmount.toLocaleString()}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ color: "#ccc", fontSize: "0.9rem" }}>
                Số tiền cược hợp lệ:
              </Typography>
              <Typography sx={{ color: "#fff", fontWeight: "500" }}>
                {t.validBetAmount.toLocaleString()}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ color: "#ccc", fontSize: "0.9rem" }}>
                Số tiền thắng:
              </Typography>
              <Typography 
                sx={{ 
                  color: (Number(t.winAmount) > 0 ? "#4caf50" : "#f44336"),
                  fontWeight: "bold",
                  fontSize: "1rem"
                }}
              >
                {t.winAmount.toLocaleString()}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ color: "#ccc", fontSize: "0.9rem" }}>
                Thời gian đặt cược:
              </Typography>
              <Typography sx={{ color: "#4caf50", fontWeight: "500" }}>
                {t.betTime}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ color: "#ccc", fontSize: "0.9rem" }}>
                Đơn vị tiền tệ:
              </Typography>
              <Typography sx={{ color: "#4caf50", fontWeight: "500" }}>
                {t.currency}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    ))}
  </Box>
);

export default function BettingHistoryPage() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm')); // Use 'sm' or adjust to your preferred breakpoint
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

  const fetchBettingHistory = async () => {
    try {
      if (!fromDate || !toDate) return;
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
        {/* <Box
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
        </Box> */}
      </Box>

      {rows.length > 0 ? (
        isDesktop ? <DesktopTable rows={rows} /> : <MobileCards rows={rows} />
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
    </Box>
  );
}
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
import { getTransactionHistory } from "@/services/Bank.service";
import { TransactionHistoryItem } from "@/interface/TransactionHistory.interface";
import TransactionHistoryPage from "./transactionHistory";
import BettingHistoryPage from "./bettingHistory";
import HistoryTransaction from "./historyTransaction";

interface TabPProps {
  value: string;
}

export default function TransactionHistory(prog: TabPProps) {
  const [tab, setTab] = useState(prog.value ?? "transaction");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ p: { xs: "5px", sm: 3 } }}>
      <Box display="flex" gap={1} mb={2} sx={{ flexWrap: "wrap" }}>
        <ToggleButtonGroup
          value={tab}
          exclusive
          onChange={(e, val) => val && setTab(val)}
          sx={{
            width: "100%",
            borderRadius: 1,
            p: 0.3,
            marginRight: 1,
            display: "flex",
            gap: "5px",
            "& .MuiButton-root": {
              minWidth: "auto",
              padding: "6px 12px",
              borderRadius: 1,
            },
          }}
        >
          <Button
            onClick={() => setTab("transaction")}
            sx={{
              color: "#fff",
              fontWeight: "bold",
              display: "flex",
              gap: "5px",
              background: tab === "transaction" ? "#901d1d" : "#4c0101",
              fontSize: "12px",
              "&:hover": {
                background: "#901d1d",
              },
              [theme.breakpoints.down("sm")]: {
                "& span": {
                  display: "none",
                },
                "& svg": {
                  margin: 0,
                },
              },
            }}
          >
            <TransactionHistoryIcon />
            {!isMobile ? "Lịch sử Nạp/rút" : "Nạp/rút"}
          </Button>
          <Button
            onClick={() => setTab("bet")}
            sx={{
              color: "#fff",
              fontWeight: "bold",
              display: "flex",
              gap: "5px",
              background: tab === "bet" ? "#901d1d" : "#4c0101",
              fontSize: "12px",
              "&:hover": {
                background: "#901d1d",
              },
              [theme.breakpoints.down("sm")]: {
                "& span": {
                  display: "none",
                },
                "& svg": {
                  margin: 0,
                },
              },
            }}
          >
            <BetsHistoryIcon />
            {!isMobile ? "Lịch sử Cược" : "Cược"}
          </Button>
          <Button
            onClick={() => setTab("history")}
            sx={{
              color: "#fff",
              fontWeight: "bold",
              display: "flex",
              gap: "5px",
              background: tab === "history" ? "#901d1d" : "#4c0101",
              fontSize: "12px",
              whiteSpace: "nowrap", 
              "&:hover": {
                background: "#901d1d",
              },
              [theme.breakpoints.down("sm")]: {
                "& span": {
                  "&:nth-child(2)": {
                    content: '"Giao dịch"', // Fixed with quotes
                  },
                },
                "& svg": {
                  margin: 0,
                },
              },
            }}
          >
            <TransactionHistoryIcon />
            {!isMobile ? "Lịch sử Giao dịch" : "Giao dịch"}
          </Button>
        </ToggleButtonGroup>
      </Box>

      {tab === "transaction" && <TransactionHistoryPage />}
      {tab === "bet" && <BettingHistoryPage />}
      {tab === "history" && <HistoryTransaction />}
    </Box>
  );
}
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
import { getTransactionHistory } from "@/services/Bank.service";
import { TransactionHistoryItem } from "@/interface/TransactionHistory.interface";
import TransactionHistoryPage from "./transactionHistory";
import BettingHistoryPage from "./bettingHistory";

interface TabPProps {
  value: string;
}
export default function TransactionHistory(prog: TabPProps) {
  const [tab, setTab] = useState(prog.value ?? "transaction");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  return (
    <Box sx={{ p: { xs: "5px", sm: 3 } }}>
      <Box display="flex" gap={2} mb={3}>
        <ToggleButtonGroup
          value={tab}
          exclusive
          onChange={(e, val) => val && setTab(val)}
          sx={{
            width: "100%",
            borderRadius: 2,
            p: 0.5,
            marginRight: 2,
            display: "flex",
            gap: "10px",
          }}
        >
          <Button
            onClick={() => setTab("transaction")}
            sx={{
              color: "#fff",
              fontWeight: "bold",
              display: "flex",
              gap: "10px",
              background: tab === "transaction" ? "blue" : "#384375",
              "&:hover": {
                background: "blue",
              },
            }}
          >
            <TransactionHistoryIcon />
            Lịch sử giao dịch
          </Button>
          <Button
            onClick={() => setTab("bet")}
            sx={{
              color: "#fff",
              fontWeight: "bold",
              display: "flex",
              gap: "10px",
              background: tab === "bet" ? "blue" : "#384375",
              "&:hover": {
                background: "blue",
              },
            }}
          >
            <BetsHistoryIcon />
            Lịch sử cược
          </Button>
        </ToggleButtonGroup>
      </Box>

      {tab === "transaction" ? (
        <TransactionHistoryPage />
      ) : (
        <BettingHistoryPage />
      )}
    </Box>
  );
}

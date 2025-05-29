import React from "react";
import TransactionHistory from "@/pages/profile/transactionHistory";
import Deposit from "@/pages/profile/deposit";

export default function page() {
  return <Deposit value={2} history={"transaction"} />;
}

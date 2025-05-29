import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Dialog, Stack } from "@mui/material";
import Image from "next/image";
import swal from "sweetalert";

type CustomizedDialogProps = {
  open: boolean;
  onClose: () => void;
  data: any;
};

const DepostQRBankComponent = ({
  open,
  onClose,
  data,
}: CustomizedDialogProps) => {
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds

  useEffect(() => {
    // Reset timer when the dialog is opened
    if (open) {
      setTimeLeft(30 * 60); // Reset to 30 minutes
    }

    let timer: NodeJS.Timeout;

    if (open) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(timer); // Stop timer when timeLeft reaches 0
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer); // Cleanup timer when component unmounts or dialog closes
  }, [open]);

  // Format timeLeft into MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const copyToClipboard = (text: any) => {
    navigator.clipboard.writeText(text);
    alert(`Copied: ${text}`);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          backgroundColor: "#1d2631",
          color: "#fff",
          borderRadius: "8px",
          marginTop: "10%",
        },
      }}
    >
      <Box
        sx={{
          padding: "20px",
          textAlign: "center",
          width: "400px",
        }}
      >
        {/* QR Code */}
        <Image
          width={100}
          height={100}
          src={data?.qrCodeUrl}
          alt="QR Code"
          style={{
            width: "auto",
            height: "200px",
            borderRadius: "8px",
            marginBottom: "15px",
          }}
        />

        {/* Timer */}
        <Typography
          variant="h5"
          sx={{ color: "#ff4d4f", fontWeight: "bold", marginBottom: "15px" }}
        >
          {formatTime(timeLeft)}
        </Typography>

        {/* Details */}
        <Stack spacing={2}>
          {[
            { label: "Ngân hàng", value: data?.inforPayment.bankProvide },
            { label: "Số tài khoản", value: data?.inforPayment.bankNumber },
            { label: "Chủ tài khoản", value: data?.inforPayment.bankName },
            { label: "Số tiền nạp", value: data?.inforPayment.amount },
            { label: "Mã chuyển tiền", value: data?.inforPayment.fullContent },
          ].map((item, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "14px",
              }}
            >
              <Typography
                sx={{
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                {item.label}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Typography
                  sx={{
                    fontWeight: "bold",
                    color: "#00ff85",
                    fontSize: "14px",
                    textAlign: "left",
                  }}
                >
                  {item.value}
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => copyToClipboard(item.value)}
                  sx={{
                    backgroundColor: "#0e7490",
                    "&:hover": { backgroundColor: "#0694a2" },
                    fontSize: "0.7rem",
                    textTransform: "none",
                  }}
                >
                  Copy
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
        <button
          style={{
            background: "yellowgreen",
            color: "white",
            marginTop: 3,
            padding: 10,
            border: "none",
            borderRadius: 10,
            cursor: "pointer",
          }}
          onClick={() => {
            swal(
              "Depost",
              "The system will automatically check and add points for you",
              "success"
            );
            onClose();
          }}
        >
          Confirm Payment
        </button>
      </Box>
    </Dialog>
  );
};

export default DepostQRBankComponent;

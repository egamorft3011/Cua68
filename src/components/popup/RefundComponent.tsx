"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Box, Modal, Typography, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./FloatingRefund.module.css";
import { contentInstance } from "@/configs/CustomizeAxios";
import { getToken } from "@/configs/client-store";
import { formatCurrency, formatShortMoney } from "@/utils/formatMoney";
import swal from "sweetalert";
import Image from "next/image";

interface GameDetail {
  gameCategory: string;
  gameName: string;
  validBetAmount: number;
  netPnl: number;
}

const FloatingRefund: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [refundAmount, setRefundAmount] = useState(0); // State for dynamic refund amount
  const [refundData, setRefundData] = useState<GameDetail[]>([]); // State for refund data
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0); // Track window width
  const animationRef = useRef<number | null>(null);
  const nodeRef = useRef(null);

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const startPos = windowWidth <= 768 ? 500 : 2500;
  const endPos = windowWidth <= 768 ? -500 : -700;
  const duration = windowWidth <= 768 ? 15000 : 25000; // 15s on mobile, 25s on desktop
  const step = (startPos - endPos) / (duration / 16); // Move per frame
  
  const [position, setPosition] = useState(startPos);
  
  const token = getToken();

  const fetchRefunds = useCallback(async () => {
    try {
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await contentInstance.get("/api/game/refund", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status) {
        const data = response.data.data as GameDetail[];
        setRefundData(data); // Update refund data for the modal
        const total = data.reduce((sum, item) => sum + (item.netPnl || 0), 0);
        setRefundAmount(total); // Set the total refund amount
      } else {
        console.error("Failed to fetch refunds:", response.data.msg);
      }
    } catch (error) {
      console.error("Error fetching refunds:", error);
    }
  }, [token]);

  // Animation logic
  useEffect(() => {
    const animate = () => {
      if (isPaused) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      setPosition((prev) => {
        let next = prev - step;
        if (next <= endPos) {
          next = startPos;
        }
        return next;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    if (isVisible) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused, isVisible, startPos, endPos, step]); // Add animation parameters to dependencies

  // Fetch refund data from API
  useEffect(() => {
    fetchRefunds();
  }, [fetchRefunds]);

  const handleCloseMarquee = () => {
    setIsVisible(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    // setIsVisible(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleRefresh = () => {
    fetchRefunds();
  };

  const handleReceive = async () => {
    try {
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await contentInstance.post(
        "/api/game/claim-refund",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status) {
        const totalClaimed = response.data.total;
        setIsModalOpen(false); // Close the current modal
        // Show sweetalert success message
        swal(
          "Thành công!",
          `Đã nhận hoàn tiền ${formatCurrency(totalClaimed)} .`,
          "success"
        );
        // Refresh refund data after claiming
        fetchRefunds();
      } else {
        console.error("Claim failed:", response.data.msg);
        swal(
          "Thất bại!",
          response.data.msg || "Không thể nhận tiền.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error claiming refund:", error);
      swal(
        "Lỗi!",
        "Có lỗi xảy ra khi nhận tiền.",
        "error"
      );
    }
  };

  if (refundAmount <= 0 || (!isVisible && !isModalOpen)) return null;

  return (
    <>
      {isVisible && (
        // <Box
        //   className={styles.marqueeContainer}
        //   onMouseEnter={() => setIsPaused(true)}
        //   onMouseLeave={() => setIsPaused(false)}
        // >
        //   <Box className={styles.marqueeWrapper}>
        //     <Box
        //       className={styles.marqueeContent}
        //       style={{ transform: `translateX(${position}px)` }}
        //       onClick={handleOpenModal}
        //     >
        //       <Box className={styles.marqueeItem}>
        //         <Typography className={styles.marqueeText}>
        //           Bạn có hoàn trả <span className={styles.highlight}>{formatCurrency(refundAmount)}</span> Có thể nhận được!
        //         </Typography>
        //         <IconButton
        //           className={styles.closeButton}
        //           onClick={(e) => {
        //             e.stopPropagation();
        //             handleCloseMarquee();
        //           }}
        //           aria-label="Close marquee"
        //         >
        //           <CloseIcon />
        //         </IconButton>
        //       </Box>
        //     </Box>
        //   </Box>
        // </Box>
        <Box
            ref={nodeRef}
            style={{
              position: "fixed",
              right: "0",
              top: "55%",
              zIndex: 1000,
              cursor: 'pointer',
              userSelect: "none",
              touchAction: "none",
            }}
          >
          <Box
            onClick={handleOpenModal}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: 1,
              backgroundColor: "transparent",
            }}
          >
            <Typography
              variant="caption"
              style={{
                position: "absolute",
                top: "85%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                color: "#ffffff",
                fontWeight: "bold",
                textAlign: 'center',
                fontSize: '1rem',
                display: 'block'
              }}
            >
              {formatShortMoney(refundAmount)}
            </Typography>
            <Image
              src={"/images/Icon_lixi/icon_hoantra.png"}
              width={70}
              height={70}
              alt="Mini Game Icon"
              style={{ width: "70px", objectFit: "cover" }}
            />
          </Box>
        </Box>
      )}

      <Modal open={isModalOpen} onClose={handleCloseModal} sx={{ zIndex: 9999, }}>
        <Box className={styles.modalContent}>
          <Typography className={styles.modalTitle}>Hoàn trả ngay</Typography>
          <IconButton
            className={styles.modalCloseButton}
            onClick={handleCloseModal}
            aria-label="Close modal"
          >
            <Image 
              src={'/images/refund/close.png'}
              alt="Close button"
              width={45}
              height={45}
            />
          </IconButton>
          <Box className={styles.modalBody}>
            {/* <Typography className={styles.timeRange}>
              ~ Bây Giờ
            </Typography> */}
            <Box className={styles.tableHeader}>
              <Typography className={styles.tableCell}>Tên Trò Chơi</Typography>
              <Typography className={styles.tableCell}>Cược hợp lệ</Typography>
              <Typography className={styles.tableCell}>Hoàn trả</Typography>
            </Box>
            <Box className={styles.tableBody}>
              {refundData.length > 0 ? (
                refundData.map((item, index) => (
                  <Box key={index} className={styles.tableRow}>
                    <Box className={styles.tableCell}>
                      <Typography variant="caption">{item.gameCategory}</Typography>
                      <Typography>{item.gameName}</Typography>
                    </Box>
                    <Typography className={styles.tableCell}>{formatCurrency(item.validBetAmount)}</Typography>
                    <Typography className={styles.tableCell}>{formatCurrency(item.netPnl)}</Typography>
                  </Box>
                ))
              ) : (
                <Typography>No refund data available.</Typography>
              )}
            </Box>
            <Box className={styles.tableFooter}>
              <Typography className={styles.footerLabel}>Tổng</Typography>
              <Typography className={styles.footerValue}>{formatCurrency(refundAmount)}</Typography>
            </Box>
            <Box className={styles.buttonContainer}>
              <button
                className={`${styles.actionButton} ${styles.refreshButton}`}
                onClick={handleRefresh}
              >
                Làm mới
              </button>
              <button
                className={`${styles.actionButton} ${styles.receiveButton}`}
                onClick={handleReceive}
              >
                Nhận ngay
              </button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default FloatingRefund;
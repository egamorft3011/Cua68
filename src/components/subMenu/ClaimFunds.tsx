"use client";

import React, { useState, useEffect } from "react";
import { Box, Modal, IconButton, Grid, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import swal from "sweetalert";
import { contentInstance } from "@/configs/CustomizeAxios";
import { AxiosError } from "axios";

interface Reward {
  id: number;
  uid: number;
  username: string;
  betNum: number;
  betAmount: number;
  awardRate: number;
  betAward: number;
  validTime: string;
  status: string;
  createdAt: string;
}

interface ClaimFundsProps {
  refreshUserData?: () => Promise<void>;
}

export default function ClaimFunds({ refreshUserData }: ClaimFundsProps) {
  // Auth check states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  
  // Existing states
  const [open, setOpen] = useState(false);
  const [openedIndices, setOpenedIndices] = useState<number[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(false);

  // Function to fetch rewards
  const fetchRewards = async () => {
    const token = localStorage.getItem("tokenCUA68");
    if (!token) {
      setRewards([]);
      return;
    }

    try {
      const response = await contentInstance.get("/api/game/daily-award", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("API Response:", response);
      if (response.status && response.data.data) {
        setRewards(response.data.data); // Set rewards from API
      } else {
        throw new Error("Failed to fetch rewards");
      }
    } catch (error: any) {
      let errorMessage = "Failed to fetch rewards";
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.msg || error.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error("Fetch Rewards Error:", errorMessage);
      setRewards([]); // Ensure rewards is empty on error
    }
  };

  // Check authentication and fetch rewards on mount
  useEffect(() => {
    const checkAuthAndFetchRewards = async () => {
      const token = localStorage.getItem("tokenCUA68");
      setIsAuthenticated(!!token);
      setAuthChecked(true);

      if (token) {
        await fetchRewards();
      }
    };

    checkAuthAndFetchRewards();
  }, []);

  const handleOpenModal = async () => {
    // Reset opened indices và fetch rewards mỗi lần mở modal
    setOpenedIndices([]);
    await fetchRewards();
    setOpen(true);
  };

  const handleCloseModal = async () => {
    setOpen(false);
    // Sau khi đóng modal, kiểm tra lại rewards để ẩn icon nếu hết lì xì
    await fetchRewards();
  };

  const handleOpenGift = async (index: number) => {
    if (loading || openedIndices.includes(index) || !rewards[index]) {
      console.warn("Cannot open gift: ", { loading, opened: openedIndices.includes(index), hasReward: !!rewards[index] });
      return; // Prevent action if loading, already opened, or no reward
    }

    const reward = rewards[index];
    if (!reward?.id) {
      console.error("Invalid reward ID at index:", index, reward);
      swal("Error", "Invalid reward data", "error");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("tokenCUA68");
      if (!token) {
        throw new Error("No token found");
      }

      const rewardId = reward.id;
      const response = await contentInstance.post(
        `/api/game/claim-award/${rewardId}`,
        { id: rewardId.toString() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("POST API Response:", response);
      if (response.status) {
        setOpenedIndices([...openedIndices, index]);
        if (refreshUserData) {
          await refreshUserData(); // Gọi callback để cập nhật số dư
        }
        // swal("Success", `You received ${reward.betAward.toLocaleString()}đ!`, "success");
      } else {
        swal("Lỗi", "Bạn không thể nhận lì xì này!", "error");
      }
    } catch (error: unknown) {
      console.error("POST API Error:", error);
      let errorMessage = "Failed to claim reward";
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.msg || error.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      swal("Error", errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  // Don't render anything if auth not checked yet or user not authenticated
  if (!authChecked || !isAuthenticated) {
    return null;
  }

  // Don't render the gift icon if there are no rewards
  if (rewards.length === 0) {
    return null;
  }

  return (
    <React.Fragment>
      <Box
        sx={{
          position: "fixed",
          top: "50%",
          right: 0,
          transform: "translateY(-50%)",
          zIndex: 1000,
          cursor: "pointer",
          width: 60,
          height: 60,
        }}
        onClick={handleOpenModal}
      >
        {/* Light xoay */}
        <Box
          component="img"
          src="/images/Icon_lixi/light1.png"
          alt="Light Spin"
          sx={{
            position: "absolute",
            top: "-30%",
            left: "-30%",
            width: "150%",
            height: "auto",
            zIndex: 0,
            animation: "spin 3s linear infinite",
            transformOrigin: "center",
          }}
        />

        {/* Icon chính */}
        <Box
          component="img"
          src="/images/Icon_lixi/icon_index_lixi.png"
          alt="Lì xì"
          sx={{
            width: "100%",
            height: "100%",
            animation: "pulseZoom 2s infinite",
            position: "relative",
            zIndex: 1,
          }}
        />
      </Box>

      <Modal 
        open={open} 
        onClose={handleCloseModal}
        sx={{
          zIndex: 9999,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            bgcolor: "transparent",
            width: "95%",
            maxWidth: 600,
            height: "100vh",
            textAlign: "center",
            outline: "none",
            border: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Title với light effect */}
          <Box sx={{ position: "relative", width: "100%", mb: 4 }}>
            {/* Light xoay phía sau title */}
            <Box
              component="img"
              src="/images/Icon_lixi/light1.png"
              alt="Light Effect"
              sx={{
                position: "absolute",
                top: openedIndices.length > 0 ? "-230%" : "10%",
                left: openedIndices.length > 0 ? "10%" : "50%",
                transform: "translate(-50%, -50%)",
                width: "80%",
                height: "auto",
                zIndex: 0,
                animation: openedIndices.length > 0 ? "spin 3s linear infinite" : "none",
                transformOrigin: "center",
              }}
            />

            {/* Title image */}
            <Box
              component="img"
              src="/images/Icon_lixi/title.png"
              alt="Title"
              sx={{
                width: "100%",
                height: "auto",
                position: "relative",
                zIndex: 1,
              }}
            />
          </Box>

          {/* Content area */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              width: "100%",
            }}
          >
            {rewards.length === 0 ? (
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "#fbc16c",
                  mb: 4,
                }}
              >
                Hôm nay bạn không có lì xì, Quay lại vào hôm sau nhé
              </Typography>
            ) : (
              <Grid container spacing={5} justifyContent="center">
                {rewards.map((reward, index) => (
                  <Grid item xs={4} sm={3} key={reward.id}>
                    <Box
                      sx={{
                        position: "relative",
                        cursor: "pointer",
                        width: "100%",
                        "&:hover": {
                          transform: openedIndices.includes(index)
                            ? "none"
                            : "scale(1.05)",
                          transition: "0.3s",
                        },
                      }}
                      onClick={() => handleOpenGift(index)}
                    >
                      {openedIndices.includes(index) ? (
                        <Box sx={{ position: "relative", width: "100%" }}>
                          <Box
                            component="img"
                            src="/images/Icon_lixi/light1.png"
                            alt="Light Effect"
                            sx={{
                              position: "absolute",
                              top: "-45%",
                              left: "-65%",
                              width: "230%",
                              height: "auto",
                              zIndex: 0,
                              animation: "spin 3s linear infinite",
                              transformOrigin: "center",
                            }}
                          />

                          <Box
                            component="img"
                            src="/images/Icon_lixi/box_lixi.png"
                            alt="Opened"
                            sx={{
                              width: "100%",
                              position: "relative",
                              zIndex: 1,
                            }}
                          />

                          <Typography
                            sx={{
                              position: "absolute",
                              top: "32%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              fontSize: "12px",
                              fontWeight: "bold",
                              background:
                                "linear-gradient(to bottom, #ff3d00, #ff9100)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              zIndex: 2,
                            }}
                          >
                            {reward.betAward.toLocaleString()}đ
                          </Typography>
                        </Box>
                      ) : (
                        <Box
                          component="img"
                          src="/images/Icon_lixi/box_lixi_unactive.png"
                          alt="Gift Box"
                          sx={{ width: "100%" }}
                        />
                      )}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>

          {/* Close button */}
          <IconButton
            onClick={handleCloseModal}
            sx={{
              mt: 4,
              mb: 4,
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              border: "2px solid transparent",
              "&:hover": { 
                backgroundColor: "rgba(255, 255, 255, 0.3)",
                border: "2px solid rgba(255, 255, 255, 0.5)",
              },
            }}
          >
            <CloseIcon sx={{ color: "white" }} />
          </IconButton>
        </Box>
      </Modal>

      <style jsx global>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulseZoom {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
      `}</style>
    </React.Fragment>
  );
}
"use client";

import React, { useState } from "react";
import { Box, Modal, IconButton, Grid, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import swal from "sweetalert";

const rewards = [10000, 25000, 100000];

export default function ClaimFunds() {
  const [open, setOpen] = useState(false);
  const [openedIndex, setOpenedIndex] = useState<number | null>(null);

  const handleOpenGift = (index: number) => {
    if (openedIndex !== null) {
      swal("Bạn đã mở rồi!", "Chỉ được mở 1 túi lì xì duy nhất!", "error");
      return;
    }

    setOpenedIndex(index);
  };

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          top: "50%",
          right: 0,
          transform: "translateY(-50%)",
          zIndex: 1000,
          cursor: "pointer",
        }}
        onClick={() => {
          setOpen(true);
          setOpenedIndex(null);
        }}
      >
        <Box
          component="img"
          src="/images/Icon_lixi/icon_index_lixi.png"
          alt="Lì xì"
          sx={{
            width: 60,
            height: 60,
            animation: "pulseZoom 2s infinite",
          }}
        />
      </Box>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "#fff",
            borderRadius: 3,
            width: "95%",
            maxWidth: 600,
            p: 3,
            textAlign: "center",
            boxShadow: 24,
          }}
        >
          <IconButton
            onClick={() => setOpen(false)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "#eee",
              "&:hover": { backgroundColor: "#ccc" },
            }}
          >
            <CloseIcon />
          </IconButton>

          <Box
            component="img"
            src="/images/Icon_lixi/title.png"
            alt="Decor"
            sx={{
              width: "100%",
              height: "auto",
              mb: 4,
            }}
          />

          <Grid container spacing={5} justifyContent="center">
            {rewards.map((amount, index) => (
              <Grid item xs={4} sm={3} key={index}>
                <Box
                  sx={{
                    position: "relative",
                    cursor: "pointer",
                    width: "100%",
                    "&:hover": {
                      transform:
                        openedIndex === null ? "scale(1.05)" : "none",
                      transition: "0.3s",
                    },
                  }}
                  onClick={() => handleOpenGift(index)}
                >
                  {openedIndex === index ? (
                    <Box sx={{ position: "relative", width: "100%" }}>
                      <Box
                        component="img"
                        src="/images/Icon_lixi/light1.png"
                        alt="Light Effect"
                        sx={{
                          position: "absolute",
                          top: "-25%",
                          left: "-25%",
                          width: "150%",
                          height: "150%",
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
                          background: "linear-gradient(to bottom, #ff3d00, #ff9100)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          zIndex: 2,
                        }}
                      >
                        {amount.toLocaleString()}đ
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
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
      `}</style>
    </>
  );
}

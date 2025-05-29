import React from "react";
import { Grid, Box, Typography } from "@mui/material";
import Image from "next/image";
import NumberCount from "../NumberCount/NumberCount";
import { userResponse } from "@/interface/user.interface";

type CustomizedDialogProps = {
  open: boolean;
  onClose: () => void;
  onFirstItemClick: () => void; // New prop to handle first item click
};

const gameItems = [
  {
    src: "https://assets.vgjt.info/images/mn_lnch/tx.png",
    count: 70779401,
  },
  { src: "https://assets.vgjt.info/images/mn_lnch/roulette.png" },
  {
    src: "https://assets.vgjt.info/images/mn_lnch/xocdia.png",
    count: 93009670,
  },
  { src: "https://assets.vgjt.info/images/mn_lnch/mrbean.png" },
  { src: "https://assets.vgjt.info/images/mn_lnch/tnj.png" },
  { src: "https://assets.vgjt.info/images/mn_lnch/vsc.png" },
  {
    src: "https://assets.vgjt.info/images/mn_lnch/mn_poker.png",
    count: 64439900,
  },
  {
    src: "https://assets.vgjt.info/images/mn_lnch/hilow.png",
    count: 34916197,
  },
  { src: "https://assets.vgjt.info/images/mn_lnch/superwheel.png" },
];

export default function MiniGameComponent({
  open,
  onClose,
  onFirstItemClick,
}: CustomizedDialogProps) {
  if (!open) return null;

  const handleBackdropClick = (event: React.MouseEvent) => {
    onClose();
  };

  const handleContentClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent clicks inside content from closing the dialog
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 10000,
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent backdrop
      }}
      onClick={handleBackdropClick}
    >
      <Box
        sx={{
          width: { xs: "90vw", sm: "390px" },
          maxWidth: "100%",
          position: "relative",
          top: { xs: "0", sm: "-100px" },
        }}
        onClick={handleContentClick}
      >
        <Box
          sx={{
            width: "100%",
            padding: 3,
            backgroundImage: "url(/images/bg_new.png)",
            backgroundSize: "100% 100%",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Optional: add shadow for depth
          }}
        >
          <Grid
            container
            spacing={2}
            columns={3}
            justifyContent="center"
            alignItems="center"
          >
            {gameItems.map((item, index) => (
              <Grid item xs={1} key={index}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    justifyItems: "center",
                    position: "relative",
                    transition: "transform 0.5s",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                    width: "97px",
                    height: "97px",
                    margin: "0 auto",
                  }}
                >
                  <a
                    href="#"
                    style={{ margin: "auto" }}
                    onClick={(e) => {
                      e.preventDefault(); // Prevent default link behavior
                      if (index === 0) {
                        onClose(); // Close MiniGameComponent
                        onFirstItemClick(); // Open MiniGameIframeComponent
                      }
                    }}
                  >
                    <Image
                      src={item.src}
                      alt={`game-${index}`}
                      width={90}
                      height={90}
                      style={{
                        objectFit: "contain",
                        width: "95px",
                        height: "95px",
                      }}
                    />
                  </a>
                  {item.count && (
                    <Typography
                      sx={{
                        position: "absolute",
                        bottom: 1,
                        width: "100%",
                        textAlign: "center",
                        color: "#FFEE5E",
                        fontSize: 11,
                        fontWeight: "bold",
                        lineHeight: 2,
                      }}
                    >
                      <NumberCount
                        classname="minigame-count"
                        numStart={1000}
                        numEnd={item?.count}
                      />
                    </Typography>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}

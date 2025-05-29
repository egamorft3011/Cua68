"use client";
import React from "react";
import Image from "next/image";
import NumberCount from "@/components/NumberCount/NumberCount";
import swal from "sweetalert";
import usePlayGame from "@/hook/usePlayGame";
import SimpleBackdrop from "@/components/Loading/LoaddingPage";
import { GameChicken } from "@/datafake/ListGame";
import { Box, Typography, Button } from "@mui/material";

export default function ChickenPage() {
  const { loading, playGame } = usePlayGame();
  const commonImgStyles = {
    height: {
      xs: "310px",
      sm: "340px",
    },
    position: "absolute",
    transition: "0.2s ease-in-out",
    zIndex: 1,
    top: 0,
    left: 0,
    width: "100%",
    "&:hover": {
      filter: "blur(3px)",
    },
  };
  const commonTextBoxStyles = {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    zIndex: 2,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
  };

  const commonCardStyles = {
    width: {
      xs: "230px",
      sm: "280px",
    },
    height: {
      xs: "310px",
      sm: "340px",
    },
    borderRadius: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    transition: "0.2s ease-in-out",
    position: "relative",
    overflow: "hidden",
    "&:hover .MuiButton-root": {
      opacity: 1,
    },
    "&:hover": {
      transform: "scale(1.04) rotate(-1deg)",
    },
  };

  const buttonStyles = {
    backgroundImage:
      "url(/images/bg-btn.png), conic-gradient(from 0deg at 50% 50%, #085cff 0deg, #2692e0 89.73deg, #263be0 180.18deg, #085cff 1turn)",

    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    zIndex: 3,
    pointerEvents: "auto",
    opacity: 0,
    transition: "opacity 0.2s ease-in-out",
    "&:hover": {
      backgroundImage:
        "url(/images/bg-btn.png), conic-gradient(from 0deg at 50% 50%, #085cff 0deg, #2692e0 89.73deg, #263be0 180.18deg, #085cff 1turn)",

      opacity: 1,
      filter: "none",
    },
  };

  return (
    <>
      {loading ? (
        <>
          <SimpleBackdrop />
          <Box
            sx={{
              width: "80%",
              margin: "auto",
              marginTop: 10,
              paddingTop: 10,
              paddingBottom: {
                xs: 80,
                sm: 20,
              },
            }}
          >
            <Typography
              variant="h2"
              sx={{
                color: "white",
                fontWeight: 600,
                fontSize: "30px",
                height: 50,
              }}
            >
              Chicken Kick
            </Typography>
          </Box>
        </>
      ) : (
        <Box
          sx={{
            width: "100%",
            height: {
              xs: "430px",
              sm: "580px",
            },
            aspectRatio: " 1440 / 600",
            background: "url(/images/bg-daga.webp) no-repeat 50%",
            backgroundSize: "cover",
          }}
        >
          <Box
            sx={{
              width: "80%",
              height: "100%",
              margin: "auto",
              paddingTop: {
                xs: 30,
                sm: 20,
              },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingBottom: {
                xs: 80,
                sm: 2,
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: "15px",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {GameChicken.map((item) => (
                <Box key={item.id} sx={commonCardStyles}>
                  <Box sx={commonImgStyles}>
                    <Image
                      src={item.images}
                      alt=""
                      width={1800}
                      height={2400}
                      style={{
                        height: "100%",
                        width: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>

                  <Box sx={commonTextBoxStyles}>
                    <Button
                      sx={buttonStyles}
                      onClick={() => playGame(item.codeGame, item.gameId)}
                    >
                      Chơi ngay
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
}

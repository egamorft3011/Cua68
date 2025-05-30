"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import usePlayGame from "@/hook/usePlayGame";
import SimpleBackdrop from "@/components/Loading/LoaddingPage";
import { Box, Typography, Button, Pagination } from "@mui/material";
import { getListGame } from "@/services/GameApi.service";

const commonImgStyles = {
  height: {
    xs: "160px",
    sm: "200px",
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
    xs: "130px",
    sm: "180px",
  },
  height: {
    xs: "160px",
    sm: "200px",
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
    "url(/images/bg-btn.png), conic-gradient(from 0deg at 50% 50%, #ff0808 0deg, #e02626 89.73deg, #e02626 180.18deg, #ff0808 1turn)",

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
      "url(/images/bg-btn.png), conic-gradient(from 0deg at 50% 50%, #ff0808 0deg, #e02626 89.73deg, #e02626 180.18deg, #ff0808 1turn)",

    opacity: 1,
    filter: "none",
  },
};

export default function ExplodingJarPage() {
  const { loading, playGame } = usePlayGame();
  const [load, setLoad] = useState<boolean>(false);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [gameTable, setGameTable] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 18;

  useEffect(() => {
    setLoad(true);
    getListGame("FC", "RNG").then((res) => {
      if (res.data) {
        setGameTable(res.data.games);
        setLoad(false);
      }
    });
  }, []);

  // Tính toán item hiển thị
  const totalPages = Math.ceil(gameTable.length / itemsPerPage);
  const displayedGames = gameTable.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setIsPageLoading(true);
    setTimeout(() => {
      setCurrentPage(page);
      setIsPageLoading(false);
    }, 1000);
  };

  return (
    <>
      {loading || load || isPageLoading ? (
        <>
          <SimpleBackdrop />
          <Box
            sx={{
              width: "80%",
              margin: "auto",
              height: "1000px",
              marginTop: 10,
              paddingTop: 10,
              paddingBottom: {
                xs: 80,
                sm: 20,
              },
            }}
          ></Box>
        </>
      ) : (
        <Box
          sx={{
            width: "80%",
            margin: "auto",
            marginTop: 10,
            paddingTop: 10,
            paddingBottom: {
              xs: 10,
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
            Multiplier Games
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: "15px",
              flexWrap: "wrap",
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
            {displayedGames.map((item: any) => (
              <Box key={item.id} sx={commonCardStyles}>
                <Box sx={commonImgStyles}>
                  <Image
                    src={item.icon}
                    alt=""
                    style={{
                      height: "100%",
                      width: "100%",
                      objectFit: "contain",
                    }}
                    width={200}
                    height={200}
                    layout="responsive"
                    placeholder="blur"
                    blurDataURL="/images/gallery-icon-picture-landscape-vector-sign-symbol_660702-224.avif"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "/images/gallery-icon-picture-landscape-vector-sign-symbol_660702-224.avif"; // Đường dẫn fallback
                    }}
                  />
                </Box>

                <Box sx={commonTextBoxStyles}>
                  <Button
                    sx={buttonStyles}
                    onClick={() => playGame(item.tcgGameCode, item.productCode)}
                  >
                    Chơi ngay
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            sx={{
              display: "flex",
              justifyContent: "center",
              "& .MuiPaginationItem-root": {
                color: "white", // Mặc định chữ màu trắng
              },
              "& .Mui-selected": {
                backgroundColor: "#b20707", // Nền màu xanh vàng khi active
                color: "white", // Chữ màu trắng
                "&:hover": {
                  backgroundColor: "#b20707", // Duy trì màu khi hover
                },
              },
            }}
          />
        </Box>
      )}
    </>
  );
}

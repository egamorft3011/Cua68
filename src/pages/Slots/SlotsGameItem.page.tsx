"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import usePlayGame from "@/hook/usePlayGame";
import SimpleBackdrop from "@/components/Loading/LoaddingPage";
import {
  Box,
  Typography,
  Button,
  Pagination,
  Tooltip,
  IconButton,
} from "@mui/material";
import { getListGame } from "@/services/GameApi.service";
import { GameSlotsMenu } from "@/datafake/Menu";

const commonImgStyles = {
  height: {
    xs: "105px",
    sm: "170px",
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
    xs: "105px",
    sm: "170px",
  },
  height: {
    xs: "105px",
    sm: "170px",
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
    "url(/images/bg-btn.png), conic-gradient(from 0deg at 50% 50%,rgb(255, 8, 8)rgb(224, 38, 38)2692e0 8rgb(224, 38, 38)rgb(224, 38, 38) 180.18deg, #085cff 1turn)",

  color: "white",
  padding: "4px 10px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  zIndex: 3,
  pointerEvents: "auto",
  opacity: 0,
  transition: "opacity 0.2s ease-in-out",
  "&:hover": {
    backgroundImage:
      "url(/images/bg-btn.png), conic-gradient(from 0deg at 50% 50%,rgb(255, 8, 8) 0deg,rgb(224, 38, 38) 89.73deg,rgb(224, 38, 38) 180.18deg,rgb(255, 8, 8) 1turn)",

    opacity: 1,
    filter: "none",
  },
};
type ItemProps = {
  GameType: string;
  ProductType: string;
};
export default function SlotsGameItemPage({
  ProductType,
  GameType,
}: ItemProps) {
  const { loading, playGame } = usePlayGame();
  const [load, setLoad] = useState<boolean>(false);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [gameTable, setGameTable] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 30;

  useEffect(() => {
    setLoad(true);
    getListGame(ProductType, GameType).then((res) => {
      if (res.data.games.length > 30) {
        const gamesFromPosition20 = res.data.games.slice(29);
        console.log("res.data", res.data.games);
        setGameTable(gamesFromPosition20);
        setLoad(false);
        setCurrentPage(1);
      } else {
        setGameTable(res.data.games);
        setLoad(false);
        setCurrentPage(1);
      }
    });
  }, [ProductType, GameType]);

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

  const handleImageError = (index: number) => {
    setGameTable((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      {loading || load || isPageLoading ? (
        <></>
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              gap: "15px",
              flexWrap: "wrap",
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
            {displayedGames.map((item: any, index) => (
              <Box key={item.id} sx={commonCardStyles}>
                <Box sx={commonImgStyles}>
                  <Image
                    src={item.icon}
                    alt=""
                    width={200}
                    height={200}
                    layout="responsive"
                    placeholder="blur"
                    loading="lazy"
                    blurDataURL="/images/gallery-icon-picture-landscape-vector-sign-symbol_660702-224.avif"
                    style={{
                      height: "100%",
                      width: "100%",
                      objectFit: "cover",
                    }}
                    onError={() => handleImageError(index)} // Gọi hàm khi lỗi
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
                backgroundColor: "#ee0000", // Nền màu xanh vàng khi active
                color: "white", // Chữ màu trắng
                "&:hover": {
                  backgroundColor: "#4f1401", // Duy trì màu khi hover
                },
              },
            }}
          />
        </>
      )}
    </>
  );
}

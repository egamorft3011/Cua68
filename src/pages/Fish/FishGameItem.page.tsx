"use client";
import React, { useEffect, useState, useMemo } from "react";
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
import { getListGame, getListGameFish } from "@/services/GameApi.service";
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
    "url(/images/bg-btn.png), conic-gradient(from 0deg at 50% 50%, #ff0808 0deg, #e02626 89.73deg, #e02626 180.18deg, #ff0808 1turn)",
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
      "url(/images/bg-btn.png), conic-gradient(from 0deg at 50% 50%, #ff0808 0deg, #e02626 89.73deg, #e02626 180.18deg, #ff0808 1turn)",
    opacity: 1,
    filter: "none",
  },
};

type ItemProps = {
  GameType: string;
  ProductType: string;
  searchTerm?: string; // Thêm prop searchTerm
};

export default function FishGameItemPage({
  ProductType,
  GameType,
  searchTerm = "", // Thêm searchTerm với default value
}: ItemProps) {
  const { loading, playGame } = usePlayGame();
  const [load, setLoad] = useState<boolean>(false);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [gameTable, setGameTable] = useState<any[]>([]);
  const [allGames, setAllGames] = useState<any[]>([]); // Lưu trữ toàn bộ games
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 30;

  useEffect(() => {
    setLoad(true);
    getListGameFish().then((res) => {
      if (res.data) {
        const arrayData = Object.keys(res.data).map((key) => ({
          id: key, // Lấy key làm id
          ...res.data[key], // Sao chép dữ liệu bên trong object
        }));
        setGameTable(arrayData);
        setAllGames(arrayData);
        setLoad(false);
        setCurrentPage(1);
      }
    });
  }, []);

  // Filter games theo searchTerm
    const filteredGames = useMemo(() => {
      if (!searchTerm.trim()) {
        return allGames; // Trả về toàn bộ games nếu không có search term
      }
      
      return allGames.filter((game) => {
        const gameName = game.name || "";
        const gameDescription = game.description || "";
        
        return (
          gameName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          gameDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
          game.tcgGameCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          game.productCode?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }, [allGames, searchTerm]);
  
    // Reset về trang 1 khi searchTerm thay đổi
    useEffect(() => {
      setCurrentPage(1);
    }, [searchTerm]);
  
    // Cập nhật gameTable khi filteredGames thay đổi
    useEffect(() => {
      setGameTable(filteredGames);
    }, [filteredGames]);
  

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
          {/* Hiển thị thông tin tìm kiếm */}
          {searchTerm && (
            <Box sx={{ 
              textAlign: 'center', 
              mb: 2,
              color: 'white',
              backgroundColor: 'rgba(255,255,255,0.1)',
              padding: '10px',
              borderRadius: '8px'
            }}>
              <Typography variant="body2">
                {displayedGames.length > 0 
                  ? `Tìm thấy ${displayedGames.length} trò chơi cho "${searchTerm}"`
                  : `Không tìm thấy trò chơi nào cho "${searchTerm}"`
                }
              </Typography>
            </Box>
          )}

          {/* Hiển thị games */}
          {displayedGames.length > 0 ? (
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
                  <Box
                    key={`${item.id}-${index}`}
                    sx={{
                      width: { xs: "105px", sm: "170px" },
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    {/* Box hình + overlay nút */}
                    <Box sx={commonCardStyles}>
                      <Box sx={commonImgStyles}>
                        <Image
                          src={item.icon}
                          alt={item.gameName || item.name || item.tcgGameCode || "Game"}
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
                          onError={() => handleImageError(index)}
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

                    {/* Tên game nằm ngoài ảnh */}
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: { xs: "12px", sm: "14px" },
                        fontWeight: "bold",
                        textAlign: "center",
                        color: "white",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "100%",
                      }}
                    >
                      {item.gameName || item.name || item.tcgGameCode}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Phân trang */}
              {totalPages > 1 && (
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    "& .MuiPaginationItem-root": {
                      color: "white",
                    },
                    "& .Mui-selected": {
                      backgroundColor: "#b20707",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#4f1401",
                      },
                    },
                  }}
                />
              )}
            </>
          ) : (
            /* Hiển thị khi không có kết quả */
            !loading && !load && searchTerm && (
              <Box sx={{ 
                textAlign: 'center', 
                color: 'white',
                py: 4
              }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Không tìm thấy trò chơi nào
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  Hãy thử tìm kiếm với từ khóa khác
                </Typography>
              </Box>
            )
          )}
        </>
      )}
    </>
  );
}

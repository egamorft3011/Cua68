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
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { getListGame } from "@/services/GameApi.service";
import { 
  getListFavorites, 
  addToFavorites, 
  removeFromFavorites, 
  getGameCategory 
} from "@/services/FavoriteApi.service";
import { GameSlotsMenu } from "@/datafake/Menu";
import swal from "sweetalert";

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

const favoriteButtonStyles = {
  position: "absolute",
  top: "8px",
  right: "8px",
  zIndex: 4,
  pointerEvents: "auto",
  opacity: 1,
  transition: "all 0.2s ease-in-out",
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  padding: "4px",
  minWidth: "auto",
  width: "32px",
  height: "32px",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    transform: "scale(1.1)",
  },
};

// Style cho trái tim chưa yêu thích (rỗng)
const favoriteEmptyStyles = {
  ...favoriteButtonStyles,
  color: "#ffffff",
  "&:hover": {
    ...favoriteButtonStyles["&:hover"],
    color: "#ffd700",
  },
};

// Style cho trái tim đã yêu thích (đầy)
const favoriteFilledStyles = {
  ...favoriteButtonStyles,
  color: "#ff4444",
  "&:hover": {
    ...favoriteButtonStyles["&:hover"],
    color: "#ff0000",
  },
};

type ItemProps = {
  GameType: string;
  ProductType: string;
  searchTerm?: string;
};

export default function SlotsGameItemPage({
  ProductType,
  GameType,
  searchTerm = "",
}: ItemProps) {
  const { loading, playGame } = usePlayGame();
  const [load, setLoad] = useState<boolean>(false);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [gameTable, setGameTable] = useState<any[]>([]);
  const [allGames, setAllGames] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [favoriteGames, setFavoriteGames] = useState<Set<string>>(new Set());
  const [favoriteLoading, setFavoriteLoading] = useState<string>('');
  const itemsPerPage = 30;

  // Fetch games từ API
  useEffect(() => {
    setLoad(true);
    getListGame(ProductType, GameType).then((res) => {
      if (res.data.games.length > 30) {
        const gamesFromPosition20 = res.data.games.slice(29);
        setAllGames(gamesFromPosition20);
        setGameTable(gamesFromPosition20);
        setLoad(false);
        setCurrentPage(1);
      } else {
        setAllGames(res.data.games);
        setGameTable(res.data.games);
        setLoad(false);
        setCurrentPage(1);
      }
    });
  }, [ProductType, GameType]);

  // Load danh sách game yêu thích từ API
  const loadFavoriteGames = async () => {
    try {
      const response = await getListFavorites();
      if (response.success && response.data) {
        const favoriteIds = new Set<string>(response.data.map((game: any) => String(game.id)));
        setFavoriteGames(favoriteIds);
      }
    } catch (error) {
      console.error('Error loading favorite games:', error);
    }
  };

  useEffect(() => {
    loadFavoriteGames();
  }, []);

  // Filter games theo searchTerm
  const filteredGames = useMemo(() => {
    if (!searchTerm.trim()) {
      return allGames;
    }
    
    return allGames.filter((game) => {
      const gameName = game.gameName|| game.tcgGameCode || game.productCode || "";
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
      // Cuộn lên đầu trang
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1000);
  };

  const handleImageError = (index: number) => {
    setGameTable((prev) => prev.filter((_, i) => i !== index));
  };

  // Xử lý thêm/bỏ yêu thích với API
  const handleToggleFavorite = async (gameData: any) => {
    const gameId = gameData.tcgGameCode || gameData.productCode || gameData.id;
    const gameName = gameData.gameName || gameData.name || gameData.tcgGameCode;
    const isFavorite = favoriteGames.has(gameId);
    const category = gameData.gameType;
    
    setFavoriteLoading(gameId);
    
    try {
      if (isFavorite) {
        // Bỏ yêu thích
        const response = await removeFromFavorites(gameId, category);
        
        if (response.success) {
          setFavoriteGames(prev => {
            const newSet = new Set(prev);
            newSet.delete(gameId);
            return newSet;
          });
          
          // swal(
          //   "Đã bỏ yêu thích!",
          //   `Game "${gameName}" đã được bỏ khỏi danh sách yêu thích.`,
          //   "success"
          // );
        } else {
          swal(
            "Lỗi!",
            "Không thể bỏ yêu thích game này. Vui lòng thử lại.",
            "error"
          );
        }
      } else {
        // Thêm yêu thích
        const response = await addToFavorites(gameId, category);
        
        if (response.success) {
          setFavoriteGames(prev => {
            const newSet = new Set(prev);
            newSet.add(gameId);
            return newSet;
          });
          
          // swal(
          //   "Đã thêm yêu thích!",
          //   `Game "${gameName}" đã được thêm vào danh sách yêu thích.`,
          //   "success"
          // );
        } else {
          swal(
            "Lỗi!",
            "Không thể thêm game này vào yêu thích. Vui lòng thử lại.",
            "error"
          );
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      swal(
        "Lỗi!",
        "Có lỗi xảy ra. Vui lòng thử lại.",
        "error"
      );
    } finally {
      setFavoriteLoading('');
    }
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
                {gameTable.length > 0 
                  ? `Tìm thấy ${gameTable.length} trò chơi cho "${searchTerm}"`
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
                {displayedGames.map((item: any, index) => {
                  const gameId = item.tcgGameCode || item.productCode || item.id;
                  const isFavorite = favoriteGames.has(gameId);
                  const isProcessing = favoriteLoading === gameId;
                  
                  return (
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

                        {/* Nút yêu thích */}
                        <Tooltip title={isFavorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"}>
                          <IconButton
                            sx={isFavorite ? favoriteFilledStyles : favoriteEmptyStyles}
                            onClick={() => handleToggleFavorite(item)}
                            disabled={isProcessing}
                          >
                            {isProcessing ? (
                              <Box 
                                sx={{ 
                                  width: 16, 
                                  height: 16, 
                                  border: '2px solid #fff',
                                  borderTop: '2px solid transparent',
                                  borderRadius: '50%',
                                  animation: 'spin 1s linear infinite',
                                  '@keyframes spin': {
                                    '0%': { transform: 'rotate(0deg)' },
                                    '100%': { transform: 'rotate(360deg)' },
                                  },
                                }}
                              />
                            ) : (
                              isFavorite ? <Favorite /> : <FavoriteBorder />
                            )}
                          </IconButton>
                        </Tooltip>

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
                  );
                })}
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
"use client";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import "./Home.css";
import Image from "next/image";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import Marquee from "react-fast-marquee";
import {
  AgentIcon,
  DownloadAppIcon,
  EmailIcon,
  SupportIcon,
  BackHome,
} from "@/shared/Svgs/Svg.component";
import Modal from "@/components/Modal";
import Link from "next/link";
import { IBannerImg, INotification, IUser } from "@/shared/interfaces";
import { useRouter } from "next/navigation";
import LoadingComponent from "@/components/Loading";
import swal from "sweetalert";
import { Avatar, Box, Button, useMediaQuery, useTheme } from "@mui/material";
import { properties, slideMBImg } from "@/datafake/slide";
import { slideImg } from "@/datafake/slide";
import HotPage from "./Hot/Hot.page";
import BannerListgamePage from "./BannerListgame/BannerListgame.page";
import ListCasioPage from "./ListCasio/ListCasio.page";
import Carousel from "react-multi-carousel";
import NumberCount from "@/components/NumberCount/NumberCount";
import usePlayGame from "@/hook/usePlayGameInPage";

const responsiveSettings = [
  {
    breakpoint: 500,
    settings: {
      slidesToShow: 1,
      slidesToScroll: 1,
    },
  },
  {
    breakpoint: 500,
    settings: {
      slidesToShow: 1,
      slidesToScroll: 1,
    },
  },
];

interface DraggableCloseButtonProps {
  onClose: () => void;
  isMobile: boolean;
}

// Draggable Close Button Component
const DraggableCloseButton: React.FC<DraggableCloseButtonProps> = ({ onClose, isMobile }) => {
  const [position, setPosition] = useState({ 
    x: isMobile ? window.innerWidth - 70 : window.innerWidth - 70, 
    y: isMobile ? window.innerHeight - 100 : 110 
  });
  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const buttonRef = useRef(null);

  const handleMouseDown = (e:any) => {
    setIsDragging(true);
    setHasMoved(false);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    e.preventDefault();
  };

  const handleTouchStart = (e:any) => {
    setIsDragging(true);
    setHasMoved(false);
    const touch = e.touches[0];
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    });
    e.preventDefault();
  };

  const handleMouseMove = useCallback((e:any) => {
    if (!isDragging) return;
    
    setHasMoved(true);
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    // Keep button within screen bounds
    const maxX = window.innerWidth - 60;
    const maxY = window.innerHeight - 60;
    
    setPosition({
      x: Math.max(10, Math.min(maxX, newX)),
      y: Math.max(10, Math.min(maxY, newY)),
    });
  }, [isDragging, dragStart]);

  const handleTouchMove = useCallback((e:any) => {
    if (!isDragging) return;
    
    setHasMoved(true);
    const touch = e.touches[0];
    const newX = touch.clientX - dragStart.x;
    const newY = touch.clientY - dragStart.y;
    
    // Keep button within screen bounds
    const maxX = window.innerWidth - 60;
    const maxY = window.innerHeight - 60;
    
    setPosition({
      x: Math.max(10, Math.min(maxX, newX)),
      y: Math.max(10, Math.min(maxY, newY)),
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleClick = (e:any) => {
    // Chỉ close khi không có drag movement
    if (!hasMoved) {
      onClose();
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, handleMouseMove, handleTouchMove]);

  return (
    <Button
      ref={buttonRef}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      sx={{
        position: "fixed",
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 1000,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        color: "white",
        minWidth: "50px",
        height: "50px",
        borderRadius: "50%",
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        touchAction: 'none',
        transition: isDragging ? 'none' : 'all 0.2s ease',
        "&:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          transform: isDragging ? 'none' : 'scale(1.1)',
        },
        "&:active": {
          transform: 'scale(0.95)',
        },
        fontSize: "18px",
        fontWeight: "bold",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
        border: "2px solid rgba(255, 255, 255, 0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <BackHome />
    </Button>
  );
};

export default function HomePage() {
  const [isFixed, setIsFixed] = useState(false);
  const [gameUrl, setGameUrl] = useState("");
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [gameLoading, setGameLoading] = useState(false);
  const route = useRouter();
  const { loading, playGame } = usePlayGame();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const isNearBottom = scrollPosition > documentHeight - windowHeight - 800;
      setIsFixed(scrollPosition > 300 && !isNearBottom);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isGameOpen) {
      document.body.classList.add("game-open");
    } else {
      document.body.classList.remove("game-open");
    }
    return () => {
      document.body.classList.remove("game-open");
    };
  }, [isGameOpen]);

  const handlePlayGame = async (codeGame:any, gameId:any) => {
    setGameLoading(true);
    try {
      const url = await playGame(codeGame, gameId);
      if (url) {
        setGameUrl(url);
        setIsGameOpen(true);
      }
    } catch (error) {
      console.error("Error playing game:", error);
    } finally {
      setGameLoading(false);
    }
  };

  const handleCloseGame = () => {
    setIsGameOpen(false);
    setGameUrl("");
  };

  // Nếu game đang mở, hiển thị game fullscreen
  if (isGameOpen) {
    return (
      <>
        <style jsx global>{`
          .game-open .floating-refund,
          .game-open .menu-mobile,
          .game-open footer,
          .game-open .footer-mobile {
            display: none;
          }
        `}</style>
        <Box
          sx={{
            width: "100%",
            height: "100vh",
            position: "relative",
            overflow: "hidden",
            paddingTop: isMobile ? "60px" : "80px",
          }}
        >
          {/* Draggable Close Button */}
          <DraggableCloseButton onClose={handleCloseGame} isMobile={isMobile} />

          {/* Iframe game */}
          <Box sx={{ height: 'calc(100vh - 80px)', width: '100%'}}>
            {gameUrl && (
              <iframe
                src={gameUrl}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
                title="Casino Game"
                allow="camera; microphone; fullscreen; payment"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
              />
            )}
          </Box>
        </Box>
      </>
    );
  }

  // Hiển thị homepage bình thường
  return (
    <div className="home">
      <div className="slide-show">
        <Carousel
          additionalTransfrom={0}
          arrows
          autoPlaySpeed={3000}
          centerMode={false}
          className=""
          containerClass="container"
          dotListClass=""
          draggable
          focusOnSelect={false}
          infinite
          itemClass=""
          keyBoardControl
          minimumTouchDrag={80}
          autoPlay
          pauseOnHover
          customLeftArrow={
            <Image src={"/image/icon-pre.png"} width={30} height={30} alt="" />
          }
          customRightArrow={
            <Image src={"/image/icon-next.png"} width={30} height={30} alt="" />
          }
          renderArrowsWhenDisabled={false}
          renderButtonGroupOutside={false}
          renderDotsOutside={false}
          responsive={{
            desktop: {
              breakpoint: {
                max: 3000,
                min: 1024,
              },
              items: 1,
            },
            mobile: {
              breakpoint: {
                max: 464,
                min: 0,
              },
              items: 1,
            },
            tablet: {
              breakpoint: {
                max: 1024,
                min: 464,
              },
              items: 1,
            },
          }}
          rewind={false}
          rewindWithAnimation={false}
          rtl={false}
          shouldResetAutoplay
          sliderClass=""
          slidesToSlide={1}
          swipeable
        >
          {slideImg.map((item) => {
            return (
              <div key={item.id} className="slide">
                <Image
                  className="img-slide"
                  src={item.img}
                  width={1000}
                  height={200}
                  loading="lazy"
                  alt=""
                />
                {item.number && (
                  <NumberCount
                    classname="slide-count"
                    numStart={1000}
                    numEnd={item?.number}
                  />
                )}
              </div>
            );
          })}
        </Carousel>
      </div>
      <div className="slide-showmb">
        <Carousel
          additionalTransfrom={0}
          arrows
          autoPlaySpeed={3000}
          centerMode={false}
          className=""
          containerClass="container"
          dotListClass=""
          draggable
          focusOnSelect={false}
          infinite
          itemClass=""
          keyBoardControl
          minimumTouchDrag={80}
          autoPlay
          pauseOnHover
          customLeftArrow={
            <Image src={"/image/icon-pre.png"} width={30} height={30} alt="" />
          }
          customRightArrow={
            <Image src={"/image/icon-next.png"} width={30} height={30} alt="" />
          }
          renderArrowsWhenDisabled={false}
          renderButtonGroupOutside={false}
          renderDotsOutside={false}
          responsive={{
            desktop: {
              breakpoint: {
                max: 3000,
                min: 1024,
              },
              items: 1,
            },
            mobile: {
              breakpoint: {
                max: 464,
                min: 0,
              },
              items: 1,
            },
            tablet: {
              breakpoint: {
                max: 1024,
                min: 464,
              },
              items: 1,
            },
          }}
          rewind={false}
          rewindWithAnimation={false}
          rtl={false}
          shouldResetAutoplay
          sliderClass=""
          slidesToSlide={1}
          swipeable
        >
          {slideMBImg.map((item) => {
            return (
              <div key={item.id} className="slide">
                <Image
                  className="img-slide"
                  src={item.img}
                  width={1000}
                  height={200}
                  loading="lazy"
                  alt=""
                />
                {item.number && (
                  <NumberCount
                    classname="slide-count"
                    numStart={1000}
                    numEnd={item?.number}
                  />
                )}
              </div>
            );
          })}
        </Carousel>
      </div>
      <HotPage />
      <BannerListgamePage 
        onPlayGame={handlePlayGame}
        gameLoading={gameLoading}
      />
      <ListCasioPage />
    </div>
  );
}
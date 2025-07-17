"use client";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
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

  const handlePlayGame = async (codeGame :any, gameId :any) => {
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
          {/* Close button */}
          <Box
            sx={{
              position: "absolute",
              top: isMobile ? "70px" : "90px",
              right: "20px",
              zIndex: 10,
            }}
          >
            <Button
              onClick={handleCloseGame}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                color: "white",
                minWidth: "40px",
                height: "40px",
                borderRadius: "50%",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                },
              }}
            >
              ✕
            </Button>
          </Box>

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
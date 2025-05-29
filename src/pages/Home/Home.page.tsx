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
import { Avatar } from "@mui/material";
import { properties, slideMBImg } from "@/datafake/slide";
import { slideImg } from "@/datafake/slide";
import HotPage from "./Hot/Hot.page";
import BannerListgamePage from "./BannerListgame/BannerListgame.page";
import ListCasioPage from "./ListCasio/ListCasio.page";
import Carousel from "react-multi-carousel";
import NumberCount from "@/components/NumberCount/NumberCount";

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
  const route = useRouter();

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
      <BannerListgamePage />
      <ListCasioPage />
    </div>
  );
}

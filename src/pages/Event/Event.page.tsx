"use client";
import React, { useEffect, useState } from "react";
import "./Event.css";
import Image from "next/image";
import { getPlayGameById } from "@/services/GameApi.service";
import LoadingComponent from "@/components/Loading";
import NavigationGameComponent from "@/hook/NavigationGame";
import swal from "sweetalert";
import Carousel from "react-multi-carousel";
import { slideImg, slideImgPromotion } from "@/datafake/slide";
import { IpromotionResponse } from "@/interface/promotion.interface";
import { getAllPromotion } from "@/services/Promotion.service";
export default function EventPage() {
  const [loading, setLoading] = useState(false);
  const [promotion, setPromotion] = useState<IpromotionResponse[]>([]);
  useEffect(() => {
    setLoading(true);
    getAllPromotion().then((res: any) => {
      setPromotion(res.data);
      setLoading(false);
    });
  }, []);
  return (
    <>
      {loading ? (
        <LoadingComponent />
      ) : (
        <div className="event">
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
              pauseOnHover
              customLeftArrow={
                <Image
                  src={"/image/icon-pre.png"}
                  width={30}
                  height={30}
                  alt=""
                />
              }
              customRightArrow={
                <Image
                  src={"/image/icon-next.png"}
                  width={30}
                  height={30}
                  alt=""
                />
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
                  </div>
                );
              })}
            </Carousel>
          </div>

          <div className="promotion-list">
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
              pauseOnHover
              customLeftArrow={
                <Image
                  src={"/image/icon-pre.png"}
                  width={30}
                  height={30}
                  alt=""
                />
              }
              customRightArrow={
                <Image
                  src={"/image/icon-next.png"}
                  width={30}
                  height={30}
                  alt=""
                />
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
                  <div key={item.id} className="promotion-item">
                    <Image
                      className="img-promotion-item"
                      src={item.img}
                      width={1000}
                      height={300}
                      loading="lazy"
                      alt=""
                    />
                    <span>{item.id === 1 ? "Ongoing" : "Ending"}</span>
                    <h2>Event Hot When Sign up</h2>
                    <button>Join Now</button>
                  </div>
                );
              })}
            </Carousel>
          </div>
        </div>
      )}
    </>
  );
}

import React from "react";
import "./loading.css";
import Image from "next/image";

export default function LoadingComponent() {
  return (
    <div className="container-loading">
      <div className="item">
        <div className="banner-loading">
          <Image
            src={"/images/logo.png"}
            width="150"
            height={100}
            alt=""
          />
        </div>
        {/* <Image
          src={"/images/openart-1bd95ea5-a202-4491-b723-436d1d59311f.png"}
          width={180}
          height={80}
          alt=""
        /> */}
        <div className="loader"></div>
      </div>
    </div>
  );
}

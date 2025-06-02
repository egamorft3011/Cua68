import React, { useEffect, useState } from "react";
export interface NumberCountProps {
  numStart: number;
  numEnd: number;
  classname: string;
}

export default function NumberCount(props: NumberCountProps) {
  const [value, setValue] = useState(props?.numStart ?? 10000);
  const targetValue = props.numEnd;

  useEffect(() => {
    const duration = 200000; // Thời gian chạy animation (ms)
    const intervalTime = 80; // Khoảng thời gian cập nhật (ms)
    const increment = Math.ceil(targetValue / (duration / intervalTime));

    let currentValue = 0;
    const interval = setInterval(() => {
      currentValue += increment;
      if (currentValue >= targetValue) {
        currentValue = 0; // Đặt lại giá trị để lặp lại
      }
      setValue(currentValue);
    }, intervalTime);

    return () => clearInterval(interval); // Dọn dẹp khi component unmount
  }, [targetValue]);
  return (
    <>
      <p className={props.classname}> {value.toLocaleString("vi-VN")} </p>
    </>
  );
}

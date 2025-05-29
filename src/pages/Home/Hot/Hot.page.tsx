import React, { useEffect, useState } from "react";
import "./Hot.css";
import Image from "next/image";
import { ThemeProvider } from "styled-components";
import { Box, Button } from "@mui/material";
import { getPlayGameById } from "@/services/GameApi.service";
import LoadingComponent from "@/components/Loading";
import NavigationGameComponent from "@/hook/NavigationGame";
import NumberCount from "@/components/NumberCount/NumberCount";
import swal from "sweetalert";
import usePlayGame from "@/hook/usePlayGame";
import SimpleBackdrop from "@/components/Loading/LoaddingPage";
import Link from "next/link";
import { GameLotto, ListGameHome } from "@/datafake/ListGame";
export default function HotPage() {
  const { loading, playGame } = usePlayGame();
  return (
    <>
      {loading ? (
        <></>
      ) : (
        <div className="hot-game">
          <div className="list-item">
            {ListGameHome.map((item) => {
              return (
                <div className={"card it-" + item.id} key={item.id}>
                  <Link href={item.link}>
                    {item.numberC > 0 && (
                      <NumberCount
                        classname="number-card"
                        numStart={1000}
                        numEnd={item?.numberC}
                      />
                    )}
                    <Image
                      src={"/images/" + item.images}
                      className="img"
                      width={180}
                      height={260}
                      alt=""
                    />
                    <p className="title-card">{item.nameGame}</p>
                  </Link>
                </div>
              );
            })}
          </div>
          <div className="list-item">
            {GameLotto.map((item) => (
              <div 
                className={"card it-" + item.id} 
                key={item.id}
                onClick={() =>
                  playGame(item.codeGame, item.gameId)
                }
                style={{ cursor: "pointer" }}
                >
                <Image
                  src={item.images}
                  className="img"
                  width={180}
                  height={260}
                  alt=""
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

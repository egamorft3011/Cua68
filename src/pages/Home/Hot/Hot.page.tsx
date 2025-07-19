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

interface HotPageProps {
  onPlayGame?: (codeGame: any, gameId: any) => void;
  gameLoading?: boolean;
}

export default function HotPage({ onPlayGame, gameLoading = false }: HotPageProps) {
  const { loading, playGame } = usePlayGame();

  // Handle lotto game click
  const handleLottoClick = async (codeGame: any, gameId: any) => {
    if (onPlayGame) {
      // Use the parent's onPlayGame function for iframe loading
      onPlayGame(codeGame, gameId);
    } else {
      // Fallback to direct playGame if no parent handler
      await playGame(codeGame, gameId);
    }
  };

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
                onClick={() => handleLottoClick(item.codeGame, item.gameId)}
                style={{ 
                  cursor: "pointer",
                  opacity: gameLoading ? 0.7 : 1,
                  pointerEvents: gameLoading ? 'none' : 'auto'
                }}
              >
                {gameLoading && (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10
                  }}>
                    <LoadingComponent />
                  </div>
                )}
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
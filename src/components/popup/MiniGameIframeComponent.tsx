import React, { useEffect, useState, useRef } from "react";
import { Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Draggable from "react-draggable";
import type { MouseEventHandler, TouchEventHandler } from "react";

type CustomizedDialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function MiniGameIframeComponent({
  open,
  onClose,
}: CustomizedDialogProps) {
  const [iframeKey, setIframeKey] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        timeoutRef.current = setTimeout(() => {
          timeoutRef.current = null;
        }, 3000);
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        } else {
          setIframeKey((prev) => prev + 1);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!open) return null;

  const txLink = typeof window !== "undefined"
      ? window.localStorage.getItem("txInfo")
      : null;

  const handleClose: MouseEventHandler<HTMLButtonElement> &
    TouchEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 10000,
        background: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <Draggable handle=".drag-handle" allowAnyClick={true}>
        <Box
          sx={{
            width: { xs: "100vw", sm: "80vw", md: "800px" },
            height: { xs: "70vh", sm: "70vh", md: "620px" },
            maxWidth: "100%",
            maxHeight: "100%",
            position: "relative",
            borderRadius: "10px",
            overflow: "hidden",
            background: "none",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drag Handle */}
          <Box
            className="drag-handle"
            sx={{
              width: "100%",
              height: { xs: "40px", md: "30px" },
              background: "#333",
              cursor: "grab",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              zIndex: 1000,
            }}
          >
            <IconButton
              size="large"
              sx={{
                color: "#fff",
                padding: { xs: "0", md: "0" },
                marginRight: "0",
              }}
              onClick={handleClose}
              onTouchStart={handleClose}
            >
              <CloseIcon fontSize="large" />
            </IconButton>
          </Box>
          {/* Iframe Content */}
          <Box
            sx={{
              width: "100%",
              height: { xs: "calc(40vh - 40px)", md: "590px" },
              overflow: "hidden",
            }}
          >
            <iframe
              key={iframeKey} // Sử dụng key để buộc tải lại
              src={`https://client.68bet.win/${txLink}`}
              width="100%"
              height="100%"
              style={{ border: "none", backgroundColor: "transparent" }}
              title="Mini Game"
              allow="autoplay; encrypted-media"
            ></iframe>
          </Box>
        </Box>
      </Draggable>
    </Box>
  );
}
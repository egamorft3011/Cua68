import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button, Box, Typography } from "@mui/material";
import { BackHome } from "@/shared/Svgs/Svg.component";

interface DraggableCloseButtonProps {
  onClose: () => void;
  isMobile: boolean;
}

const DraggableCloseButton: React.FC<DraggableCloseButtonProps> = ({ 
  onClose, 
  isMobile 
}) => {
  // State cho mobile draggable button
  const [position, setPosition] = useState({ 
    x: window.innerWidth - 70, 
    y: window.innerHeight / 2  
  });
  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseDown = (e: any) => {
    setIsDragging(true);
    setHasMoved(false);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    e.preventDefault();
  };

  const handleTouchStart = (e: any) => {
    setIsDragging(true);
    setHasMoved(false);
    const touch = e.touches[0];
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    });
    e.preventDefault();
  };

  const handleMouseMove = useCallback((e: any) => {
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

  const handleTouchMove = useCallback((e: any) => {
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

  const handleClick = (e: any) => {
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

  // Trả về mobile draggable button
  if (isMobile) {
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
          color: "white",
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          touchAction: 'none',
          transition: isDragging ? 'none' : 'all 0.2s ease',
          "&:active": {
            transform: 'scale(0.95)',
          },
          fontSize: "18px",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img 
          src="/assets/backhome.svg"
          alt="Back Home"
          style={{
            width: "60px",
            height: "60px",
            pointerEvents: "none"
          }}
        />
      </Button>
    );
  }

  // Trả về desktop header submenu
  return (
    <Box
      sx={{
        top: 0,
        left: 0,
        right: 0,
        height: "50px",
        backgroundColor: "#290f0f",
        backdropFilter: "blur(10px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        paddingX: 2,
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <Button
        onClick={onClose}
        sx={{
          color: "white",
          display: "flex",
          alignItems: "center",
          gap: 1,
          padding: "6px 12px",
          borderRadius: "6px",
          textTransform: "none",
          fontSize: "14px",
          fontWeight: 500,
          lineHeight: 1,
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          },
        }}
      >
        <Box
          component="img"
          src="/assets/backhome.svg"
          alt="Back Home"
          sx={{
            width: "20px",
            height: "20px",
          }}
        />
        <Typography
          variant="body2"
          sx={{
            color: "white",
            lineHeight: 1, // 👈 Đảm bảo text không bị lệch
            display: "flex",
            alignItems: "center",
          }}
        >
          Về trang chủ
        </Typography>
      </Button>
    </Box>
  );
};

export default DraggableCloseButton;
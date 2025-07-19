import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@mui/material";
import { BackHome } from "@/shared/Svgs/Svg.component";

interface DraggableCloseButtonProps {
  onClose: () => void;
  isMobile: boolean;
}

const DraggableCloseButton: React.FC<DraggableCloseButtonProps> = ({ 
  onClose, 
  isMobile 
}) => {
  const [position, setPosition] = useState({ 
    x: isMobile ? window.innerWidth - 70 : window.innerWidth - 70, 
    y: isMobile ? window.innerHeight / 2 : 110  
  });
  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const buttonRef = useRef(null);

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
        minWidth: "80px",
        height: "80px",
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
          width: "80px",
          height: "80px",
          pointerEvents: "none"
        }}
      />
    </Button>
  );
};

export default DraggableCloseButton;
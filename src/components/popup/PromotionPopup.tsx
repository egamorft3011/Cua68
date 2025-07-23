import React, { useState, useRef } from 'react';
import {
  Modal,
  Box,
  Tabs,
  Tab,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
  Button,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/navigation';

// Define promotion interface (matching PromotionsPage)
interface Promotion {
  id: number;
  title: string;
  thumbnail: string;
  isRegister: boolean;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PromotionPopupProps {
  promotions: Promotion[];
  onClose: () => void;
}

const PromotionPopup: React.FC<PromotionPopupProps> = ({ promotions, onClose }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Mobile swipe functionality
  const sliderRef = useRef<HTMLDivElement>(null);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleImageClick = () => {
    router.push(`/promotion/detail/?promotionID=${promotions[selectedTab].id}`);
    onClose();
  };

  const handleClose = () => {
    // Save preference if user checked "Don't show again"
    if (dontShowAgain) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('hidePromotionPopup', 'true');
      }
    }
    onClose();
  };

  const handleDontShowAgainChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDontShowAgain(event.target.checked);
  };

  // Mobile swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0 && selectedTab < promotions.length - 1) {
        setSelectedTab(selectedTab + 1);
      } else if (diff < 0 && selectedTab > 0) {
        setSelectedTab(selectedTab - 1);
      }
    }
    
    setIsDragging(false);
  };

  // Mobile Layout
  if (isMobile) {
    return (
      <Modal
        open={true}
        onClose={handleClose}
        aria-labelledby="promotion-popup-title"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          p: 2,
          '& .MuiModal-backdrop': {
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(3px)',
            zIndex: 99998,
          },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: 420,
            height: '85vh',
            maxHeight: 600,
            bgcolor: '#fff',
            borderRadius: 3,
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 99999,
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={handleClose}
            sx={{ 
              position: 'absolute', 
              top: 12, 
              right: 12, 
              color: '#fff',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              width: 32,
              height: 32,
              zIndex: 100,
              backdropFilter: 'blur(5px)',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                transform: 'scale(1.1)',
                transition: 'all 0.2s ease',
              }
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>

          {/* Image Slider Area */}
          <Box
            sx={{
              flex: 1,
              position: 'relative',
              overflow: 'hidden',
              backgroundColor: '#f8f9fa',
            }}
          >
            {promotions.length > 0 && (
              <Box
                ref={sliderRef}
                component="div"
                onClick={handleImageClick}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                sx={{
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${promotions[selectedTab].thumbnail})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'transform 0.3s ease',
                  '&:active': {
                    transform: 'scale(0.98)',
                  },
                }}
              />
            )}
            
            {/* Slide Indicators */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 16,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                borderRadius: '20px',
                padding: '8px 12px',
                backdropFilter: 'blur(10px)',
              }}
            >
              {promotions.map((_, index) => (
                <Box
                  key={index}
                  onClick={() => setSelectedTab(index)}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: selectedTab === index ? '#fff' : 'rgba(255, 255, 255, 0.5)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#fff',
                      transform: 'scale(1.2)',
                    }
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Don't Show Again Option */}
          <Box
            sx={{
              backgroundColor: '#fff',
              borderTop: '1px solid #e0e0e0',
              p: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={dontShowAgain}
                  onChange={handleDontShowAgainChange}
                  sx={{
                    color: '#666',
                    '&.Mui-checked': {
                      color: '#240202',
                    },
                  }}
                />
              }
              label={
                <Typography sx={{ fontSize: '0.85rem', color: '#666' }}>
                  Không hiện lại nữa
                </Typography>
              }
            />
            <Button
              variant="contained"
              onClick={handleClose}
              sx={{
                backgroundColor: '#240202',
                color: '#fff',
                textTransform: 'none',
                borderRadius: '20px',
                px: 3,
                py: 1,
                '&:hover': {
                  backgroundColor: '#400404',
                },
              }}
            >
              Đóng
            </Button>
          </Box>
        </Box>
      </Modal>
    );
  }

  // Desktop Layout
  return (
    <Modal
      open={true}
      onClose={handleClose}
      aria-labelledby="promotion-popup-title"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        '& .MuiModal-backdrop': {
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(3px)',
          zIndex: 99998,
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '80%',
          maxWidth: 800,
          height: '80%',
          maxHeight: 500,
          bgcolor: '#fff',
          borderRadius: 2,
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'row',
          overflow: 'hidden',
          zIndex: 99999,
          marginTop: '40px',
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={handleClose}
          sx={{ 
            position: 'absolute', 
            top: 8, 
            right: 8, 
            color: '#666', 
            zIndex: 100000,
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(10px)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              color: '#240202',
            }
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Left Side: Vertical Tabs */}
        <Box
          sx={{
            width: '40%',
            bgcolor: '#240202',
            overflowY: 'auto',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="h6" sx={{ color: '#ffffff', mb: 2, fontWeight: 'bold' }}>
            Khuyến Mãi
          </Typography>
          <Box sx={{ flex: 1 }}>
            <Tabs
              orientation="vertical"
              value={selectedTab}
              onChange={handleTabChange}
              sx={{
                borderColor: '#e0e0e0',
                '& .MuiTabs-indicator': {
                  backgroundColor: '#ff0000',
                },
                '& .MuiTab-root': {
                  color: '#ccc',
                  textAlign: 'left',
                  alignItems: 'flex-start',
                  padding: '10px 20px',
                  textTransform: 'none',
                  '&.Mui-selected': {
                    color: '#fff',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    fontWeight: 'bold',
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  },
                },
              }}
            >
              {promotions.map((promotion: any, index: any) => (
                <Tab key={promotion.id} label={promotion.title} />
              ))}
            </Tabs>
          </Box>

          <Box
            sx={{
              borderTop: '1px solid #444',
              pt: 2,
              mt: 2,
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={dontShowAgain}
                  onChange={handleDontShowAgainChange}
                  sx={{
                    color: '#ccc',
                    '&.Mui-checked': {
                      color: '#fff',
                    },
                  }}
                />
              }
              label={
                <Typography sx={{ fontSize: '0.9rem', color: '#ccc' }}>
                  Không hiện lại nữa
                </Typography>
              }
            />
          </Box>
        </Box>

        {/* Right Side: Full Background Image */}
        <Box
          sx={{
            width: '60%',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {promotions.length > 0 && (
            <Box
              component="div"
              onClick={handleImageClick}
              sx={{
                width: '100%',
                height: '100%',
                backgroundImage: `url(${promotions[selectedTab].thumbnail})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                cursor: 'pointer',
                position: 'relative',
                '&:hover': {
                  opacity: 0.9,
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent)',
                },
              }}
            />
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default PromotionPopup;
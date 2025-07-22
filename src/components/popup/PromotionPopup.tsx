import React, { useState } from 'react';
import {
  Modal,
  Box,
  Tabs,
  Tab,
  Typography,
  IconButton,
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
  const router = useRouter();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleImageClick = () => {
    router.push(`/promotion/detail/?promotionID=${promotions[selectedTab].id}`);
  };

  return (
    <Modal
      open={true}
      onClose={onClose}
      aria-labelledby="promotion-popup-title"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999, // Tăng z-index để đè lên header
        '& .MuiModal-backdrop': {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(5px)',
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
          bgcolor: 'transparent',
          borderRadius: 2,
          boxShadow: 24,
          display: 'flex',
          flexDirection: 'row',
          overflow: 'hidden',
          zIndex: 99999, // Đảm bảo popup luôn ở trên cùng
          marginTop: '40px',
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{ 
            position: 'absolute', 
            top: 8, 
            right: 8, 
            color: '#fff', 
            zIndex: 100000, // Z-index cao nhất cho nút đóng
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
            }
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Left Side: Vertical Tabs */}
        <Box
          sx={{
            width: '40%',
            bgcolor: 'rgba(0, 0, 0, 0.7)',
            borderRight: 1,
            borderColor: 'rgba(255, 255, 255, 0.2)',
            overflowY: 'auto',
            p: 2,
          }}
        >
          <Typography variant="h6" sx={{ color: '#fff', mb: 2, fontWeight: 'bold' }}>
            Khuyến Mãi
          </Typography>
          <Tabs
            orientation="vertical"
            value={selectedTab}
            onChange={handleTabChange}
            sx={{
              borderRight: 1,
              borderColor: 'rgba(255, 255, 255, 0.2)',
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
              },
            }}
          >
            {promotions.map((promotion, index) => (
              <Tab key={promotion.id} label={promotion.title} />
            ))}
          </Tabs>
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
            >
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default PromotionPopup;
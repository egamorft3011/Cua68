"use client";
import React, { useState, useEffect } from 'react';
import { Box, LinearProgress, Grid, AppBar, Toolbar, Typography, Button, Card, CardContent, Paper, IconButton, Container} from '@mui/material';
import { Info, CardGiftcard, AttachMoney, Casino, History } from '@mui/icons-material';
import Image from 'next/image';
import { formatCurrency } from '@/utils/formatMoney';
import { contentInstance } from '@/configs/CustomizeAxios';
import swal from 'sweetalert';
import { StarIcon, VipIcon } from '@/shared/Svgs/Svg.component';
import { useRouter } from 'next/navigation';
import Promotion from "./promotion";

interface VipData {
  current_vip: number;
  next_vip_level: number;
  total_deposit: number;
  next_vip_deposit_require: number;
  deposit_require: number;
  coin_monthly: number;
  next_vip: { coin_reward: number };
  percent_relief: number;
  claim_bonus: boolean;
}

const VipProgress: React.FC = () => {
  const [vipData, setVipData] = useState<VipData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [armorialImg, setArmorialImg] = useState<string>('https://i.stack.imgur.com/kOnzy.gif');
  const [points, setPoints] = useState<number>(0);
  const [level, setLevel] = useState<number>(0);
  const [nextLevelPoints] = useState<number>(30000);
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'Tất cả', icon: <CardGiftcard /> },
    { id: 'money', label: 'Tiền thưởng', icon: <AttachMoney /> },
    { id: 'slots', label: 'Slots miễn phí', icon: <Casino /> }
  ];
  // Fetch VIP data
  const getVipUser = async () => {
    setLoading(true);
    try {
      const response = await contentInstance.get('/api/vip');
      console.log(response)
      if (response.status) {
        const data = response.data;
        setVipData(data);
        // Set armorial image based on current_vip
        let img;
        switch (data.current_vip) {
          case 0:
            img = '/images/vip/vip0.png';
            break;
          case 1:
            img = '/images/vip/vip1.png';
            break;
          case 2:
            img = '/images/vip/vip2.png';
            break;
          case 3:
            img = '/images/vip/vip3.png';
            break;
          case 4:
            img = '/images/vip/vip4.png';
            break;
          case 5:
            img = '/images/vip/vip5.png';
            break;
          case 6:
            img = '/images/vip/vip6.png';
            break;
          default:
            img = 'https://i.stack.imgur.com/kOnzy.gif';
        }
        setArmorialImg(img);
      } else {
        swal('Lỗi', response?.data.msg, 'error');
      }
    } catch (error) {
      console.error('Error fetching VIP data:', error);
      swal('Lỗi', 'Lỗi kết nối. Vui lòng kiểm tra mạng và thử lại.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Claim reward and level up
  const getReward = async (currentVipLevel: number) => {
    setLoading(true);
    try {
      const response = await contentInstance.post(
        '/api/vip/reward',
        { vip_level: currentVipLevel },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
          },
        }
      );
      if (response.status) {
        swal('Thành công', `Nhận thưởng thành công! Bạn đã thăng cấp lên VIP ${currentVipLevel + 1}`, 'success');
        getVipUser(); // Refresh data
      } else {
        swal('Có lỗi xảy ra khi nhận thưởng', 'error');
      }
    } catch (error) {
      console.error('Error claiming reward:', error);
      swal('Lỗi', 'Lỗi kết nối. Vui lòng kiểm tra mạng và thử lại.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Claim monthly bonus
  const getMonthlyBonus = async (currentVipLevel: number) => {
    setLoading(true);
    try {
      const response = await contentInstance.post(
        '/api/vip/claim-monthly',
        { vip_level: currentVipLevel }
      );
      if (response.status) {
        const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
        swal('Thành công', `Bạn đã nhận thưởng tháng ${currentMonth} thành công!`, 'success');
        getVipUser(); // Refresh data
      } else {
        swal('Có lỗi xảy ra khi nhận thưởng', 'error');
      }
    } catch (error) {
      console.error('Error claiming monthly bonus:', error);
      swal('Lỗi', 'Lỗi kết nối. Vui lòng kiểm tra mạng và thử lại.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVipUser();
  }, []);

  const totalDeposit = vipData
    ? vipData.total_deposit >= vipData.next_vip_deposit_require
      ? vipData.next_vip_deposit_require
      : vipData.total_deposit
    : 0;
  const remaining = vipData ? Math.max(0, vipData.next_vip_deposit_require - vipData.total_deposit) : 0;
  const progressWidth = vipData ? (totalDeposit / vipData.next_vip_deposit_require) * 100 + '%' : '0%';
  const canClaimReward = vipData && totalDeposit >= vipData.next_vip_deposit_require;

  return (
    <Grid
      container
      sx={{
        backgroundColor: '#4f2323',
        width: '100%',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: { xs: 'column', sm: 'row' },
        padding: 0
      }}
    >
      {/* Main Content */}
      <Grid
        container
        sx={{
          width: "100%",
          spacing: 1,
        }}
      >
        {/* Title */}
        <Box
          sx={{
            width: '100%',
            marginBottom: 2,
            borderBottom: '1px solid rgba(56, 67, 117, .3)',
          }}
        >
          <Typography
            sx={{ 
              mb: 2, 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center' 
            }}
          >
            <Image
              src="/images/vip/vip-title.webp"
              alt="Vip User"
              width={324}
              height={98}
              style={{ objectFit: 'contain' }}
            />      
          </Typography>
          <Box 
            sx={{ 
              background: '#350f0f',
              borderRadius: '8px',
              minHeight: { xs: 'auto', sm: '200px' },
              padding: { xs: 1.5, sm: 3 },
              position: 'relative',
              overflow: 'visible',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: { xs: 'column', lg: 'row' },
              gap: { xs: 2, lg: 0 }
            }}
          >
            {/* Left Section - Level Info */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              flex: 1,
              width: { xs: '100%', lg: 'auto' }
            }}>
              {/* Level Info */}
              <Box sx={{ flex: 1, width: '100%' }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: { xs: 'flex-start', sm: 'center' }, 
                  mb: 1, 
                  width: { xs: '100%', lg: '90%' },
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: { xs: 1, sm: 0 }
                }}>
                  {/* Left side: Image and Text/Chip column */}
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: { xs: 'center', sm: 'center' },
                    flexDirection: { xs: 'row', sm: 'row' },
                    textAlign: { xs: 'center', sm: 'left' },
                    width: { xs: '100%', lg: '100%' },
                    gap: { xs: 1, sm: 0 }
                  }}>
                    {/* Image */}
                    <Typography variant="h5" sx={{ mr: { xs: 0, sm: 2 } }}>
                      <Image
                        src={armorialImg}
                        alt="Vip Badge"
                        width={111}
                        height={111}
                        style={{ 
                          maxWidth: '80px', 
                          maxHeight: '80px', 
                          objectFit: 'contain',
                        }}
                      />
                    </Typography>
                    {/* Text and Chip in a column */}
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: { xs: 'flex-start', sm: 'flex-start' },
                      width: { xs: '100%', lg: '100%' },
                      gap: 1
                    }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: { xs: 'auto', lg: '100%' },
                        }}
                      >
                        <Typography
                          variant="h5"
                          sx={{
                            color: '#fff',
                            fontWeight: 'bold',
                            fontSize: { xs: '1.2rem', sm: '1.5rem' },
                            textAlign: { xs: 'center', sm: 'left' },
                          }}
                        >
                          {`Vip ${vipData?.current_vip ?? 0}`}
                        </Typography>
                        <IconButton
                          sx={{
                            color: '#fff',
                            p: 0.5,
                          }}
                          onClick={() => router.push('/vip/privileges')}
                        >
                          <Info fontSize="small" />
                        </IconButton>
                      </Box>
                      <Typography
                        sx={{
                          background: 'linear-gradient(45deg, #ffd700, #ffb300)',
                          borderRadius: '20px',
                          p: 1,
                          color: '#000',
                          fontWeight: 'bold',
                          minWidth: 40,
                          fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                          display: 'flex', // thêm
                          alignItems: 'center', // căn giữa dọc
                          justifyContent: 'center', // căn giữa ngang
                          textAlign: 'center', // đề phòng text bị lệch
                        }}
                      >
                        {vipData?.total_deposit?.toLocaleString() ?? '0'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Progress Section */}
                <Box
                  sx={{
                    mt: { xs: 2, sm: 3 },
                    width: { xs: '100%', lg: '90%' },
                    background: '#4f2323',
                    borderRadius: '8px',
                    p: { xs: 2, sm: 3 },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography sx={{ 
                      color: '#ccc', 
                      fontSize: { xs: 12, sm: 14 }
                    }}>
                        {
                          Object.entries(vipData || {})
                            .find(([key]) => key === `__Vip_${vipData?.current_vip}__`)?.[1] 
                            ?? `Vip ${vipData?.current_vip ?? 0}`
                        }
                    </Typography>
                    <Typography sx={{ 
                      color: '#ccc', 
                      fontSize: { xs: 12, sm: 14 }
                    }}>
                      {
                        Object.entries(vipData?.next_vip || {})
                          .find(([key]) => key === `__Vip_${vipData?.next_vip_level}__`)?.[1] 
                          ?? `Vip ${vipData?.next_vip_level ?? ''}`
                      }
                    </Typography>
                  </Box>
                  
                  <LinearProgress
                    variant="determinate"
                    value={
                      vipData?.total_deposit != null && vipData?.next_vip_deposit_require != null
                      ? Math.min(
                          (vipData.total_deposit / vipData.next_vip_deposit_require) * 100,
                          100
                        )
                      : 0
                    }
                    sx={{
                      height: { xs: 6, sm: 8 },
                      borderRadius: 4,
                      background: 'rgba(255,255,255,0.2)',
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(90deg, #ffd700, #ffb300)',
                        borderRadius: 4
                      }
                    }}
                  />
                  
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    mt: 1,
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: { xs: 0.5, sm: 0 }
                  }}>
                    <Typography sx={{ 
                      color: '#fff', 
                      fontSize: { xs: 12, sm: 14 }
                    }}>
                      Để lên cấp cần cược tối thiểu:
                    </Typography>
                    <Typography sx={{ 
                      color: '#ffd700', 
                      fontSize: { xs: 12, sm: 14 }, 
                      fontWeight: 'bold',
                      textAlign: { xs: 'left', sm: 'right' }
                    }}>
                       {vipData?.total_deposit?.toLocaleString()} / {vipData?.next_vip_deposit_require?.toLocaleString()} đ
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Right Section - Enhanced Reward Box */}
            <Box sx={{ 
              position: 'relative', 
              perspective: '1000px',
              width: { xs: '100%', lg: 'auto' },
              display: 'flex',
              justifyContent: 'center'
            }}>
              <Card
                sx={{
                  background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 50%, #ffab5a 100%)',
                  borderRadius: 4,
                  minWidth: 250,
                  position: 'relative',
                  overflow: 'visible',
                  boxShadow: `
                    0 20px 40px rgba(255, 107, 53, 0.6),
                    0 0 0 3px rgba(255, 215, 0, 0.3),
                    inset 0 2px 4px rgba(255, 255, 255, 0.2)
                  `,
                  border: '2px solid #ffd700',
                  transform: 'perspective(1000px) rotateY(-5deg)',
                  animation: 'cardPulse 2s ease-in-out infinite',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(45deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%, rgba(255, 255, 255, 0.1) 100%)',
                    borderRadius: 4,
                    pointerEvents: 'none'
                  }
                }}
              >
                {/* 3D Gift Box */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -20,
                    left: -55,
                    width: 80,
                    height: 80,
                    background: 'linear-gradient(135deg, #ffb366, #ff9933)',
                    borderRadius: 2,
                    transform: 'perspective(500px) rotateX(15deg) rotateY(-15deg)',
                    boxShadow: '0 15px 30px rgba(255, 153, 51, 0.6)',
                    border: '3px solid #ffd700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'giftFloat 3s ease-in-out infinite',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: '50%',
                      left: '15%',
                      right: '15%',
                      height: '6px',
                      background: '#ffd700',
                      transform: 'translateY(-50%)',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      left: '50%',
                      top: '15%',
                      bottom: '15%',
                      width: '6px',
                      background: '#ffd700',
                      transform: 'translateX(-50%)',
                      boxShadow: '2px 0 4px rgba(0,0,0,0.3)'
                    }
                  }}
                >
                  <Typography sx={{ 
                    fontSize: 28, 
                    zIndex: 1,
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                  }}>🎁</Typography>
                </Box>

                <CardContent sx={{ pt: 4, pb: 3, px: 3 }}>
                  {/* Enhanced Title */}
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      color: '#fff',
                      fontWeight: 900,
                      textAlign: 'center',
                      textShadow: '3px 3px 6px rgba(0,0,0,0.5), 0 0 20px rgba(255,215,0,0.3)',
                      mb: 1,
                      letterSpacing: '2px',
                      background: 'linear-gradient(45deg, #fff, #ffd700)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontSize: { xs: '2rem', sm: '2.5rem' }
                    }}
                  >
                    THƯỞNG
                  </Typography>
                  
                  {/* Enhanced Level Badge */}
                  <Box sx={{ 
                    textAlign: 'center', 
                    mb: 2,
                    position: 'relative'
                  }}>
                    <Typography 
                      sx={{ 
                        color: '#fff',
                        fontSize: 20,
                        fontWeight: 600,
                        opacity: 0.95,
                        textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                        background: 'rgba(255,255,255,0.15)',
                        padding: '6px 16px',
                        borderRadius: 15,
                        border: '1px solid rgba(255,255,255,0.3)',
                        display: 'inline-block',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      {`Vip ${vipData?.next_vip_level ?? 0}`}
                    </Typography>
                  </Box>

                  {/* Enhanced Reward Amount */}
                  <Box
                    sx={{
                      background: 'linear-gradient(135deg, #2e7d32 0%, #901d1d 50%, #66bb6a 100%)',
                      borderRadius: 25,
                      padding: '12px 24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 2,
                      position: 'relative',
                      border: '3px solid #ffd700',
                      boxShadow: `
                        0 8px 16px rgba(76, 175, 80, 0.4),
                        inset 0 2px 4px rgba(255,255,255,0.2)
                      `,
                      transform: 'perspective(500px) rotateX(-5deg)',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)',
                        borderRadius: 25,
                        pointerEvents: 'none'
                      }
                    }}
                  >
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        color: '#fff',
                        fontWeight: 900,
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                        fontSize: '2.5rem'
                      }}
                    >
                      {vipData?.next_vip?.coin_reward?.toLocaleString() ?? '0'}
                    </Typography>
                    <Box
                      sx={{
                        background: 'linear-gradient(45deg, #ffd700, #ffb300)',
                        borderRadius: '50%',
                        width: 35,
                        height: 35,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 8px rgba(255, 179, 0, 0.4)',
                        border: '2px solid #fff'
                      }}
                    >
                      <Typography sx={{ 
                        fontSize: 14, 
                        fontWeight: 'bold', 
                        color: '#fff',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.3)' 
                      }}>đ</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Enhanced CSS Animations */}
              <style jsx>{`
                @keyframes float {
                  0%, 100% { 
                    transform: translateY(0px) rotate(0deg); 
                  }
                  50% { 
                    transform: translateY(-15px) rotate(5deg); 
                  }
                }
                
                @keyframes giftFloat {
                  0%, 100% { 
                    transform: perspective(500px) rotateX(15deg) rotateY(-15deg) translateY(0px); 
                  }
                  50% { 
                    transform: perspective(500px) rotateX(15deg) rotateY(-15deg) translateY(-8px); 
                  }
                }
                
                @keyframes cardPulse {
                  0%, 100% { 
                    transform: perspective(1000px) rotateY(-5deg) scale(1); 
                  }
                  50% { 
                    transform: perspective(1000px) rotateY(-5deg) scale(1.02); 
                  }
                }
              `}</style>
            </Box>
          </Box>
        </Box>

        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 600, color: "white", mb: 1 }}
          >
            Danh sách khuyến mãi
          </Typography>
          <Promotion />
        </Box>
        <Box sx={{ 
          background: '#350f0f',
          borderRadius: '8px',
          color: 'white',
          width: '100%',
          pb: { xs: 4, sm: 6 } 
        }}>
          {/* Header */}
          <AppBar position="static" elevation={0} sx={{ backgroundColor: 'transparent' }}>
            <Toolbar sx={{ justifyContent: 'space-between',  px: { xs: 1, sm: 2 }, minHeight: { xs: 48, sm: 64 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CardGiftcard sx={{ color: '#ffd700', fontSize: { xs: 20, sm: 24 } }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                  Đổi thưởng
                </Typography>
              </Box>
              <Button 
                sx={{ 
                  color: '#ffd700', 
                  textTransform: 'none',
                  fontSize: { xs: '12px', sm: '14px' }
                }}
                onClick={() => router.push('/profile/transaction-history/')}
              >
                Xem lịch sử
              </Button>
            </Toolbar>
          </AppBar>

          {/* Navigation Tabs */}
          <Container maxWidth="lg" sx={{ mt: 2 }}>
            <Box sx={{ 
              display: 'flex', 
              gap: 1,
              mb: { xs: 2, sm: 4 },
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'center', sm: 'flex-start' }
            }}>
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "contained" : "outlined"}
                  startIcon={tab.icon}
                  onClick={() => setActiveTab(tab.id)}
                  sx={{
                    borderRadius: '25px',
                    px: { xs: 2, sm: 3 },
                    py: { xs: 0.5, sm: 1 },
                    textTransform: 'none',
                    fontSize: { xs: '12px', sm: '14px' },
                    width: { xs: '100%', sm: 'auto' }, // Full width on mobile
                    maxWidth: { xs: 300, sm: 'none' }, // Limit width on mobile
                    backgroundColor: activeTab === tab.id ? '#901d1d' : 'transparent',
                    borderColor: activeTab === tab.id ? '#901d1d' : 'rgba(255,255,255,0.3)',
                    color: activeTab === tab.id ? 'white' : 'rgba(255,255,255,0.8)',
                    '&:hover': {
                      backgroundColor: activeTab === tab.id ? '#901d1d' : 'rgba(255,255,255,0.1)',
                      borderColor: activeTab === tab.id ? '#901d1d' : 'rgba(255,255,255,0.5)',
                    }
                  }}
                >
                  {tab.label}
                </Button>
              ))}
            </Box>

            {/* Main Content */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '50vh',
              textAlign: 'center',
              px: { xs: 2, sm: 0 }
            }}>
              {/* Gift Icon */}
              <Box sx={{ 
                position: 'relative',
                mb: 3
              }}>
                <CardGiftcard sx={{ 
                  fontSize: { xs: 80, sm: 120 },
                  color: 'rgba(255,255,255,0.3)',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                }} />
                {/* Crown decoration */}
                <Box sx={{
                  position: 'absolute',
                  top: -10,
                  right: 10,
                  width: 30,
                  height: 25,
                }} />
              </Box>

              {/* Message */}
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 'bold',
                  mb: 1,
                  opacity: 0.9,
                  fontSize: { xs: '1.2rem', sm: '1.5rem' }
                }}
              >
                Đổi thưởng sắp ra mắt
              </Typography>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  opacity: 0.7,
                  maxWidth: 400,
                  lineHeight: 1.6,
                  fontSize: { xs: '0.9rem', sm: '1rem' }
                }}
              >
                Chức năng đổi thưởng đang trong quá trình phát triển. 
                Hãy quay lại sau để trải nghiệm những phần thưởng hấp dẫn!
              </Typography>
            </Box>
          </Container>
        </Box>
      </Grid>
    </Grid>
  );
};

export default VipProgress;

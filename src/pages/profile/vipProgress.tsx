"use client";
import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Button, Card, CardContent } from '@mui/material';
import Image from 'next/image';
import { formatCurrency } from '@/utils/formatMoney';
import { contentInstance } from '@/configs/CustomizeAxios';
import swal from 'sweetalert';
import { StarIcon, VipIcon } from '@/shared/Svgs/Svg.component';

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
        backgroundColor: '#232B4F',
        width: '100%',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: { xs: 'column', sm: 'row' },
        padding: 2,
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
            variant="h6"
            sx={{ color: 'white', fontSize: '19px', fontWeight: 600, mb: 2 }}
          >
            Cấp độ VIP
          </Typography>
        </Box>

        {/* VIP Display */}
        <Box sx={{ marginBottom: 2, width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={9}>
              <Card
                sx={{
                  background: 'linear-gradient(135deg, rgb(120, 120, 120), rgb(120, 120, 120) 50%, rgb(135, 135, 135) 0px, rgb(120, 120, 120))',
                  boxShadow: 'rgba(0, 0, 0, 0.25) 0px 3px 3px 0px, rgb(100, 100, 100) 0px -10px 25px inset',
                  borderRadius: '5px',
                  p: 2,
                }}
              >
                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography sx={{ fontSize: '11px', mb: 1, color: 'white' }}>Cấp độ hiện tại</Typography>
                    <Typography
                      sx={{
                        fontSize: '24px',
                        fontWeight: 800,
                        textShadow: 'rgba(0, 0, 0, 0.3) 0px 2px 0px',
                        color: 'white',
                      }}
                    >
                      {vipData ? `VIP ${vipData.current_vip}` : 'VIP 0'}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '16px',
                        fontWeight: 400,
                        textTransform: 'uppercase',
                        textShadow: 'rgba(0, 0, 0, 0.3) 0px 2px 0px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <StarIcon/>
                      <StarIcon/>
                      <StarIcon/>
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography sx={{ fontSize: '14px', color: 'white' }}>
                        Thưởng tháng = {vipData ? formatCurrency(vipData.coin_monthly) : 'Không có'}
                      </Typography>
                      <Typography sx={{ fontSize: '14px', color: 'white' }}>
                        Nạp tiền {'>='} {vipData ? formatCurrency(vipData.deposit_require) : '0'}
                      </Typography>
                    </Box>
                  </Box>
                  <Image
                    src={armorialImg}
                    alt="Vip User"
                    width={110}
                    height={110}
                    style={{ objectFit: 'contain' }}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                href="/vip/privileges"
                sx={{
                  backgroundColor: 'white',
                  borderRadius: '10px',
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                  textTransform: 'none',
                  color: '#454545',
                  '&:hover': { backgroundColor: '#f0f0f0' },
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: '25%',
                    width: '100%',
                    textAlign: 'center',
                    fontSize: '14px',
                  }}
                >
                  Đặc quyền VIP
                </Box>
                <Image
                  src="/images/vip/privilege_bg.png"
                  alt=""
                  width={0}
                  height={0}
                  style={{ width: '50%', objectFit: 'cover' }}
                />
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* VIP Condition */}
        <Box sx={{ marginBottom: 2, width: '100%' }}>
          <Card sx={{ backgroundColor: 'white', borderRadius: '5px', overflow: 'hidden' }}>
            <CardContent
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'white',
                p: 2,
              }}
            >
              <Typography sx={{ fontSize: '16px', fontWeight: 600 }} id="next_vip_level">
                {vipData ? `Điều kiện thăng cấp lên VIP ${vipData.next_vip_level}` : 'Điều kiện thăng cấp'}
              </Typography>
              <Button
                disabled={!canClaimReward || loading}
                onClick={() => vipData && getReward(vipData.current_vip)}
                sx={{
                  border: canClaimReward ? '1px solid #18be39' : '1px solid #e94951',
                  color: canClaimReward ? '#18be39' : '#e94951',
                  borderRadius: '100px',
                  fontSize: '12px',
                  fontWeight: 300,
                  px: 1,
                  py: 0.5,
                  whiteSpace: 'nowrap',
                  textTransform: 'none',
                  cursor: canClaimReward ? 'pointer' : 'not-allowed',
                  opacity: loading ? 0.7 : 1,
                  '&:hover': {
                    backgroundColor: canClaimReward ? 'rgba(24, 190, 57, 0.1)' : 'transparent',
                  },
                  '&.Mui-disabled': {
                    color: 'red'
                  },
                }}
              >
                {canClaimReward ? (loading ? 'Đang xử lý...' : 'Nhận thưởng & Thăng cấp') : 'Chưa đủ điều kiện'}
              </Button>
            </CardContent>
            <Box
              sx={{
                p: 2,
                backgroundColor: 'white',
                borderTop: '1px solid #e9e9e9',
                cursor: 'pointer',
              }}
            >
              <Typography sx={{ color: '#929292', fontSize: '14px', mb: 1 }}>
                Nạp tiền thăng cấp
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography sx={{ fontSize: '14px' }}>
                  <span style={{ color: '#9ac143' }} id="total_deposit">
                    {formatCurrency(totalDeposit)}
                  </span>{' '}
                  /{' '}
                  <span style={{ color: '#ff1515' }} id="deposit_require">
                    {vipData ? formatCurrency(vipData.next_vip_deposit_require) : '0'}
                  </span>
                </Typography>
                <Typography sx={{ fontSize: '14px' }}>
                  Còn thiếu {formatCurrency(remaining)}
                </Typography>
              </Box>
              <Box
                sx={{
                  backgroundColor: '#e9e9e9',
                  borderRadius: '20px',
                  boxShadow: 'inset 0.1px 0.1px 0.1px 0.1px rgba(0,0,0,0.2)',
                  height: '5px',
                  overflow: 'hidden',
                  width: '100%',
                }}
              >
                <Box sx={{ backgroundColor: '#9ac143', height: '5px', width: progressWidth }}></Box>
              </Box>
            </Box>
          </Card>
        </Box>

        {/* VIP Privilege */}
        <Box sx={{ marginY: 4, width: '100%' }}>
          <Typography
            variant="h6"
            sx={{ color: 'white', fontSize: '19px', fontWeight: 600, mb: 2 }}
          >
            Đặc quyền riêng của bạn
          </Typography>
          <Grid container spacing={2}>
            {[
              {
                img: '/images/vip/privileg_upgrade.png',
                title: 'Quà thăng cấp',
                id: 'next_vip_bonus',
                label: vipData ? formatCurrency(vipData.next_vip.coin_reward) : 'Không có',
              },
              {
                img: '/images/vip/privileg_envelope.png',
                title: 'Bonus tháng',
                id: 'current_vip_bonus',
                label: vipData ? formatCurrency(vipData.coin_monthly) : 'Không có',
                extraButton: {
                  id: 'claim_monthly_bonus',
                  label: vipData && vipData.claim_bonus ? 'Nhận thưởng' : 'Đã nhận thưởng',
                  disabled: !vipData || !vipData.claim_bonus || loading,
                  onClick: () => vipData && getMonthlyBonus(vipData.current_vip),
                },
              },
              {
                img: '/images/vip/privileg_relief_fund.png',
                title: 'Bonus cứu trợ',
                id: 'current_vip_relief',
                label: vipData ? vipData.percent_relief.toString() : 'Không có',
              },
            ].map((item, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Card
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: '5px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 2,
                  }}
                >
                  <Image
                    src={item.img}
                    alt=""
                    width={64}
                    height={64}
                    style={{ objectFit: 'contain' }}
                  />
                  <Typography
                    sx={{
                      fontWeight: 400,
                      lineHeight: '22px',
                      my: 1,
                      maxWidth: '150px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      textAlign: 'center',
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Button
                    id={item.id}
                    sx={{
                      opacity: 0.6,
                      backgroundColor: '#403e0b',
                      color: 'white',
                      borderRadius: '3px',
                      fontSize: '12px',
                      width: '100%',
                      textTransform: 'none',
                      py: 0.5,
                      px: 2,
                      '&:hover': { backgroundColor: '#403e0b' },
                    }}
                  >
                    {item.label}
                  </Button>
                  {item.extraButton && (
                    <Button
                      id={item.extraButton.id}
                      disabled={item.extraButton.disabled}
                      onClick={item.extraButton.onClick}
                      sx={{
                        mt: 1,
                        border: '1px solid #18be39',
                        backgroundColor: '#18be39',
                        color: 'white',
                        borderRadius: '3px',
                        fontSize: '12px',
                        width: '100%',
                        textTransform: 'none',
                        py: 0.5,
                        px: 2,
                        '&:hover': { backgroundColor: '#18be39' },
                        '&.Mui-disabled': {
                          color: 'white',
                          backgroundColor: 'grey',
                          borderColor: 'grey !important'
                        },
                      }}
                    >
                      {loading && !item.extraButton.disabled ? 'Đang xử lý...' : item.extraButton.label}
                    </Button>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default VipProgress;

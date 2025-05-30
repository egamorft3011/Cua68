"use client";
import React from 'react';
import { Box, Grid, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { formatCurrency } from '@/utils/formatMoney';

// Static VIP data
const vipLevels = [
  {
    level: 1,
    monthlyReward: 38000,
    depositRequirement: 12000000,
    badge: '/images/vip-icon/vip1.png',
    gradient: 'linear-gradient(135deg, #787878, #787878 50%, #878787 0, #787878)',
    shadow: '0 3px 3px 0 rgba(0, 0, 0, 0.25), inset 0 -10px 25px #646464',
  },
  {
    level: 2,
    monthlyReward: 68000,
    depositRequirement: 60000000,
    badge: '/images/vip-icon/vip2.png',
    gradient: 'linear-gradient(135deg, #787878, #787878 50%, #878787 0, #787878)',
    shadow: '0 3px 3px 0 rgba(0, 0, 0, 0.25), inset 0 -10px 25px #646464',
  },
  {
    level: 3,
    monthlyReward: 88000,
    depositRequirement: 180000000,
    badge: '/images/vip-icon/vip3.png',
    gradient: 'linear-gradient(135deg, #787878, #787878 50%, #878787 0, #787878)',
    shadow: '0 3px 3px 0 rgba(0, 0, 0, 0.25), inset 0 -10px 25px #646464',
  },
  {
    level: 4,
    monthlyReward: 138000,
    depositRequirement: 500000000,
    badge: '/images/vip-icon/vip4.png',
    gradient: 'linear-gradient(135deg, #787878, #787878 50%, #878787 0, #787878)',
    shadow: '0 3px 3px 0 rgba(0, 0, 0, 0.25), inset 0 -10px 25px #646464',
  },
  {
    level: 5,
    monthlyReward: 188000,
    depositRequirement: 2000000000,
    badge: '/images/vip-icon/vip5.png',
    gradient: 'linear-gradient(135deg, #787878, #787878 50%, #878787 0, #787878)',
    shadow: '0 3px 3px 0 rgba(0, 0, 0, 0.25), inset 0 -10px 25px #646464',
  },
  {
    level: 6,
    monthlyReward: 588000,
    depositRequirement: 5000000000,
    badge: '/images/vip-icon/vip6.png',
    gradient: 'linear-gradient(135deg, #787878, #787878 50%, #878787 0, #787878)',
    shadow: '0 3px 3px 0 rgba(0, 0, 0, 0.25), inset 0 -10px 25px #646464',
  },
];

// Privileges table data
const privileges = [
  { level: 'VIP 1', upgradeReward: 68000, monthlyBonus: 38000, reliefBonus: '0.7%' },
  { level: 'Vip 2', upgradeReward: 238000, monthlyBonus: 68000, reliefBonus: '0.8%' },
  { level: 'VIP 3', upgradeReward: 388000, monthlyBonus: 88000, reliefBonus: '0.9%' },
  { level: 'VIP 4', upgradeReward: 1380000, monthlyBonus: 138000, reliefBonus: '1%' },
  { level: 'VIP 5', upgradeReward: 2888000, monthlyBonus: 188000, reliefBonus: '1.2%' },
  { level: 'VIP 6', upgradeReward: 5888000, monthlyBonus: 588000, reliefBonus: '1.5%' },
];

const VipPrivilegesPage: React.FC = () => {
  return (
    <Box
      id="body-web-vip"
      sx={{
        paddingBottom: '50px',
        backgroundColor: '#4f2323',
        minHeight: '100vh',
      }}
    >
      <Box
        className="main-wrap"
        sx={{
          maxWidth: { xs: 'unset', md: '62%' },
          margin: { xs: '50px auto 0', md: '0 auto' },
          fontSize: { xs: '10px', md: '16px' },
        }}
      >
        {/* Swiper Carousel */}
        <Box className="swiper-box" sx={{ position: 'relative', mt: 8 }}>
          <Swiper
            effect="cards"
            grabCursor
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            pagination={{ el: '.swiper-pagination', clickable: true }}
            modules={[EffectCards, Navigation, Pagination]}
            className="mySwiper5"
            style={{
              width: '400px',
              height: '220px',
            }}
            breakpoints={{
              0: { width: 350 },
              600: { width: 400 },
            }}
          >
            {vipLevels.map((vip, index) => (
              <SwiperSlide key={index}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '5px',
                    color: '#fff',
                    background: vip.gradient,
                    boxShadow: vip.shadow,
                    width: { xs: '350px', md: '400px' },
                    height: '186px',
                  }}
                >
                  <Box
                    className="box"
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '30px',
                    }}
                  >
                    <Box
                      className="info-vip"
                      sx={{
                        fontSize: '12px',
                        fontWeight: 300,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box className="top-box">
                        <Typography
                          className="level"
                          sx={{
                            padding: '3px',
                            fontSize: '24px',
                            fontWeight: 800,
                            textShadow: '0 2px 0 rgba(0, 0, 0, 0.3)',
                          }}
                        >
                          VIP {vip.level}
                        </Typography>
                        <Typography
                          sx={{
                            textTransform: 'uppercase',
                            fontSize: '16px',
                            fontWeight: 400,
                            padding: '3px',
                            textShadow: '0 2px 0 rgba(0, 0, 0, 0.3)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          VIP {vip.level}
                        </Typography>
                      </Box>
                      <Box className="bottom-box" sx={{ fontSize: '12px', fontWeight: 300 }}>
                        <Typography sx={{ padding: '3px' }}>
                          Thưởng tháng = {formatCurrency(vip.monthlyReward)}
                        </Typography>
                        <Typography sx={{ padding: '3px' }}>
                          Nạp tiền {'>='} {formatCurrency(vip.depositRequirement)}
                        </Typography>
                      </Box>
                    </Box>
                    <Box className="badge-img" sx={{ display: 'flex', alignItems: 'center' }}>
                      <Image
                        src={vip.badge}
                        alt={`VIP ${vip.level} badge`}
                        width={111}
                        height={111}
                        style={{ maxWidth: '111px', objectFit: 'contain' }}
                      />
                    </Box>
                  </Box>
                </Box>
              </SwiperSlide>
            ))}
            <Box
              className="swiper-pagination"
              sx={{
                '& .swiper-pagination-bullet': {
                  width: '8px !important',
                  height: '8px !important',
                  borderRadius: '50%',
                },
                '& .swiper-pagination-bullet-active': {
                  backgroundColor: '#007aff',
                },
              }}
            />
            <Box
              className="swiper-button-next"
              sx={{ right: '-130px', color: '#fff', display: { xs: 'none', md: 'block' } }}
            />
            <Box
              className="swiper-button-prev"
              sx={{ left: '-130px', color: '#fff', display: { xs: 'none', md: 'block' } }}
            />
          </Swiper>
        </Box>

        {/* VIP Box */}
        <Box
          className="vip-box"
          sx={{
            backgroundImage: 'linear-gradient(0deg, #ededed 100%, #f2f2f2 0)',
            padding: { xs: '0 15px', md: '0 25px' },
            width: { xs: 'unset', md: '100%' },
            paddingBottom: '35px',
          }}
        >
          {/* VIP Privileges */}
          <Box className="vip-privilege" sx={{ my: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <Image
                src="https://media.tenor.com/DywHTrw-GYsAAAAi/number-one-winner.gif"
                alt="Winner GIF"
                width={45}
                height={40}
                style={{ objectFit: 'contain' }}
              />
              <Typography
                sx={{
                  fontFamily: '"Times New Roman", serif',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#ff0000',
                  mx: 1,
                }}
              >
                V.I.P CLUB
              </Typography>
              <Image
                src="https://media.tenor.com/DywHTrw-GYsAAAAi/number-one-winner.gif"
                alt="Winner GIF"
                width={45}
                height={40}
                style={{ objectFit: 'contain' }}
              />
            </Box>
            <Typography
              variant="h5"
              sx={{
                color: '#454545',
                fontSize: '20px',
                fontWeight: 600,
                textAlign: 'center',
                my: 4,
              }}
            >
              Đặc quyền VIP
            </Typography>
            <Table sx={{ width: '100%', textAlign: 'center', fontSize: { xs: '14px', md: '16px' } }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ border: '1px solid #000', background: '#fff', fontWeight: 500, height: '52px' }}>
                    Tên VIP
                  </TableCell>
                  <TableCell sx={{ border: '1px solid #000', background: '#fff', fontWeight: 500, height: '52px' }}>
                    Quà thăng cấp
                  </TableCell>
                  <TableCell sx={{ border: '1px solid #000', background: '#fff', fontWeight: 500, height: '52px' }}>
                    Bonus tháng
                  </TableCell>
                  <TableCell sx={{ border: '1px solid #000', background: '#fff', fontWeight: 500, height: '52px' }}>
                    Bonus cứu trợ
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {privileges.map((privilege, index) => (
                  <TableRow key={index}>
                    <TableCell
                      sx={{
                        border: '1px solid #000',
                        background: '#fff',
                        height: '40px',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                      }}
                    >
                      {privilege.level}
                    </TableCell>
                    <TableCell
                      sx={{ border: '1px solid #000', background: '#fff', height: '40px', textTransform: 'uppercase' }}
                    >
                      {formatCurrency(privilege.upgradeReward)}
                    </TableCell>
                    <TableCell
                      sx={{ border: '1px solid #000', background: '#fff', height: '40px', textTransform: 'uppercase' }}
                    >
                      {formatCurrency(privilege.monthlyBonus)}
                    </TableCell>
                    <TableCell
                      sx={{ border: '1px solid #000', background: '#fff', height: '40px', textTransform: 'uppercase' }}
                    >
                      {privilege.reliefBonus}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>

          {/* VIP Rules */}
          <Box className="vip-rules" sx={{ my: 4 }}>
            <Typography
              variant="h5"
              sx={{
                color: '#454545',
                fontSize: '20px',
                fontWeight: 600,
                textAlign: 'center',
                my: 4,
              }}
            >
              Quy tắc
            </Typography>
            <Typography
              variant="h2"
              sx={{
                color: '#25a8de',
                fontSize: { xs: '16px', md: '30px' },
                fontWeight: { xs: 700, md: 400 },
                textAlign: 'center',
                my: { xs: '10px', md: '15px' },
                lineHeight: 1.5,
              }}
            >
              Chào mừng Quý thành viên đến với CLUB VIP của CUA68!
            </Typography>
            <Typography
              sx={{ fontSize: { xs: '14px', md: '24px' }, my: '14px', lineHeight: 1.5 }}
            >
              <span style={{ color: 'red' }}>※ Đối tượng áp dụng:</span> Tất cả Hội viên của CUA68
            </Typography>
            <Typography
              sx={{ fontSize: { xs: '14px', md: '24px' }, my: '14px', lineHeight: 1.5 }}
            >
              <span style={{ color: 'red' }}>※ Thời gian bắt đầu:</span> 01-01-2022
            </Typography>
            <Typography
              sx={{ fontSize: { xs: '14px', md: '24px' }, my: '14px', lineHeight: 1.5 }}
            >
              <span style={{ color: 'red' }}>※ Nội dung khuyến mãi:</span> Với mong muốn mang lại cho Quý khách hàng
              những trải nghiệm đẳng cấp và các ưu đãi đặc biệt VIP dành riêng cho Quý khách hàng luôn đồng hành và
              gắn bó cùng CUA68. Chương trình VIP CLUB của CUA68 là chương trình khuyến mãi đặc biệt ưu đãi cho Quý
              thành viên VIP dựa điểm nạp tích lũy và tổng cược hợp lệ tích luỹ của Quý thành viên, mỗi cấp bậc sẽ
              có từng mức ưu đãi khác nhau và cấp VIP càng cao nhận được càng nhiều ưu đãi.
            </Typography>
            <Typography
              sx={{ fontSize: { xs: '14px', md: '24px' }, my: '14px', lineHeight: 1.5 }}
            >
              <span style={{ color: 'red' }}>※ Cách thăng cấp và nhận phần thưởng theo cấp VIP:</span> Khi đạt được
              tổng cược hợp lệ tích luỹ và tổng nạp tích luỹ như sau, Hệ thống tự động thăng cấp ngay khi đủ điều kiện
              VIP và tiến hành phát ưu đãi theo cấp bậc tương ứng.
            </Typography>
            <Typography
              sx={{ fontSize: { xs: '14px', md: '24px' }, my: '14px', lineHeight: 1.5 }}
            >
              <span style={{ color: 'red' }}>※ Ví dụ:</span> Quý thành viên khi có tổng nạp là 12.000.000 điểm thì
              sẽ tương ứng với VIP1, nhận được phần quà thăng cấp là 68.000 điểm và thưởng hàng tháng là 18000 điểm.
            </Typography>
            <Typography
              sx={{ fontSize: { xs: '14px', md: '24px' }, my: '14px', lineHeight: 1.5 }}
            >
              ※ Quà thăng cấp sẽ được tiến hành phát ngay khi Quý thành viên thăng cấp. Thưởng hàng tháng sẽ được
              phát vào 12h00 ngày 01 hàng tháng. Tất cả khuyến mãi chỉ yêu cầu 1 vòng cược là có thể rút tiền.
              Khuyến mãi VIP không áp dụng cho xổ số.
            </Typography>
            <Typography
              sx={{ fontSize: { xs: '14px', md: '24px' }, my: '14px', lineHeight: 1.5 }}
            >
              <span style={{ color: 'red' }}>※ Chú ý:</span> Với mỗi cấp bậc VIP, một thành viên chỉ nhận được
              khuyến mãi thăng cấp 1 lần duy nhất cho mỗi cấp bậc.
            </Typography>
            <Typography
              sx={{ fontSize: { xs: '14px', md: '24px' }, my: '14px', lineHeight: 1.5 }}
            >
              ※ Thành viên sau khi được thăng cấp trong vòng 90 ngày kể từ ngày thăng cấp phải duy trì cược hợp lệ
              duy trì tương ứng như trên mới có thể giữ nguyên cấp, nếu trong vòng 90 ngày không hoàn thành cược hợp
              lệ duy trì sẽ bị giáng xuống 1 cấp, và cứ tương tự như vậy.
            </Typography>
            <Typography
              sx={{ fontSize: { xs: '14px', md: '24px' }, my: '14px', lineHeight: 1.5 }}
            >
              ※ Tất cả các chương trình ưu đãi của CUA68 đều được thiết kế đặc biệt dành cho người chơi. Nếu phát
              hiện bất kỳ nhóm hoặc cá nhân nào có hành vi gian lận để nhận tiền thưởng CUA68 có quyền đóng băng
              hoặc hủy bỏ tài khoản và số dư tài khoản của nhóm hoặc cá nhân đó.
            </Typography>
            <Typography
              sx={{ fontSize: { xs: '14px', md: '24px' }, my: '14px', lineHeight: 1.5 }}
            >
              ※ CUA68 có quyền giải thích cuối cùng về các sự kiện và quyền sửa đổi hoặc chấm dứt sự kiện mà không
              cần thông báo, áp dụng đối với tất cả các ưu đãi.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default VipPrivilegesPage;
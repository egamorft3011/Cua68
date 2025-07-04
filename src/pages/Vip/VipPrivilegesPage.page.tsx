"use client";
import React, { useState, SyntheticEvent } from 'react';
import { Box, Typography, Tabs, Tab, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import Image from 'next/image';
import { formatCurrency } from '@/utils/formatMoney';

// Static VIP data
const vipLevels = [
  {
    level: 1,
    monthlyReward: 38000,
    depositRequirement: 12000000,
    upgradeReward: 68000,
    reliefBonus: '0.7%',
    badge: '/images/vip-icon/vip1.png',
  },
  {
    level: 2,
    monthlyReward: 68000,
    depositRequirement: 60000000,
    upgradeReward: 238000,
    reliefBonus: '0.8%',
    badge: '/images/vip-icon/vip2.png',
  },
  {
    level: 3,
    monthlyReward: 88000,
    depositRequirement: 180000000,
    upgradeReward: 388000,
    reliefBonus: '0.9%',
    badge: '/images/vip-icon/vip3.png',
  },
  {
    level: 4,
    monthlyReward: 138000,
    depositRequirement: 500000000,
    upgradeReward: 1380000,
    reliefBonus: '1%',
    badge: '/images/vip-icon/vip4.png',
  },
  {
    level: 5,
    monthlyReward: 188000,
    depositRequirement: 2000000000,
    upgradeReward: 2888000,
    reliefBonus: '1.2%',
    badge: '/images/vip-icon/vip5.png',
  },
  {
    level: 6,
    monthlyReward: 588000,
    depositRequirement: 5000000000,
    upgradeReward: 5888000,
    reliefBonus: '1.5%',
    badge: '/images/vip-icon/vip6.png',
  },
];

const VipPrivilegesPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_: SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const currentVip = vipLevels[activeTab];

  return (
    <Box
      sx={{
        backgroundColor: '#4f2323',
        minHeight: '100vh',
        padding: { xs: '20px 10px', md: '40px 20px' },
      }}
    >
      <Box
        sx={{
          maxWidth: { xs: '100%', md: '80%' },
          margin: '0 auto',
        }}
      >
        {/* Header Image */}
        <Box sx={{ textAlign: 'center', mb: 4, mt: 7 }}>
          <Image
            src="/images/vip/vip-title.webp"
            alt="VIP Title"
            width={600}
            height={200}
            style={{ width: '100%', height: 'auto', maxWidth: '600px' }}
          />
        </Box>

        {/* VIP Privileges Title */}
        <Typography
          variant="h4"
          sx={{
            color: '#fff',
            textAlign: 'center',
            fontWeight: 'bold',
            mb: 4,
            fontSize: { xs: '24px', md: '36px' },
            textTransform: 'uppercase',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
          }}
        >
          Quyền Lợi VIP
        </Typography>

        {/* VIP Tabs and Information */}
        <Box
          sx={{
            background: '#350f0f',
            borderRadius: '12px',
            padding: { xs: '15px', md: '25px' },
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            mb: 4,
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              width: '100%',
              '& .MuiTabs-flexContainer': {
                justifyContent: { xs: 'space-between', md: 'space-between' },
                gap: 0,
              },
              '& .MuiTab-root': {
                color: '#fff',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                padding: { xs: '12px 16px', md: '16px 32px' },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #4c1f1f, #350f0f)',
                flex: 1,
                minWidth: 0,
                minHeight: { xs: '100px', md: '120px' },
                '&:first-of-type': {
                  borderTopLeftRadius: '8px',
                  borderBottomLeftRadius: '8px',
                },
                '&:last-of-type': {
                  borderTopRightRadius: '8px',
                  borderBottomRightRadius: '8px',
                },
                '&:hover': {
                  background: 'linear-gradient(135deg, #6b2b2b, #4c1f1f)',
                  transition: 'background 0.3s ease',
                },
                '&.Mui-selected': {
                  background: 'linear-gradient(135deg, #f5b041, #ff8c00)',
                  color: '#fff',
                  boxShadow: '0 4px 12px rgba(245, 176, 65, 0.5)',
                },
              },
              '& .MuiTabs-indicator': {
                display: 'none',
              },
            }}
          >
            {vipLevels.map((vip) => (
              <Tab
                key={vip.level}
                label={
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <Image
                      src={vip.badge}
                      alt={`VIP ${vip.level} badge`}
                      width={50}
                      height={50}
                      style={{ objectFit: 'contain' }}
                    />
                    <Typography sx={{ fontSize: { xs: '14px', md: '16px' }, fontWeight: 'bold', color: activeTab + 1 === vip.level ? '#fff' : 'rgba(255,255,255,0.6)' }}>
                      VIP {vip.level}
                    </Typography>
                  </Box>
                }
              />
            ))}
          </Tabs>

          {/* VIP Information */}
          {/* Block layout for mobile (xs) */}
          <Box
            sx={{
              mt: 2,
              display: { xs: 'block', md: 'none' }, // Hiển thị block trên mobile
              color: '#fff',
              textAlign: 'left',
              background: 'linear-gradient(135deg, #4c1f1f, #350f0f)',
              borderRadius: '8px',
              padding: 2,
            }}
          >
            <Typography sx={{ mb: 1, fontWeight: 'bold', display: 'flex', gap: 1 }}>
              <Box sx={{ color: '#fff' }}>Tên VIP:</Box>
              <Box sx={{ color: '#ffff00' }}>VIP {currentVip.level}</Box>
            </Typography>
            <Typography sx={{ mb: 1, fontWeight: 'bold', display: 'flex', gap: 1 }}>
              <Box sx={{ color: '#fff' }}>Tổng nạp yêu cầu:</Box>
              <Box sx={{ color: '#ffff00' }}>{formatCurrency(currentVip.depositRequirement)}</Box>
            </Typography>
            <Typography sx={{ mb: 1, fontWeight: 'bold', display: 'flex', gap: 1 }}>
              <Box sx={{ color: '#fff' }}>Thưởng thăng cấp:</Box>
              <Box sx={{ color: '#ffff00' }}>{formatCurrency(currentVip.upgradeReward)}</Box>
            </Typography>
            <Typography sx={{ mb: 1, fontWeight: 'bold', display: 'flex', gap: 1 }}>
              <Box sx={{ color: '#fff' }}>Thưởng tháng:</Box>
              <Box sx={{ color: '#ffff00' }}>{formatCurrency(currentVip.monthlyReward)}</Box>
            </Typography>
            <Typography sx={{ fontWeight: 'bold', display: 'flex', gap: 1 }}>
              <Box sx={{ color: '#fff' }}>Bonus cứu trợ:</Box>
              <Box sx={{ color: '#ffff00' }}>{currentVip.reliefBonus}</Box>
            </Typography>
          </Box>

          {/* Table layout for desktop (md and up) */}
          <Box sx={{ display: { xs: 'none', md: 'block', marginTop: 20 } }}> {/* Hiển thị table trên PC */}
            <Table
              sx={{
                width: '100%',
                textAlign: 'center',
                minWidth: '600px',
                borderRadius: '8px',
                overflow: 'hidden',
                border: 'none',
                background: 'linear-gradient(135deg, #4c1f1f, #350f0f)',
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: 'bold',
                      color: '#fff',
                      textAlign: 'center',
                      border: 'none',
                      background: 'linear-gradient(135deg, #4c1f1f, #350f0f)',
                    }}
                  >
                    Tên VIP
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 'bold',
                      color: '#fff',
                      textAlign: 'center',
                      border: 'none',
                      background: 'linear-gradient(135deg, #4c1f1f, #350f0f)',
                    }}
                  >
                    Tổng nạp yêu cầu
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 'bold',
                      color: '#fff',
                      textAlign: 'center',
                      border: 'none',
                      background: 'linear-gradient(135deg, #4c1f1f, #350f0f)',
                    }}
                  >
                    Thưởng thăng cấp
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 'bold',
                      color: '#fff',
                      textAlign: 'center',
                      border: 'none',
                      background: 'linear-gradient(135deg, #4c1f1f, #350f0f)',
                    }}
                  >
                    Thưởng tháng
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 'bold',
                      color: '#fff',
                      textAlign: 'center',
                      border: 'none',
                      background: 'linear-gradient(135deg, #4c1f1f, #350f0f)',
                    }}
                  >
                    Bonus cứu trợ
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ color: '#ffff00',  fontWeight: 'bold', textAlign: 'center', border: 'none', background: 'linear-gradient(135deg, #4c1f1f, #350f0f)' }}>
                    VIP {currentVip.level}
                  </TableCell>
                  <TableCell sx={{ color: '#ffff00',  fontWeight: 'bold', textAlign: 'center', border: 'none', background: 'linear-gradient(135deg, #4c1f1f, #350f0f)' }}>
                    {formatCurrency(currentVip.depositRequirement)}
                  </TableCell>
                  <TableCell sx={{ color: '#ffff00',  fontWeight: 'bold', textAlign: 'center', border: 'none', background: 'linear-gradient(135deg, #4c1f1f, #350f0f)' }}>
                    {formatCurrency(currentVip.upgradeReward)}
                  </TableCell>
                  <TableCell sx={{ color: '#ffff00',  fontWeight: 'bold', textAlign: 'center', border: 'none', background: 'linear-gradient(135deg, #4c1f1f, #350f0f)' }}>
                    {formatCurrency(currentVip.monthlyReward)}
                  </TableCell>
                  <TableCell sx={{ color: '#ffff00',  fontWeight: 'bold', textAlign: 'center', border: 'none', background: 'linear-gradient(135deg, #4c1f1f, #350f0f)' }}>
                    {currentVip.reliefBonus}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </Box>

       {/* VIP Rules */}
        <Box
          sx={{
            background: '#350f0f',
            borderRadius: '12px',
            padding: { xs: '15px', md: '25px' },
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: '#fff',
              textAlign: 'center',
              fontWeight: 'bold',
              mb: 4,
              fontSize: { xs: '24px', md: '36px' },
              textTransform: 'uppercase',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
            }}
          >
            VIP Club - Đẳng cấp VIP
          </Typography>
          <Box sx={{ fontSize: { xs: '14px', md: '18px' }, lineHeight: 1.8, color: '#fff' }}>
            <Typography
              sx={{
                fontSize: { xs: '16px', md: '24px' },
                fontWeight: 'bold',
                color: '#25a8de',
                mb: 2,
                textAlign: 'center',
              }}
            >
              Chào mừng Quý thành viên đến với CLUB VIP của CUA68!
            </Typography>
            <Typography sx={{ mb: 2 }}>
              <span style={{ color: '#fff', fontWeight: 'bold' }}>※ Đối tượng áp dụng:</span> VIP Club là chương trình đặc biệt dành riêng cho Khách hàng thân thiết của CUA68, mang đến những trải nghiệm cá cược đẳng cấp với nhiều đặc quyền hấp dẫn. Chương trình được thiết kế với 5 danh hiệu thành viên: Tân Thủ, Chuyên Nghiệp, Cao Thủ, Huyền Thoại và Đỗ Thánh, giúp Khách hàng từng bước chinh phục những phần thưởng giá trị.
            </Typography>
            <Typography sx={{ mb: 2 }}>
              <span style={{ color: '#fff', fontWeight: 'bold' }}>※ Cách thăng cấp:</span> Ở mỗi danh hiệu, Khách hàng sẽ trải qua 10 cấp (level) khác nhau. Khi hoàn thành yêu cầu tại cấp 10, Khách hàng sẽ được thăng cấp với phần thưởng tương ứng. Cấp bậc càng cao – đặc quyền càng lớn, phần thưởng càng hấp dẫn!
            </Typography>
            <Typography sx={{ mb: 2 }}>
              <span style={{ color: '#fff', fontWeight: 'bold' }}>※ Point và cách nhận point:</span> Point là điểm thưởng mà Khách hàng tích lũy khi tham gia cá cược tại CUA68 và được dùng để tham gia minigame, đổi thưởng cùng nhiều đặc quyền hấp dẫn khác. Có 3 cách để nhận điểm:
            </Typography>
            <Typography sx={{ mb: 2, pl: 2 }}>
              - <span style={{ color: '#fff' }}>Thưởng Thăng Cấp:</span> Khi đạt đủ tổng cược hợp lệ, Khách hàng sẽ được thăng cấp và nhận điểm thưởng tương ứng. Ví dụ: Khách hàng ở cấp Chuyên Nghiệp (Level 10), khi đạt tổng cược 54,000,000,000 VNĐ, sẽ được thăng lên cấp Cao Thủ (Level 1) và nhận 4,388 điểm thưởng thăng cấp.
            </Typography>
            <Typography sx={{ mb: 2, pl: 2 }}>
              - <span style={{ color: '#fff' }}>Thưởng Tuần:</span> Vào thứ hai hàng tuần, Khách hàng sẽ nhận được 1% tổng cược hợp lệ của cấp hiện tại dưới dạng điểm thưởng. Ví dụ: Khách hàng ở cấp Chuyên Nghiệp (Level 10), tổng cược của cấp này là 39,000,000,000 VNĐ. Nếu trong tuần đạt 1% tổng cược, sẽ nhận 388 điểm thưởng. <span style={{ color: '#fff' }}>Lưu ý:</span> Điểm thưởng sẽ được cộng vào tài khoản vào thứ hai mỗi tuần và tổng cược hợp lệ được tính là của tuần trước đó.
            </Typography>
            <Typography sx={{ mb: 2, pl: 2 }}>
              - <span style={{ color: '#fff' }}>Thưởng Tháng:</span> Vào ngày đầu tiên của tháng, Khách hàng sẽ nhận được 5% tổng cược hợp lệ của cấp hiện tại dưới dạng điểm thưởng. Ví dụ: Khách hàng ở cấp Chuyên Nghiệp (Level 10), tổng cược của cấp này là 39,000,000,000 VNĐ. Nếu trong tháng, Khách hàng đạt 5% tổng cược, sẽ nhận 1,588 điểm thưởng. <span style={{ color: '#fff' }}>Lưu ý:</span> Điểm thưởng sẽ được cộng vào tài khoản vào ngày đầu tháng và tổng cược hợp lệ được tính là của tháng trước đó.
            </Typography>
            <Typography sx={{ mb: 2 }}>
              <span style={{ color: '#fff', fontWeight: 'bold' }}>※ Điều khoản và điều kiện:</span>
            </Typography>
            <Typography sx={{ mb: 2, pl: 2 }}>
              - <span style={{ color: '#fff' }}>Chương trình áp dụng cho tất cả Khách hàng đang tham gia cá cược tại CUA68.</span>
            </Typography>
            <Typography sx={{ mb: 2, pl: 2 }}>
              - <span style={{ color: '#fff' }}>CUA68 có quyền thay đổi, điều chỉnh hoặc hủy bỏ phần thưởng của bạn nếu phát hiện bất kỳ sự gian lận nào.</span>
            </Typography>
            <Typography sx={{ mb: 2, pl: 2 }}>
              - <span style={{ color: '#fff' }}>Mọi thắc mắc xin vui lòng liên hệ bộ phận CSKH để biết thêm chi tiết.</span>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default VipPrivilegesPage;
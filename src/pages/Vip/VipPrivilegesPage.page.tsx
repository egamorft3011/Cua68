"use client";
import React, { useState, SyntheticEvent  } from 'react';
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
                    <Typography sx={{ fontSize: { xs: '14px', md: '16px' }, fontWeight: 'bold' }}>
                      VIP {vip.level}
                    </Typography>
                  </Box>
                }
              />
            ))}
          </Tabs>

          {/* VIP Information Table */}
          <Box
            sx={{
              overflowX: 'auto',
              borderRadius: '8px',
              mt: 0,
            }}
          >
            <Table
              sx={{
                width: '100%',
                textAlign: 'center',
                minWidth: '600px',
                borderRadius: '8px',
                overflow: 'hidden',
                border: 'none', // Loại bỏ border của table
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: 'bold',
                      background: 'linear-gradient(135deg, #4c1f1f, #350f0f)', // Cập nhật background giống tab
                      color: '#fff',
                      textAlign: 'center',
                      border: 'none', // Loại bỏ border của cell
                    }}
                  >
                    Tên VIP
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 'bold',
                      background: 'linear-gradient(135deg, #4c1f1f, #350f0f)', // Cập nhật background giống tab
                      color: '#fff',
                      textAlign: 'center',
                      border: 'none', // Loại bỏ border của cell
                    }}
                  >
                    Tổng nạp yêu cầu
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 'bold',
                      background: 'linear-gradient(135deg, #4c1f1f, #350f0f)', // Cập nhật background giống tab
                      color: '#fff',
                      textAlign: 'center',
                      border: 'none', // Loại bỏ border của cell
                    }}
                  >
                    Thưởng thăng cấp
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 'bold',
                      background: 'linear-gradient(135deg, #4c1f1f, #350f0f)', // Cập nhật background giống tab
                      color: '#fff',
                      textAlign: 'center',
                      border: 'none', // Loại bỏ border của cell
                    }}
                  >
                    Thưởng tháng
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 'bold',
                      background: 'linear-gradient(135deg, #4c1f1f, #350f0f)', // Cập nhật background giống tab
                      color: '#fff',
                      textAlign: 'center',
                      border: 'none', // Loại bỏ border của cell
                    }}
                  >
                    Bonus cứu trợ
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ background: 'linear-gradient(135deg, #4c1f1f, #350f0f)', color: '#fff', textAlign: 'center', border: 'none' }}>
                    VIP {vipLevels[activeTab].level}
                  </TableCell>
                  <TableCell sx={{ background: 'linear-gradient(135deg, #4c1f1f, #350f0f)', color: '#fff', textAlign: 'center', border: 'none' }}>
                    {formatCurrency(vipLevels[activeTab].depositRequirement)}
                  </TableCell>
                  <TableCell sx={{ background: 'linear-gradient(135deg, #4c1f1f, #350f0f)', color: '#fff', textAlign: 'center', border: 'none' }}>
                    {formatCurrency(vipLevels[activeTab].upgradeReward)}
                  </TableCell>
                  <TableCell sx={{ background: 'linear-gradient(135deg, #4c1f1f, #350f0f)', color: '#fff', textAlign: 'center', border: 'none' }}>
                    {formatCurrency(vipLevels[activeTab].monthlyReward)}
                  </TableCell>
                  <TableCell sx={{ background: 'linear-gradient(135deg, #4c1f1f, #350f0f)', color: '#fff', textAlign: 'center', border: 'none' }}>
                    {vipLevels[activeTab].reliefBonus}
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
            variant="h5"
            sx={{
              color: '#ff0000',
              fontSize: { xs: '20px', md: '28px' },
              fontWeight: 'bold',
              textAlign: 'center',
              mb: 3,
              textTransform: 'uppercase',
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
            }}
          >
            Quy Tắc
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
              <span style={{ color: 'red', fontWeight: 'bold' }}>※ Đối tượng áp dụng:</span> Tất cả Hội viên của CUA68
            </Typography>
            <Typography sx={{ mb: 2 }}>
              <span style={{ color: 'red', fontWeight: 'bold' }}>※ Thời gian bắt đầu:</span> 01-01-2022
            </Typography>
            <Typography sx={{ mb: 2 }}>
              <span style={{ color: 'red', fontWeight: 'bold' }}>※ Nội dung khuyến mãi:</span> Với mong muốn mang lại cho Quý khách hàng
              những trải nghiệm đẳng cấp và các ưu đãi đặc biệt VIP dành riêng cho Quý khách hàng luôn đồng hành và
              gắn bó cùng CUA68. Chương trình VIP CLUB của CUA68 là chương trình khuyến mãi đặc biệt ưu đãi cho Quý
              thành viên VIP dựa điểm nạp tích lũy và tổng cược hợp lệ tích luỹ của Quý thành viên, mỗi cấp bậc sẽ
              có từng mức ưu đãi khác nhau và cấp VIP càng cao nhận được càng nhiều ưu đãi.
            </Typography>
            <Typography sx={{ mb: 2 }}>
              <span style={{ color: 'red', fontWeight: 'bold' }}>※ Cách thăng cấp và nhận phần thưởng theo cấp VIP:</span> Khi đạt được
              tổng cược hợp lệ tích luỹ và tổng nạp tích luỹ như sau, Hệ thống tự động thăng cấp ngay khi đủ điều kiện
              VIP và tiến hành phát ưu đãi theo cấp bậc tương ứng.
            </Typography>
            <Typography sx={{ mb: 2 }}>
              <span style={{ color: 'red', fontWeight: 'bold' }}>※ Ví dụ:</span> Quý thành viên khi có tổng nạp là 12.000.000 điểm thì
              sẽ tương ứng với VIP1, nhận được phần quà thăng cấp là 68.000 điểm và thưởng hàng tháng là 18.000 điểm.
            </Typography>
            <Typography sx={{ mb: 2 }}>
              ※ Quà thăng cấp sẽ được tiến hành phát ngay khi Quý thành viên thăng cấp. Thưởng hàng tháng sẽ được
              phát vào 12h00 ngày 01 hàng tháng. Tất cả khuyến mãi chỉ yêu cầu 1 vòng cược là có thể rút tiền.
              Khuyến mãi VIP không áp dụng cho xổ số.
            </Typography>
            <Typography sx={{ mb: 2 }}>
              <span style={{ color: 'red', fontWeight: 'bold' }}>※ Chú ý:</span> Với mỗi cấp bậc VIP, một thành viên chỉ nhận được
              khuyến mãi thăng cấp 1 lần duy nhất cho mỗi cấp bậc.
            </Typography>
            <Typography sx={{ mb: 2 }}>
              ※ Thành viên sau khi được thăng cấp trong vòng 90 ngày kể từ ngày thăng cấp phải duy trì cược hợp lệ
              duy trì tương ứng như trên mới có thể giữ nguyên cấp, nếu trong vòng 90 ngày không hoàn thành cược hợp
              lệ duy trì sẽ bị giáng xuống 1 cấp, và cứ tương tự như vậy.
            </Typography>
            <Typography sx={{ mb: 2 }}>
              ※ Tất cả các chương trình ưu đãi của CUA68 đều được thiết kế đặc biệt dành cho người chơi. Nếu phát
              hiện bất kỳ nhóm hoặc cá nhân nào có hành vi gian lận để nhận tiền thưởng CUA68 có quyền đóng băng
              hoặc hủy bỏ tài khoản và số dư tài khoản của nhóm hoặc cá nhân đó.
            </Typography>
            <Typography sx={{ mb: 2 }}>
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
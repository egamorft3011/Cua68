import * as React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { Avatar } from '@mui/material';
import { formatCurrency } from '@/utils/formatMoney';
import {
  BankMenuIcon,
  GiftMenuIcon,
  HistoryMenuIcon,
  HoanIcon,
  LiveChatMenuIcon,
  LogoutMenuIcon,
  NapIcon,
  NapMenuIcon,
  ProfileIcon,
  RutIcon,
  RutMenuIcon,
  VipIcon,
} from '@/shared/Svgs/Svg.component';
import NotificationBell from './NotificationBell';

import { contentInstance } from "@/configs/CustomizeAxios";

import { PageConfig } from "@/interface/PageConfig.interface";

export interface UserProps {
  user: {
    coin: number;
    username: string;
  };
  pageConfig: PageConfig;
  status?: string; 
}

export default function MenuProfile({ user: initialUser, pageConfig }: UserProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [user, setUser] = React.useState(initialUser); // Quản lý user trong state
  const open = Boolean(anchorEl);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Hàm gọi API để lấy dữ liệu người dùng
  const fetchUserData = async () => {
    const token = window.localStorage.getItem('tokenCUA68');
    if (!token) {
      window.location.href = '/login'; // Chuyển hướng nếu không có token
      return;
    }

    try {
      const response: UserProps = await contentInstance.get('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status) {
        setUser({
          coin: response.user.coin,
          username: response.user.username,
        });
      } else {
        console.error('Lỗi từ API');
        router.push('/');
      }
    } catch (error) {
      console.error('Lỗi khi gọi API /api/auth/me:', error);
      router.push('/');
    }
  };

  // Gọi API khi URL thay đổi hoặc component mount
  React.useEffect(() => {
    fetchUserData();
  }, [pathname, searchParams]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuItemStyles = {
    minWidth: '200px',
    color: 'white',
    '&:hover': {
      background:
        'linear-gradient(90deg, rgba(230, 0, 0, 0.1) 0%, rgba(230, 0, 0, 0) 100%)',
      '& .MuiSvgIcon-root': {
        color: 'white',
      },
    },
  };

  const menuItems = [
    {
      text: 'Quản lý tài khoản',
      icon: <ProfileIcon />,
      onClick: () => router.push('/profile'),
    },
    {
      text: 'Nạp Tiền',
      icon: <NapIcon />,
      onClick: () => router.push('/profile/account-deposit'),
    },
    {
      text: 'Rút Tiền',
      icon: <RutIcon />,
      onClick: () => router.push('/profile/account-withdraw'),
    },
    // {
    //   text: 'Hoàn Tiền',
    //   icon: <HoanIcon />,
    //   onClick: () => router.push('/profile/account-withdraw'),
    // },
    {
      text: 'Khuyến mãi',
      icon: <GiftMenuIcon />,
      onClick: () => router.push('/promotion'),
    },
    {
      text: 'Cấp độ VIP',
      icon: <VipIcon />,
      onClick: () => router.push('/vip'),
    },
    {
      text: 'Lịch sử giao dịch',
      icon: <HistoryMenuIcon />,
      onClick: () => router.push('/profile/transaction-history'),
    },
    {
      text: 'Live chat 24/7',
      icon: <LiveChatMenuIcon />,
      onClick: () => window.open(pageConfig.contact.telegram, '_blank'),
    },
    {
      text: 'Đăng xuất',
      icon: <LogoutMenuIcon />,
      onClick: () => {
        window.localStorage.removeItem('tokenCUA68');
        window.localStorage.removeItem('txInfo');
        window.location.href = '/';
      },
    },
  ];

  return (
    <React.Fragment>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          textAlign: 'center',
          borderRadius: '8px',
        }}
      >
        <Typography sx={{ color: 'whiteಸ. white', fontSize: 14 }}>
          <NotificationBell />
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <button
            onClick={() => router.push('/profile/account-withdraw')}
            style={{
              display: 'flex',
              backgroundImage:
                'url(/images/bg-btn.png), conic-gradient(from 0deg at 50% 50%, #ff0808 0deg, #e02626 89.73deg, #e02626 180.18deg, #ff0808 1turn)',
              color: 'white',
              borderRadius: '20px',
              textTransform: 'none',
              fontSize: '12px',
              width: '80px',
              height: '30px',
              border: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <RutMenuIcon width={'20px'} height={'20px'} />
            RÚT
          </button>
          <button
            onClick={() => router.push('/agency')}
            style={{
              display: 'flex',
              backgroundImage:
                'url(/images/bg-btn.png), conic-gradient(from 0deg at 50% 50%, #ff9900 0deg, #ff6600 90deg, #ff3300 180deg, #ff6600 270deg, #ff9900 360deg)',
              color: 'white',
              borderRadius: '20px',
              border: 'none',
              fontSize: '12px',
              width: '80px',
              height: '30px',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              gap: '5px',
            }}
          >
            <BankMenuIcon width="20px" height="20px" fill="white" />
            ĐẠI LÝ
          </button>
          <button
            onClick={() => router.push('/vip')}
            style={{
              display: 'flex',
              background: 'linear-gradient(135deg, #2f0d00, #a74b00)',
              color: 'white',
              borderRadius: '20px',
              border: 'none',
              fontSize: '12px',
              width: '80px',
              height: '30px',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              gap: '5px',
            }}
          >
            <VipIcon width={'20px'} height={'20px'} />
            VIP
          </button>
        </Box>

        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          sx={{
            zIndex: 9999999,
          }}
          slotProps={{
            paper: {
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                border: '1px solid #503535',
                background: '#721e1e',
                borderRadius: 6,
                mt: 1.5,
                color: 'white',
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&::before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: '#721e1e',
                  borderTop: '1px solid #503535',
                  borderLeft: '1px solid #503535',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {menuItems.map((item, index) => (
            <MenuItem onClick={item.onClick} sx={menuItemStyles} key={index}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              {item.text}
            </MenuItem>
          ))}
        </Menu>

        <Box
          component="span"
          sx={{
            height: '30px',
            borderRight: '0.01rem solid',
            borderColor: 'var(--theme-color-line)',
          }}
        />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ color: 'white', fontSize: 14 }}>
            {user?.username ?? 'kadiesvu'}
          </Typography>
          <Typography sx={{ color: '#fbc16c', fontSize: 14 }}>
            {formatCurrency(user?.coin ?? 0)}
          </Typography>
          <button
            onClick={() => router.push('/profile/account-deposit')}
            style={{
              display: 'flex',
              backgroundImage:
                'url(/images/bg-btn.png), conic-gradient(from 0deg at 50% 50%, #1f50d6 0deg, #4a02ff 89.73deg, #003daf 180.18deg, #2b1fd6 1turn)',
              color: 'white',
              borderRadius: '20px',
              border: 'none',
              fontSize: '12px',
              width: '80px',
              height: '30px',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <NapMenuIcon width={'20px'} height={'20px'} />
            NẠP
          </button>
          <Tooltip title="">
            <button
              onClick={handleClick}
              style={{
                border: 'none',
                borderRadius: '0',
                background: 'none',
                cursor: 'pointer',
              }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup='true'
              aria-expanded={open ? 'true' : undefined}
            >
              <Avatar
                src="/images/avatar-4.webp"
                sx={{ width: 32, height: 32 }}
              ></Avatar>
            </button>
          </Tooltip>
        </Box>
      </Box>
    </React.Fragment>
  );
}
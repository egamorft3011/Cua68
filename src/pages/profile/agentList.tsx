"use client";
import {
  Avatar,
  Box,
  Button,
  CardContent,
  FormControl,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Select,
  Step,
  Stepper,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import "./profile.css";
import axios from "axios";
import { useMediaQuery, useTheme } from "@mui/material";


interface Agent {
  stt: number;
  daiLy: string;
  nickname: string;
  phone: string;
  contact: string[];
}

const AgentList: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); 

  // Gọi API khi component mount
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await axios.get("https://api1.cua68.com/api/info/agency");

        // Kiểm tra trạng thái phản hồi
        if (response.status) {
          const data = response.data.data.data; // Giả định API trả về mảng trong response.data.data
          setAgents(
            data.map((item: any, index: number) => ({
              stt: index + 1,
              daiLy: item.AgencyInfo?.code || item.name || "Unknown", // Lấy mã đại lý từ AgencyInfo.code hoặc name
              nickname: item.username || "Unknown", // Dùng username làm nickname
              phone: item.phone || "Chưa có", // Số điện thoại, mặc định "Chưa có" nếu không có
              contact: [], // Không có contact trong dữ liệu, để trống
            }))
          );
          setLoading(false);
        } else {
          throw new Error(`Yêu cầu API thất bại với mã trạng thái: ${response.status}`);
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError("Không tìm thấy API. Vui lòng kiểm tra endpoint.");
        } else {
          setError(err.message || "Đã có lỗi xảy ra khi lấy dữ liệu");
        }
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  // Hàm hiển thị biểu tượng liên hệ
  const renderContactIcons = (contacts: string[]) => {
    if (!contacts || contacts.length === 0) {
      return 'Chưa có';
    }

    return contacts.map((contact, index) => {
      if (contact === 'messenger') return <span key={index} role="img" aria-label="Messenger">📩</span>;
      if (contact === 'facebook') return <span key={index} role="img" aria-label="Facebook">👍</span>;
      if (contact === 'zalo') return <span key={index} role="img" aria-label="Zalo">📱</span>;
      return null;
    });
  };

  if (loading) {
    return <Typography sx={{ color: '#fff', textAlign: 'center' }}>Đang tải dữ liệu...</Typography>;
  }

  if (error) {
    return <Typography sx={{ color: '#ff0000', textAlign: 'center' }}>{error}</Typography>;
  }

  return (
    <Box sx={{ backgroundColor: '#401c1c', padding: '20px', borderRadius: '10px', color: '#fff' }}>
      <Typography  variant={isMobile ? 'h5' : 'h4'} sx={{ textAlign: 'center', color: '#ffd700', marginBottom: '10px',  fontWeight: 700, }}>
        DANH SÁCH ĐẠI LÝ
      </Typography>

      {/* Wrapper cho bảng với thanh cuộn ngang trên mobile */}
      <Box
        sx={{
          width: '100%',
        }}
      >
        {/* Tiêu đề cột */}
        <Box
          sx={{
            backgroundColor: '#2d1313',
            borderRadius: 5,
            color: '#ffd700',
            marginBottom: '5px',
            padding: '10px',
            display: {
                  xs: 'none',
                  sm: 'none',
                  md: 'flex',
                  lg: 'flex',
                },
            justifyContent: 'space-between',
            minWidth: '600px', // Đảm bảo bảng có chiều rộng tối thiểu
          }}
        >
          <Typography sx={{ flex: 1 }}>STT</Typography>
          <Typography sx={{ flex: 2 }}>ĐẠI LÝ</Typography>
          <Typography sx={{ flex: 2 }}>NICKNAME</Typography>
          <Typography sx={{ flex: 2 }}>SỐ ĐIỆN THOẠI</Typography>
          <Typography sx={{ flex: 1 }}>LIÊN HỆ</Typography>
          <Typography sx={{ flex: 1 }}>GIAO DỊCH</Typography>
        </Box>

        {/* Danh sách đại lý */}
        {agents.map((agent) => (
          <Box
            key={agent.stt}
            sx={{
              backgroundColor: '#5d2d2d',
              borderRadius: 5,
              color: 'white',
              marginBottom: '8px',
              padding: '10px',
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: isMobile ? 'flex-start' : 'space-between',
              alignItems: isMobile ? 'flex-start' : 'center',
              minWidth: isMobile ? '100%' : '600px',
            }}
          >
            {isMobile ? (
              <>
                <Box
                  sx={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography sx={{ fontWeight: 600, color: 'white' }}>{`${agent.stt}`}</Typography>
                  <Typography sx={{ fontWeight: 600, color: 'white' }}>{agent.daiLy}</Typography>
                  <Button
                    sx={{
                      background: "#4c0101",
                      color: "white",
                      borderRadius: "5px",
                      textTransform: "none",
                      fontSize: "14px",
                      padding: "4px 10px",
                      fontWeight: 600,
                    }}
                  >
                    Rút tiền
                  </Button>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    fontSize: '16px',
                    color: '#ddd',
                    width: '100%',
                    marginTop: '6px',
                    gap: '2px',
                  }}
                >
                  <Typography sx={{ fontSize: '16px' }}>
                    <strong>Nickname:</strong> {agent.nickname}
                  </Typography>
                  <Typography sx={{ fontSize: '16px' }}>
                    <strong>SĐT:</strong> {agent.phone}
                  </Typography>
                  <Typography sx={{ fontSize: '16px' }}>
                    <strong>Liên hệ:</strong> {renderContactIcons(agent.contact)}
                  </Typography>
                </Box>
              </>

            ) : (
              <>
                <Typography sx={{ flex: 1 }}>{`${agent.stt} ⭐⭐`}</Typography>
                <Typography sx={{ flex: 2 }}>{agent.daiLy}</Typography>
                <Typography sx={{ flex: 2 }}>{agent.nickname}</Typography>
                <Typography sx={{ flex: 2 }}>{agent.phone}</Typography>
                <Typography sx={{ flex: 1 }}>{renderContactIcons(agent.contact)}</Typography>
                <Typography sx={{ flex: 1 }}>
                  <Button
                    sx={{
                      background: "#4c0101",
                      color: "white",
                      borderRadius: "5px",
                      textTransform: "none",
                      fontSize: "16px",
                      width: "100%",
                      fontWeight: 600,
                    }}
                  >
                    Rút tiền
                  </Button>
                </Typography>
              </>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
  };

export default AgentList;
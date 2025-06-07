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

  // Gọi API khi component mount
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await axios.get("https://api1.cua68.com/api/info/agency");

        // Kiểm tra trạng thái phản hồi
        if (response.status === 200) {
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
      return <span>Chưa có</span>;
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
      <Typography variant="h4" sx={{ textAlign: 'center', color: '#ffd700', marginBottom: '10px' }}>
        DANH SÁCH ĐẠI LÝ
      </Typography>

      {/* Wrapper cho bảng với thanh cuộn ngang trên mobile */}
      <Box
        sx={{
          overflowX: 'auto', // Thêm thanh cuộn ngang
          width: '100%',
          // Media query để chỉ áp dụng trên mobile (dưới 600px)
          '@media (max-width: 600px)': {
            overflowX: 'auto',
            whiteSpace: 'nowrap', // Ngăn các phần tử xuống dòng
          },
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
            display: 'flex',
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
              width: '100%',
              borderRadius: 5,
              color: 'white',
              marginBottom: '5px',
              padding: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              minWidth: '600px', // Đảm bảo mỗi hàng có cùng chiều rộng với tiêu đề
            }}
          >
            <Typography sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              {`${agent.stt} ⭐⭐`}
            </Typography>
            <Typography sx={{ flex: 2, display: 'flex', alignItems: 'center' }}>
              {agent.daiLy}
            </Typography>
            <Typography sx={{ flex: 2, display: 'flex', alignItems: 'center' }}>
              {agent.nickname}
            </Typography>
            <Typography sx={{ flex: 2, display: 'flex', alignItems: 'center' }}>
              {agent.phone}
            </Typography>
            <Typography sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              {renderContactIcons(agent.contact)}
            </Typography>
            <Typography sx={{ flex: 1 }}>
              <Button
                sx={{
                  display: "flex",
                  background: "#4c0101",
                  color: "white",
                  borderRadius: "5px",
                  textTransform: "none",
                  fontSize: "14px",
                  width: "auto",
                  height: "38px",
                  border: "none",
                  alignItems: "center",
                  justifyContent: "center",
                  justifyItems: "center",
                  cursor: "pointer",
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                Rút tiền
              </Button>
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
  };

export default AgentList;
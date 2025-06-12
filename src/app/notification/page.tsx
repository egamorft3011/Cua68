'use client'; // Mark as Client Component

import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, Typography, Container, Paper, List, ListItem, ListItemText } from '@mui/material';
import { contentInstance } from "@/configs/CustomizeAxios";

interface Notification {
  id: string;
  title: string;
  time: string;
  content: string;
  details?: string[];
  isRead: boolean;
}

const NotificationDetail: React.FC = () => {
  const searchParams = useSearchParams();
  const notificationID = searchParams?.get('notificationID') ?? null;
  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('tokenCUA68') : null;

  const fetchNotification = useCallback(async () => {
    if (!notificationID || !token) {
      setError('Thiếu ID thông báo hoặc token xác thực.');
      setLoading(false);
      return;
    }

    try {
      const response = await contentInstance.get(`/api/annoucement/annoucement-info/${notificationID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status) {
        const data = response.data;
        setNotification({
          id: data.id.toString(),
          title: data.title,
          time: data.createdAt,
          content: data.content,
          isRead: data.isRead,
          details: data.details || [],
        });
      } else {
        setError('Dữ liệu thông báo không hợp lệ.');
      }
    } catch (err: any) {
      console.error('Lỗi khi lấy thông báo:', err);
      setError(err.response?.status === 401 ? 'Phiên đăng nhập hết hạn.' : 'Đã có lỗi xảy ra.');
    } finally {
      setLoading(false);
    }
  }, [notificationID, token]);

  useEffect(() => {
    fetchNotification();
  }, [fetchNotification]);

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ pt: 12, pb: 2 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5">Đang tải...</Typography>
        </Paper>
      </Container>
    );
  }

  if (error || !notification) {
    return (
      <Container maxWidth="lg" sx={{ pt: 12, pb: 2 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error">
            {error || 'Không tìm thấy thông báo'}
          </Typography>
        </Paper>
      </Container>
    );
  }

  const formattedTime = formatDate(notification.time);

  return (
    <Container maxWidth="lg" sx={{ pt: 12, pb: 2 }}>
      <Paper elevation={3} sx={{ p: 4, backgroundColor: '#4f2323', color: '#fff' }}>
        <Box
          sx={{
            mb: 3,
            borderBottom: '2px solid #ffd700',
            pb: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h5" sx={{ color: '#ffd700', fontWeight: 'bold' }}>
            Thông báo | {notification.title}
          </Typography>
          <Typography variant="caption" sx={{ color: '#bbb' }}>
            <strong>Thời gian:</strong> {formattedTime}
          </Typography>
        </Box>

        <Box
          sx={{
            background: 'linear-gradient(135deg, #d32f2f, #7b1fa2)',
            padding: 3,
            borderRadius: 2,
            mb: 3,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 'bold',
              color: '#ffd700',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
            }}
          >
            {notification.title}
          </Typography>
          <Box
            sx={{
              position: 'absolute',
              top: -20,
              right: -20,
              width: 150,
              height: 150,
              background: 'rgba(255, 215, 0, 0.3)',
              borderRadius: '50%',
              opacity: 0.5,
            }}
          />
        </Box>

        <Box
          sx={{
            color: '#ccc',
            lineHeight: 1.6,
            fontSize: '1rem',
            mb: 3
          }}
          dangerouslySetInnerHTML={{ __html: notification.content }}
        />

        {notification.details && notification.details.length > 0 && (
          <>
            <Typography variant="h6" sx={{ color: '#ffd700', mb: 2, fontWeight: 'bold' }}>
              Chi tiết:
            </Typography>
            <List sx={{ color: '#ccc' }}>
              {notification.details.map((detail, index) => (
                <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                  <ListItemText
                    primary={`${index + 1}. ${detail}`}
                    sx={{
                      '& .MuiListItemText-primary': {
                        lineHeight: 1.5,
                        fontSize: '0.95rem'
                      }
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default NotificationDetail;

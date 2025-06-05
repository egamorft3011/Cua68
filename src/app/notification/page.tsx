'use client'; // Mark as Client Component

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, Typography, Container, Paper, List, ListItem, ListItemText } from '@mui/material';

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

  useEffect(() => {
    try {
      // Get notification from localStorage
      const storedNotification = localStorage.getItem('notificationDetail');
      
      if (storedNotification) {
        const parsedNotification: Notification = JSON.parse(storedNotification);
        
        // Verify the notification ID matches the URL parameter (if provided)
        if (!notificationID || parsedNotification.id === notificationID) {
          setNotification(parsedNotification);
        }
      }
    } catch (error) {
      console.error('Error parsing notification from localStorage:', error);
    } finally {
      setLoading(false);
    }
  }, [notificationID]);

  // Function to strip HTML tags from content
  const stripHtmlTags = (html: string): string => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  // Function to format date string
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
      return dateString; // Return original string if parsing fails
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ pt: 12, pb: 2 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5">
            Đang tải...
          </Typography>
        </Paper>
      </Container>
    );
  }

  if (!notification) {
    return (
      <Container maxWidth="lg" sx={{ pt: 12, pb: 2 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error">
            Không tìm thấy thông báo
          </Typography>
        </Paper>
      </Container>
    );
  }

  const cleanContent = stripHtmlTags(notification.content);
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
        
        <Typography 
          variant="body1" 
          paragraph 
          sx={{ 
            color: '#ccc',
            lineHeight: 1.6,
            fontSize: '1rem'
          }}
        >
          {cleanContent}
        </Typography>
        
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
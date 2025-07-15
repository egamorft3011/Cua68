'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { contentInstance } from "@/configs/CustomizeAxios";
import './NotificationBell.css';

interface NotificationBellProps {
  notificationCount?: number;
}

interface Notification {
  id: string;
  title: string;
  time: string;
  content: string;
  isRead: boolean;
}

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
};

const formatNotificationCount = (count: number): string => {
  return count > 9 ? '9+' : count.toString();
};

const NotificationBell: React.FC<NotificationBellProps> = ({ notificationCount: initialCount = 0 }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState<number | null>(null);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const modalContentRef = useRef<HTMLDivElement | null>(null);
  const [unreadCount, setUnreadCount] = useState(initialCount);

  useEffect(() => {
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('tokenCUA68') : null;
    setToken(storedToken);
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    if (!token) {
      setUnreadCount(0);
      return;
    }

    try {
      const response = await contentInstance.get('/api/info/annoucement', {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: 1 }, // Chỉ cần lấy page đầu tiên để có totalUnread
      });

      if (response.status) {
        const { totalUnread } = response.data;
        setUnreadCount(totalUnread || 0); // Sử dụng totalUnread từ API
      } else {
        throw new Error('Dữ liệu thông báo không hợp lệ.');
      }
    } catch (error: any) {
      console.error('Lỗi khi lấy số lượng thông báo chưa đọc:', error);
      if (error.response?.status === 401) {
        setError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
      } else {
        setError(error.message || 'Đã có lỗi xảy ra khi lấy dữ liệu thông báo.');
      }
      setUnreadCount(0);
    }
  }, [token]);

  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  const isFetchingRef = useRef(false);

  const fetchNotifications = useCallback(async (pageNum: number) => {
    if (!token || isFetchingRef.current || (total !== null && notifications.length >= total)) {
      return;
    }
    isFetchingRef.current = true;
    setIsLoading(true);

    try {
      const limit = 4;
      const response = await contentInstance.get('/api/info/annoucement', {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: pageNum, limit },
      });

      if (response.status) {
        const apiData = response.data;
        const { data, total: totalItems, totalUnread } = apiData;

        const newNotifications = data.map((item: any, index: number) => ({
          id: item.id.toString() || `notif-${index + notifications.length}`,
          title: item.title || 'Không có tiêu đề',
          time: item.createdAt || new Date().toLocaleString('vi-VN'),
          content: item.content || 'Không có nội dung',
          isRead: item.isRead,
        }));

        if (newNotifications.length === 0) {
          setTotal(notifications.length);
          isFetchingRef.current = false;
          setIsLoading(false);
          return;
        }

        setNotifications((prev) => [...prev, ...newNotifications]);
        setTotal(totalItems !== undefined ? totalItems : notifications.length + newNotifications.length);
        setUnreadCount(totalUnread || 0); // Cập nhật unreadCount từ totalUnread

        if (notifications.length + newNotifications.length < (totalItems || Infinity)) {
          setPage((prev) => prev + 1);
        }
      } else {
        throw new Error(response.data.msg || 'Yêu cầu API thất bại');
      }
    } catch (err: any) {
      setError(err.message || 'Đã có lỗi xảy ra khi lấy dữ liệu thông báo.');
    } finally {
      isFetchingRef.current = false;
      setIsLoading(false);
      setIsInitialLoadComplete(true);
    }
  }, [notifications.length, total, token]);

  useEffect(() => {
    if (isModalOpen && !isInitialLoadComplete && token) {
      fetchNotifications(1);
    }
  }, [isModalOpen, token]);

  useEffect(() => {
    if (!isModalOpen || !loadMoreRef.current || !modalContentRef.current || isLoading || !isInitialLoadComplete || (total !== null && notifications.length >= total)) return;

    const timeout = setTimeout(() => {
      const currentRef = loadMoreRef.current;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !isLoading) {
            fetchNotifications(page);
          }
        },
        {
          root: modalContentRef.current,
          threshold: 1.0,
          rootMargin: '0px',
        }
      );

      if (currentRef) {
        observer.current.observe(currentRef);
      }
    }, 10);

    return () => {
      clearTimeout(timeout);
      if (observer.current) observer.current.disconnect();
    };
  }, [page, isInitialLoadComplete, isLoading, total, fetchNotifications, isModalOpen]);

  const handleMouseEnter = () => setIsModalOpen(true);
  const handleMouseLeave = () => setIsModalOpen(false);

  const handleDetailClick = (id: string) => {
    const notification = notifications.find((notif) => notif.id === id);
    if (notification) {
      localStorage.setItem('notificationDetail', JSON.stringify(notification));

      if (!notification.isRead) {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === id ? { ...notif, isRead: true } : notif
          )
        );
        setUnreadCount((prev) => (prev > 0 ? prev - 1 : 0));
      }

      router.push(`/notification?notificationID=${id}`);
    }
  };

  return (
    <div className="notification-wrapper" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className={`bell-container ${isModalOpen ? 'modal-open' : ''}`}>
        <img src="https://staticda88.com/images/icon-notif.svg?v=1f70d39" alt="Notification Bell" className="bell-icon" />
        {unreadCount > 0 && <span className="notification-badge">{formatNotificationCount(unreadCount)}</span>}
        <div className="modal-arrow"></div>
      </div>

      {isModalOpen && (
        <div className="modal-content" ref={modalContentRef}>
          <div className="modal-body">
            {!token ? (
              <p>Vui lòng đăng nhập để xem thông báo.</p>
            ) : isLoading && notifications.length === 0 ? (
              <p>Đang tải thông báo...</p>
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : notifications.length === 0 ? (
              <p>Không có thông báo nào.</p>
            ) : (
              notifications.map((notification) => (
                <div key={notification.id} className="notification-item">
                  <div className="notification-icon">
                    <img src="https://staticda88.com/images/item-notif.svg?v=1f70d39" alt="Icon" className="notif-icon" />
                  </div>
                  <div className="notification-content">
                    <div className="notification-title-wrapper">
                      <h4>{notification.title}</h4>
                      <span id={notification.id} className={notification.isRead ? '' : 'unread-dot'}></span>
                    </div>
                    <p className="notification-time">{formatDate(notification.time)}</p>
                    <div className="truncate" dangerouslySetInnerHTML={{ __html: notification.content }} />
                    <button className="detail-btn" onClick={() => handleDetailClick(notification.id)}>
                      Chi tiết
                    </button>
                  </div>
                </div>
              ))
            )}
            {token && (total === null || notifications.length < total) && (
              <div ref={loadMoreRef} className="load-more">
                {isLoading && <p>Đang tải thêm...</p>}
              </div>
            )}
            <div className="modal-footer">
              Cua68 - Trang cá cược thể thao chuyên nghiệp, nạp rút nhanh chóng!
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
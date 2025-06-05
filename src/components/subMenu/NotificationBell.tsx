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

const NotificationBell: React.FC<NotificationBellProps> = ({ notificationCount: initialCount = 0 }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState<number | null>(null);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
  const router = useRouter();
  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const modalContentRef = useRef<HTMLDivElement | null>(null);
  const [unreadCount, setUnreadCount] = useState(initialCount);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await contentInstance.get('/api/annoucement', {
        params: {
          page: 1,
          limit: 4,
        },
      });
      if (response.status) {
        setUnreadCount(response.data.total || 0);
      }
    } catch (error: any) {
      setError(error.message || 'Đã có lỗi xảy ra khi lấy dữ liệu thông báo.');
    }
  }, []);

  // Gọi fetchUnreadCount khi component mount
  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  // Calculate notification count based on unread notifications
  const notificationCount = notifications.filter((notif) => !notif.isRead).length || initialCount;

  const isFetchingRef = useRef(false);

  const fetchNotifications = useCallback(async (pageNum: number) => {
    if (isFetchingRef.current || (total !== null && notifications.length >= total)) return;
    isFetchingRef.current = true;
    setIsLoading(true);

    try {
      const limit = 1;
      const response = await contentInstance.get('/api/annoucement', {
        params: { page: pageNum, limit },
      });

      if (response.status) {
        const apiData = response.data;
        const { data, total: totalItems } = apiData;

        const newNotifications = data.map((item: any, index: number) => ({
          id: item.id.toString() || `notif-${index + notifications.length}`,
          title: item.title || 'Không có tiêu đề',
          time: item.createdAt || new Date().toLocaleString('vi-VN'),
          content: item.content || 'Không có nội dung',
          isRead: item.seen === 1,
        }));

        setNotifications((prev) => [...prev, ...newNotifications]);
        setTotal(totalItems);

        // Tăng page nếu còn dữ liệu
        if (notifications.length + newNotifications.length < totalItems) {
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
  }, [notifications.length, total]);

  // Initial fetch - Only run once on mount
  useEffect(() => {
    if (isModalOpen && !isInitialLoadComplete) {
      fetchNotifications(1);
    }
  }, [isModalOpen]);


  // Setup Intersection Observer for lazy loading
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


  const handleMouseEnter = () => {
    setIsModalOpen(true);
  };

  const handleMouseLeave = () => {
    setIsModalOpen(false);
  };

  const handleDetailClick = (id: string) => {
    const notification = notifications.find((notif) => notif.id === id);
    if (notification) {
      localStorage.setItem('notificationDetail', JSON.stringify(notification));
      router.push(`/notification?notificationID=${id}`);
    }
  };


  return (
    <div
      className="notification-wrapper"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`bell-container ${isModalOpen ? 'modal-open' : ''}`}>
        <img
          src="https://staticda88.com/images/icon-notif.svg?v=1f70d39"
          alt="Notification Bell"
          className="bell-icon"
        />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
        <div className="modal-arrow"></div>
      </div>

      {isModalOpen && (
        <div className="modal-content" ref={modalContentRef}>
          <div className="modal-body">
            {isLoading && notifications.length === 0 ? (
              <p>Đang tải thông báo...</p>
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : notifications.length === 0 ? (
              <p>Không có thông báo nào.</p>
            ) : (
              notifications.map((notification) => (
                <div key={notification.id} className="notification-item">
                  <div className="notification-icon">
                    <img
                      src="https://staticda88.com/images/item-notif.svg?v=1f70d39"
                      alt="Icon"
                      className="notif-icon"
                    />
                  </div>
                  <div className="notification-content">
                    <div className="notification-title-wrapper">
                      <h4>{notification.title}</h4>
                      {!notification.isRead && <span className="unread-dot"></span>}
                    </div>
                    <p className="notification-time">{notification.time}</p>
                    <div dangerouslySetInnerHTML={{ __html: notification.content }} />
                    <button
                      className="detail-btn"
                      onClick={() => handleDetailClick(notification.id)}
                    >
                      Chi tiết
                    </button>
                  </div>
                </div>
              ))
            )}
            {total === null || notifications.length < total ? (
              <div ref={loadMoreRef} className="load-more">
                {isLoading && <p>Đang tải thêm...</p>}
              </div>
            ) : null}
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
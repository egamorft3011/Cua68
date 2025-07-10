import React, { createContext, useContext, useState, useCallback } from 'react';
import { contentInstance } from '@/configs/CustomizeAxios';
import { UserProps } from './MenuProfile'; // Giả sử đây là interface của MenuProfile

interface UserContextType {
  user: UserProps['user'] | null;
  refreshUserData: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProps['user'] | null>(null);

  const refreshUserData = useCallback(async () => {
    const token = window.localStorage.getItem('tokenCUA68');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    try {
      const response: UserProps = await contentInstance.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status) {
        setUser({
          coin: response.user.coin,
          username: response.user.username,
        });
      } else {
        console.error('Lỗi từ API');
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Lỗi khi gọi API /api/auth/me:', error);
      window.location.href = '/';
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, refreshUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
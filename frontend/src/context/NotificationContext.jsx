import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

// Context quan ly thong bao toan app — polling tu backend moi 30s
const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch thong bao tu backend theo role cua user
  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated || !user?.role) return;
    try {
      const res = await api.get('/v1/notifications', { params: { role: user.role } });
      const data = res?.data?.data || res?.data || [];
      setNotifications(Array.isArray(data) ? data : []);
      // Dem so chua doc
      const unread = Array.isArray(data)
        ? data.filter((n) => !n.isRead && !n.read).length
        : 0;
      setUnreadCount(unread);
    } catch (err) {
      console.warn('Lỗi fetch notifications:', err.message);
    }
  }, [isAuthenticated, user?.role]);

  // Fetch ngay khi login + polling moi 30 giay
  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    fetchNotifications(); // Fetch ngay lap tuc

    const interval = setInterval(fetchNotifications, 30000); // Polling moi 30s
    return () => clearInterval(interval);
  }, [isAuthenticated, fetchNotifications]);

  // Danh dau 1 thong bao da doc — goi PUT /notifications/:id/read
  const markAsRead = async (id) => {
    try {
      await api.put(`/v1/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.warn('Lỗi mark read:', err.message);
    }
  };

  // Danh dau tat ca da doc — goi PUT /notifications/read-all
  const markAllAsRead = async () => {
    try {
      await api.put('/v1/notifications/read-all', null, {
        params: { role: user?.role || 'ALL' },
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.warn('Lỗi mark all read:', err.message);
    }
  };

  // Them thong bao local (tu frontend khi thuc hien action)
  const addLocalNotification = (title, type = 'info') => {
    const local = {
      id: 'local_' + Date.now(),
      title,
      type,
      isRead: false,
      sentAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [local, ...prev]);
    setUnreadCount((prev) => prev + 1);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addLocalNotification,
        refresh: fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications phải dùng trong NotificationProvider');
  }
  return context;
};

export default NotificationContext;

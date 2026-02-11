import { useState, useEffect, useCallback } from 'react';
import { notificationsService } from '@/services/notifications.service';
import type { Notification } from '@/types';

export function useNotifications(userId: string | undefined) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await notificationsService.getNotifications(userId);
      setNotifications(data);
      const count = await notificationsService.getUnreadCount(userId);
      setUnreadCount(count);
    } catch {
      // silently handle
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const markAsRead = useCallback(async (notificationId: string) => {
    await notificationsService.markAsRead(notificationId);
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(async () => {
    if (!userId) return;
    await notificationsService.markAllAsRead(userId);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
  }, [userId]);

  const deleteNotification = useCallback(async (notificationId: string) => {
    await notificationsService.deleteNotification(notificationId);
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);

  useEffect(() => {
    fetchNotifications();

    if (!userId) return;
    const channel = notificationsService.subscribeToNotifications(userId, (notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    return () => { channel.unsubscribe(); };
  }, [userId, fetchNotifications]);

  return {
    notifications, unreadCount, loading,
    fetchNotifications, markAsRead, markAllAsRead, deleteNotification,
  };
}

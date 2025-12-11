import { create } from 'zustand';
import { notificationsAPI } from '../services/api';

const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,

  fetchNotifications: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await notificationsAPI.getNotifications(params);
      set({
        notifications: response.data.data,
        unreadCount: response.data.unreadCount || 0,
        loading: false,
      });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch notifications';
      set({ loading: false, error: message });
      return { success: false, error: message };
    }
  },

  fetchUnreadCount: async () => {
    try {
      const response = await notificationsAPI.getUnreadCount();
      set({ unreadCount: response.data.count || 0 });
      return { success: true, count: response.data.count };
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return { success: false };
    }
  },

  markAsRead: async (id) => {
    try {
      await notificationsAPI.markAsRead(id);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n._id === id ? { ...n, isRead: true, readAt: new Date() } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to mark as read';
      set({ error: message });
      return { success: false, error: message };
    }
  },

  markAllAsRead: async () => {
    try {
      await notificationsAPI.markAllAsRead();
      set((state) => ({
        notifications: state.notifications.map((n) => ({
          ...n,
          isRead: true,
          readAt: new Date(),
        })),
        unreadCount: 0,
      }));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to mark all as read';
      set({ error: message });
      return { success: false, error: message };
    }
  },

  deleteNotification: async (id) => {
    try {
      await notificationsAPI.deleteNotification(id);
      set((state) => {
        const notification = state.notifications.find((n) => n._id === id);
        return {
          notifications: state.notifications.filter((n) => n._id !== id),
          unreadCount: notification && !notification.isRead
            ? Math.max(0, state.unreadCount - 1)
            : state.unreadCount,
        };
      });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete notification';
      set({ error: message });
      return { success: false, error: message };
    }
  },

  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },
}));

export default useNotificationStore;


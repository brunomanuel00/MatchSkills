import axios from "axios";
import { Notification } from "../types/notificationsTypes";
import { i18n, TFunction } from "i18next";

const baseUrl = "/api/notifications";

const apiClient = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
});

// Get all notifications from the user
const getAllNotifications = async (): Promise<Notification[]> => {
    const response = await apiClient.get('/');
    return response.data;
}

// Get the last 3 notifications (for navbar)
const getRecentNotifications = async (): Promise<Notification[]> => {
    const response = await apiClient.get(`/recent`);
    return response.data;
}

// Get unread notification count
const getUnreadCount = async (): Promise<{ unreadCount: number }> => {
    const response = await apiClient.get(`/unread-count`);
    return response.data;
}

// Mark a specific notification as read
const markAsRead = async (notificationId: string): Promise<Notification> => {
    const response = await apiClient.patch(`/${notificationId}/read`);
    return response.data;
}

// Mark all notifications as read
const markAllAsRead = async (): Promise<{ message: string; modifiedCount: number }> => {
    const response = await apiClient.patch(`/mark-all-read`);
    return response.data;
}

// Mark specific notifications as read
const markNotificationsAsRead = async (notificationIds: string[]): Promise<{ message: string; modifiedCount: number }> => {
    const response = await apiClient.patch(`/mark-read`, { notificationIds });
    return response.data;
}

// Delete a specific notification
const deleteNotification = async (notificationId: string): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/${notificationId}/eliminated`);
    return response.data;
}

// Delete all notifications
const deleteAllNotifications = async (): Promise<{ message: string; deletedCount: number }> => {
    const response = await apiClient.delete('/');
    return response.data;
}

// Delete specific notifications
const deleteNotifications = async (notificationIds: string[]): Promise<{ message: string; deletedCount: number }> => {
    const response = await apiClient.delete(`/bulk`, { data: { notificationIds } });
    return response.data;
}

// Format notification message according to type
const formatNotificationMessage = (
    notification: Notification,
    t: TFunction
): string => {
    switch (notification.type) {
        case 'new_match': {
            const count = notification.data.newMatchesCount || 1;

            return t('notifications.new_match', { count });
        }
        case 'new_message':
            return t('notifications.new_message');
        default:
            return t('notifications.default');
    }
};

// Get relative time since creation
const getRelativeTime = (createdAt: string, i18n: i18n): string => {
    const now = Date.now();
    const then = new Date(createdAt).getTime();
    const diffMs = then - now;

    // Crea un formateador para el idioma activo
    const rtf = new Intl.RelativeTimeFormat(i18n.language, {
        numeric: "auto"  // "hace 1 minuto" vs. "hace un minuto"
    });

    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;

    if (Math.abs(diffMs) < minute) {
        return rtf.format(0, "minute");        // “ahora” o “just now”
    }
    if (Math.abs(diffMs) < hour) {
        const minutes = Math.round(diffMs / minute);
        return rtf.format(minutes, "minute");  // e.g. “hace 5 minutos” / “5 minutes ago”
    }
    if (Math.abs(diffMs) < day) {
        const hours = Math.round(diffMs / hour);
        return rtf.format(hours, "hour");      // e.g. “hace 2 horas” / “2 hours ago”
    }
    if (Math.abs(diffMs) < week) {
        const days = Math.round(diffMs / day);
        return rtf.format(days, "day");        // ...
    }
    const weeks = Math.round(diffMs / week);
    return rtf.format(weeks, "week");
};

export default {
    getAllNotifications,
    getRecentNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    markNotificationsAsRead,
    deleteNotification,
    deleteAllNotifications,
    deleteNotifications,
    formatNotificationMessage,
    getRelativeTime
};
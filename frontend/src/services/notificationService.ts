import axios from "axios";
import { Notification } from "../types/notificationsTypes";

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
    const response = await apiClient.delete(`/${notificationId}`);
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
const formatNotificationMessage = (notification: Notification): string => {
    switch (notification.type) {
        case 'new_match':
            return notification.data.message ||
                `¡Tienes ${notification.data.newMatchesCount || 1} nuevo${(notification.data.newMatchesCount || 1) > 1 ? 's' : ''} match${(notification.data.newMatchesCount || 1) > 1 ? 'es' : ''}!`;
        case 'new_message':
            return notification.data.message || '¡Tienes un nuevo mensaje!';
        default:
            return 'Nueva notificación';
    }
}

// Get relative time since creation
const getRelativeTime = (createdAt: string): string => {
    const now = new Date();
    const notificationTime = new Date(createdAt);
    const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Ahora mismo';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    return `Hace ${diffInWeeks} semana${diffInWeeks > 1 ? 's' : ''}`;
}

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
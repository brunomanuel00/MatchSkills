import { useState, useCallback, useRef, useEffect } from 'react';
import { Notification } from '../../types/notificationsTypes'
import notificationService from '../../services/notificationService';
import { toastEasy } from './toastEasy';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

interface UseNotificationsReturn {
    //Sates
    notifications: Notification[];
    recentNotifications: Notification[];
    unreadCount: number;
    loading: boolean;
    error: string | null;
    selectedNotifications: string[];

    //Actions
    fetchNotifications: () => Promise<void>;
    fetchRecentNotifications: () => Promise<void>;
    fetchUnreadCount: () => Promise<void>;
    markAsRead: (notificationId: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    markNotificationsAsRead: () => Promise<void>;
    deleteNotification: (notificationId: string) => Promise<void>;
    deleteAllNotifications: () => Promise<void>;
    deleteNotifications: () => Promise<void>;
    refresh: () => Promise<void>;
    handleSelectedToggle: (notId: string) => void;
    handleSelectAllNot: () => void

    // Useful
    hasUnreadNotifications: boolean;
    formatMessage: (notification: Notification) => string;
    getRelativeTime: (createdAt: string) => string;
}

export function useNotifications(): UseNotificationsReturn {

    const [notifications, setNotifications] = useState<Notification[]>([])
    const [recentNotifications, setRecentNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const { t } = useTranslation()
    const [selectedNotifications, setSelectedNotifications] = useState<string[]>([])

    //Ref
    const fetchingRef = useRef<boolean>(false)
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const fetchNotifications = useCallback(async () => {

        if (fetchingRef.current) return;
        setLoading(true)

        try {

            fetchingRef.current = true;
            setError(null)

            const data = await notificationService.getAllNotifications();
            setNotifications(data)

        } catch (error: any) {

            setError(error.response?.data?.error || t('notifications.errors.loading'))
            toastEasy('error', t('notifications.errors.loading'))

        } finally {
            fetchingRef.current = false;
            setLoading(false)
        }

    }, [])

    const fetchRecentNotifications = useCallback(async () => {

        try {
            setError(null)
            const data = await notificationService.getRecentNotifications();
            setRecentNotifications(data)


        } catch (error: any) {
            setError(error.response?.data?.error || t('notifications.errors.loading-recent'))
            toastEasy('error', t('notifications.errors.loading-recent'))
        }

    }, [])

    const fetchUnreadCount = useCallback(async () => {

        try {

            setError(null)
            const data = await notificationService.getUnreadCount()
            setUnreadCount(data.unreadCount)

        } catch (error: any) {
            console.error('Error fetching unread count:', error);
            setError(error.response?.data?.error || 'Error loading notification count')
        }
    }, [])

    const handleSelectedToggle = useCallback((notId: string) => {
        setSelectedNotifications(prev =>
            prev.includes(notId) ? prev.filter(not => not !== notId) : [...prev, notId]
        )

    }, [selectedNotifications])

    const handleSelectAllNot = useCallback(() => {
        setSelectedNotifications(prev =>
            prev.length === notifications.length ? [] : notifications.map(not => not.id)
        )
    }, [selectedNotifications])

    const markAsRead = useCallback(async (notificationId: string) => {
        try {

            await notificationService.markAsRead(notificationId)

            setNotifications(prev => prev.map(not =>
                not.id === notificationId ? { ...not, read: true } : not
            ))

            setRecentNotifications(prev => prev.map(not =>
                not.id === notificationId ? { ...not, read: true } : not
            ))

            toastEasy('success')

        } catch (error: any) {
            toastEasy('error')
            console.error('Error marking notification as read:', error);
            setError(error.response?.data?.error || 'Error marking notification as read');
        }
    }, [fetchUnreadCount])

    const markAllAsRead = useCallback(async () => {
        try {

            await notificationService.markAllAsRead()
            setNotifications(prev => prev.map(not => ({ ...not, read: true })))
            setRecentNotifications(prev => prev.map(not => ({ ...not, read: true })))
            setUnreadCount(0)

            toastEasy('success')
        } catch (error: any) {
            toastEasy('error')

            console.error('Error marking all notifications as read:', error);
            setError(error.response?.data?.error || 'Error marking all notifications as read');

        }
    }, [])

    const markNotificationsAsRead = useCallback(async () => {
        try {

            await notificationService.markNotificationsAsRead(selectedNotifications)

            setNotifications(prev => prev.map(not =>
                selectedNotifications.includes(not.id) ? { ...not, read: true } : not
            ))

            setRecentNotifications(prev => prev.map(not =>
                selectedNotifications.includes(not.id) ? { ...not, read: true } : not
            ))
            setSelectedNotifications([])

            await fetchUnreadCount();

            toastEasy('success')

        } catch (error: any) {

            toastEasy('error')
            console.error('Error marking all notifications as read:', error);
            setError(error.response?.data?.error || 'Error marking all notifications as read');

        }
    }, [selectedNotifications, fetchUnreadCount])

    const deleteNotification = useCallback(async (notificationId: string) => {
        try {

            await notificationService.deleteNotification(notificationId)

            setNotifications(prev => prev.filter(not => not.id !== notificationId))

            setRecentNotifications(prev => prev.filter(not => not.id !== notificationId))

            await fetchUnreadCount();

            toastEasy('success')

        } catch (error: any) {
            toastEasy('error')
            console.error('Error deleting notification:', error);
            setError(error.response?.data?.error || 'Error al eliminar notificación');
        }
    }, [])

    const deleteAllNotifications = useCallback(async () => {
        try {

            await notificationService.deleteAllNotifications()
            setNotifications([])
            setRecentNotifications([])
            setUnreadCount(0)

            toastEasy('success')

        } catch (error: any) {

            toastEasy('error')

            console.error('Error deleting all notifications:', error);
            setError(error.response?.data?.error || 'Error al eliminar todas las notificaciones');
        }
    }, [])

    const deleteNotifications = useCallback(async () => {
        try {

            await notificationService.deleteNotifications(selectedNotifications);

            setNotifications(prev => prev.filter(n => !selectedNotifications.includes(n.id)))

            setRecentNotifications(prev => prev.filter(n => !selectedNotifications.includes(n.id)))
            await fetchUnreadCount();

            toastEasy('success')
        } catch (error: any) {
            toastEasy('error')
            console.error('Error deleting notifications:', error);
            setError(error.response?.data?.error || 'Error al eliminar notificaciones');
        }
    }, [fetchUnreadCount, selectedNotifications]);

    const refresh = useCallback(async () => {
        setLoading(true);
        await Promise.all([
            fetchNotifications(),
            fetchRecentNotifications(),
            fetchUnreadCount()
        ]);
        setLoading(false);
    }, [fetchNotifications, fetchRecentNotifications, fetchUnreadCount])

    useEffect(() => {
        refresh();

        // Polling cada 30 segundos para notificaciones recientes y conteo
        intervalRef.current = setInterval(async () => {
            await Promise.all([
                fetchRecentNotifications(),
                fetchUnreadCount()
            ]);
        }, 30000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [refresh, fetchRecentNotifications, fetchUnreadCount]);

    // Utilidades
    const hasUnreadNotifications = unreadCount > 0;

    const formatMessage = useCallback((notification: Notification) =>
        notificationService.formatNotificationMessage(notification, t),
        [t]);

    const getRelativeTime = useCallback((createdAt: string) =>
        notificationService.getRelativeTime(createdAt, i18n), [i18n]);

    return {
        notifications,
        recentNotifications,
        unreadCount,
        loading,
        error,
        selectedNotifications,
        //functions
        fetchNotifications,
        fetchRecentNotifications,
        fetchUnreadCount,
        markAsRead,
        markAllAsRead,
        markNotificationsAsRead,
        deleteNotification,
        deleteAllNotifications,
        deleteNotifications,
        refresh,
        handleSelectedToggle,
        handleSelectAllNot,

        // Utilidades
        hasUnreadNotifications,
        formatMessage,
        getRelativeTime
    }
}
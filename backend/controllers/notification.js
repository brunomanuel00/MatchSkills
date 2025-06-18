const express = require('express')
const router = express.Router()
const Notification = require('../models/Notification')
const { userExtractor } = require('../utils/middleware')

router.get('/', userExtractor, async (request, response) => {

    const userId = request.user.id

    try {
        const notifications = await Notification.find({ user: userId })
            .sort({ createdAt: -1 })
            .populate('user', 'name email')

        response.json(notifications)

    } catch (error) {
        console.error('Error getting notifications:', error);
        response.status(500).json({ error: 'Failed to get notifications.' });

    }

})

router.get('/recent', userExtractor, async (request, response) => {
    const userId = request.user.id
    try {

        const recentNotifications = await Notification.find({ user: userId })
            .sort({ createdAt: -1 })
            .limit(3)
            .populate('user', 'name email')

        response.json(recentNotifications)
    } catch (error) {
        console.error('Error getting recent notifications:', error);
        response.status(500).json({ error: 'Failed to get recent notifications.' });


    }
})

router.get('/unread-count', userExtractor, async (request, response) => {

    const userId = request.user.id

    try {
        const unreadCount = await Notification.countDocuments({
            user: userId,
            read: false
        })

        response.json({ unreadCount })

    } catch (error) {
        console.error('Error getting unread count:', error);
        response.status(500).json({ error: 'Failed to get unread count.' });

    }

})

router.patch('/:id/read', userExtractor, async (request, response) => {

    const userId = request.user.id
    const notifyParamsId = request.params.id

    try {

        const markAsRead = await Notification.findOneAndUpdate(
            {
                _id: notifyParamsId,
                user: userId
            },
            { read: true },
            { new: true }
        ).populate('user', 'name email')

        if (!markAsRead) {
            response.status(404).json({ error: 'Notification not found.' })
        }

        response.json(markAsRead)

    } catch (error) {
        console.error('Error marking notification as read:', error);
        response.status(500).json({ error: 'Failed to mark notification as read.' });

    }
})

router.patch('/mark-all-read', userExtractor, async (request, response) => {
    const userId = request.user.id

    try {
        const allRead = await Notification.updateMany(
            {
                user: userId,
                read: false
            },
            { read: true }
        )
        response.json({
            message: 'All notifications marked as read',
            modifiedCount: allRead.modifiedCount
        });

    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        response.status(500).json({ error: 'Failed to mark all notifications as read.' });
    }
})

router.patch('/mark-read', userExtractor, async (request, response) => {

    const userId = request.user.id
    const { notificationIds } = request.body

    try {
        if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
            return response.status(400).json({ error: 'Invalid notification IDs provided.' });
        }

        const result = await Notification.updateMany(
            {
                _id: { $in: notificationIds },
                user: userId,
                read: false
            },
            { read: true }
        )

        response.json({
            message: 'Notifications marked as read',
            modifiedCount: result.modifiedCount
        });

    } catch (error) {
        console.error('Error marking notifications as read:', error);
        response.status(500).json({ error: 'Failed to mark notifications as read.' });
    }
})

router.delete('/:id', userExtractor, async (request, response) => {
    try {
        const notification = await Notification.findOneAndDelete({
            _id: request.params.id,
            user: request.user.id
        });

        if (!notification) {
            return response.status(404).json({ error: 'Notification not found.' });
        }

        response.json({ message: 'Notification deleted successfully.' });
    } catch (error) {
        console.error('Error deleting notification:', error);
        response.status(500).json({ error: 'Failed to delete notification.' });
    }
});

router.delete('/', userExtractor, async (request, response) => {
    try {
        const result = await Notification.deleteMany({ user: request.user.id });

        response.json({
            message: 'All notifications deleted successfully',
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error('Error deleting all notifications:', error);
        response.status(500).json({ error: 'Failed to delete all notifications.' });
    }
});

router.delete('/bulk', userExtractor, async (request, response) => {
    try {
        const { notificationIds } = request.body;

        if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
            return response.status(400).json({ error: 'Invalid notification IDs provided.' });
        }

        const result = await Notification.deleteMany({
            _id: { $in: notificationIds },
            user: request.user.id
        });

        response.json({
            message: 'Notifications deleted successfully',
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error('Error deleting notifications:', error);
        response.status(500).json({ error: 'Failed to delete notifications.' });
    }
});


module.exports = router;
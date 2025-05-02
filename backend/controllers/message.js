const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { userExtractor } = require('../utils/middleware');

router.post('/', userExtractor, async (req, res) => {
    const { receiverId, content } = req.body;

    try {
        const newMessage = new Message({
            sender: req.user.id,
            receiver: receiverId,
            content
        });

        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: 'Failed to send message' });
    }
});

router.get('/:userId', userExtractor, async (req, res) => {
    const userId = req.params.userId;

    try {
        const messages = await Message.find({
            $or: [
                { sender: req.user.id, receiver: userId },
                { sender: userId, receiver: req.user.id }
            ]
        }).sort({ timestamp: 1 });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching messages' });
    }
});

module.exports = router;

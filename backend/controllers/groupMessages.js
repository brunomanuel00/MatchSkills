const express = require('express');
const router = express.Router();
const Group = require('../models/Group');
const GroupMessage = require('../models/GroupMessage');
const { userExtractor } = require('../utils/middleware');

// Enviar mensaje
router.post('/:groupId', userExtractor, async (req, res) => {
    const { content } = req.body;
    const group = await Group.findById(req.params.groupId);
    const isMember = group.members.some(m => m.user.toString() === req.user.id);
    if (!isMember) return res.status(403).json({ error: 'Not a member' });

    const message = new GroupMessage({
        group: req.params.groupId,
        sender: req.user.id,
        content
    });

    await message.save();
    res.status(201).json(message);
});

// Obtener mensajes del grupo
router.get('/:groupId', userExtractor, async (req, res) => {
    const messages = await GroupMessage.find({ group: req.params.groupId }).sort({ timestamp: 1 });
    res.json(messages);
});

module.exports = router;

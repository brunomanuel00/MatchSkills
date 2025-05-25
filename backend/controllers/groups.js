const express = require('express');
const router = express.Router();
const Group = require('../models/Group');
const { userExtractor } = require('../utils/middleware');

// Crear grupo
router.post('/', userExtractor, async (req, res) => {
    const { name, description } = req.body;

    const group = new Group({
        name,
        description,
        createdBy: req.user.id,
        members: [{ user: req.user.id, role: 'admin' }]
    });

    await group.save();
    res.status(201).json(group);
});

// Obtener grupos del usuario
router.get('/', userExtractor, async (req, res) => {
    const groups = await Group.find({ 'members.user': req.user.id });
    res.json(groups);
});

// Agregar miembro
router.post('/:groupId/add-member', userExtractor, async (req, res) => {
    const { userId, role } = req.body;

    const group = await Group.findById(req.params.groupId);
    const member = group.members.find(m => m.user.toString() === req.user.id);

    if (!member || !['admin', 'moderator'].includes(member.role)) {
        return res.status(403).json({ error: 'No permission' });
    }

    group.members.push({ user: userId, role: role || 'member' });
    await group.save();
    res.json(group);
});

module.exports = router;
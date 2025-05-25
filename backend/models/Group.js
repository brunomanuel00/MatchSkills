const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: String,
    description: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    members: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        role: { type: String, enum: ['admin', 'moderator', 'member'], default: 'member' }
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Group', groupSchema);

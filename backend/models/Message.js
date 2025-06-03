const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
});

messageSchema.set("toObject", {
    transform: (_doc, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v
    }
});

messageSchema.index({ senderId: 1, receiverId: 1, timestamp: -1 });

module.exports = mongoose.model('Message', messageSchema);
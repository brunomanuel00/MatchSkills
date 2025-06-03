const mongoose = require('mongoose')

const deleteItemSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },// Who's delete
    itemType: { type: String, enum: ['message', 'chat'], required: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true }, // messageId or userId opposite in chat
    chatWith: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, //chats only: who it was with
    deleteAt: { type: Date, default: Date.now }
})

deleteItemSchema.index({ userId: 1, itemType: 1, itemId: 1 })

module.exports = mongoose.model("DeletedItem", deleteItemSchema)
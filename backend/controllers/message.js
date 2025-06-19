const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { userExtractor } = require('../utils/middleware');
const mongoose = require('mongoose');
const DeletedItem = require('../models/DeleteItem');

// Sent improved message
router.post('/', userExtractor, async (request, response) => {
    try {
        const { receiverId, content } = request.body;
        const senderId = request.user.id;

        //  Basic validations
        if (senderId === receiverId) {
            return response.status(400).json({ error: "You can't send messages to yourself" });
        }

        // 2) Check if the receiver is actively viewing this chat and broadcast the event via socket
        const io = request.app.get('io');
        const connectedUsers = request.app.get('connectedUsers');
        const activeChats = request.app.get('activeChats' || new Map())

        //Check if the receiver is in the chat
        const isReceiverViewingChat = activeChats.get(receiverId) === senderId

        //  Create and save messages
        const newMessage = new Message({
            senderId,
            receiverId,
            content,
            read: isReceiverViewingChat
        });

        const savedMessage = await newMessage.save();

        //  Find connected sockets
        const receiverSocketId = connectedUsers.get(receiverId);
        const senderSocketId = connectedUsers.get(senderId);

        //  Populate for user data
        const populatedMessage = await Message.populate(savedMessage, [
            { path: 'senderId', select: 'name avatar' },
            { path: 'receiverId', select: 'name avatar' }
        ]);

        //  Prepare payload for Socket.io
        const messagePayload = {
            ...populatedMessage.toObject(),
            timestamp: populatedMessage.timestamp.getTime()
        };

        //  Sent to receiver if connected
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('new_message', messagePayload);
        }

        response.status(201).json(populatedMessage);
    } catch (error) {
        response.status(500).json({ error: 'Error sending message' });
    }
});

// Get message history with pagination
router.get('/:userId', userExtractor, async (request, response) => {
    try {
        const currentUser = request.user.id;
        const otherUser = request.params.userId;

        // Improved ObjectId Validations
        if (!mongoose.Types.ObjectId.isValid(otherUser)) {
            return response.status(400).json({ error: 'Invalid user ID' });
        }

        const deleted = await DeletedItem.find({
            userId: currentUser,
            itemType: 'message',
        }).select('itemId').lean()

        const deleteIds = deleted.map(item => item.itemId.toString())

        // 2. Search messages in both directions
        const messages = await Message.find({
            $or: [
                { senderId: currentUser, receiverId: otherUser },
                { senderId: otherUser, receiverId: currentUser }
            ]
        })
            .sort({ timestamp: 1 })
            .populate('senderId', 'name avatar')
            .populate('receiverId', 'name avatar');


        const filteredMessages = messages.filter(msg =>
            !deleteIds.includes(msg._id.toString())
        )

        // 3. Format dates
        const formattedMessages = filteredMessages.map(msg => ({
            ...msg.toObject(),
            timestamp: msg.timestamp.getTime()
        }));

        response.json(formattedMessages);


    } catch (error) {
        response.status(500).json({ error: 'Error getting messages' });
    }
});

// Chat list optimized
router.get('/chats/list', userExtractor, async (request, response) => {

    try {
        const userId = request.user._id;

        const deletedChat = await DeletedItem.find({
            userId,
            itemType: 'chat'
        }).select('itemId chatWith').lean()

        const deletedChatUserIds = deletedChat.map(item =>
            item.chatWith ? new mongoose.Types.ObjectId(item.chatWith) : new mongoose.Types.ObjectId(item.itemId)
        );

        const chats = await Message.aggregate([
            {  // 1) Filter all messages SENT OR RECEIVED by this user
                $match: {
                    $or: [
                        { senderId: userId }, // Messages SENT by the user
                        { receiverId: userId } // Messages RECEIVED by the user
                    ]
                }
            },
            {
                // 2) "Deleted" by this user: lookUp a DeletedItem for itemType:"message"
                $lookup: {
                    from: "deleteditems",
                    let: { mid: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$itemId", "$$mid"] },
                                        { $eq: ["$userId", new mongoose.Types.ObjectId(userId)] },
                                        { $eq: ["$itemType", 'message'] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'deletedForUser'
                }
            },
            {
                // 3) Only keep messages that are not marked as deleted by this user
                $match: {
                    $expr: {
                        $eq: [{ $size: "$deletedForUser" }, 0]
                    }
                }
            },
            { $sort: { timestamp: -1 } }, // 4) Order by Date Desc
            {
                // 5) Group by "the other user" in the conversation and take the most recent message from this group
                $group: {
                    _id: {
                        $cond: [ // Conditional to determine the user ID
                            { $eq: ["$senderId", userId] }, // If the message was SENT by the user
                            "$receiverId", // → The user is the receiver
                            "$senderId"  // → The user is the sender
                        ]
                    },
                    lastMessage: { $first: "$$ROOT" }, // Save the first message of the group (the most recent)
                    unreadCount: {
                        $sum: {
                            $cond: [ // Add 1 if unread and received by the user
                                {
                                    $and: [
                                        { $eq: ["$receiverId", userId] }, // Message received
                                        { $eq: ["$read", false] } // Unread
                                    ]
                                },
                                1, // If it complies, sum 1
                                0 // If not, sum 0
                            ]
                        }
                    }
                }
            },
            {
                $match: {
                    _id: { $nin: deletedChatUserIds }
                }
            },
            {
                // 6) Bring data from the "the other user" with a lookup to the user collection
                $lookup: {// Get user data
                    from: "users", // User collection
                    localField: "_id", // Local field (user ID)
                    foreignField: "_id", // Field in the "user" collection
                    as: "user"  // Save the result in "user" (array)
                }
            },
            { $unwind: "$user" }, //Convert array to object
            {
                $project: {//Give the final format
                    _id: 0,// Exclude the _id field from the group
                    user: { // The data we will show about the user
                        _id: "$user._id",
                        name: "$user.name",
                        avatar: {
                            url: "$user.avatar.url"
                        }
                    },
                    lastMessage: { // The data will show about the message
                        content: "$lastMessage.content",
                        timestamp: "$lastMessage.timestamp",
                        read: "$lastMessage.read"
                    },
                    unreadCount: 1 // Include unread count
                }
            }
        ]);

        response.json(chats);
    } catch (error) {
        console.error("Error in /chats/list:", error);
        response.status(500).json({ error: "Error getting chats" });
    }
});

// Mark messages as read
router.patch('/read', userExtractor, async (request, response) => {
    try {
        const userId = request.user.id;
        const { messageIds } = request.body;

        console.log(`📖 User ${userId} trying to mark as read:`, messageIds);

        // Improved validations
        if (!messageIds?.length) {
            return response.status(400).json({ error: 'An array of messageIds is required' });
        }

        // Convert to valid ObjectIds
        const validObjectIds = messageIds.filter(id => mongoose.Types.ObjectId.isValid(id))
            .map(id => new mongoose.Types.ObjectId(id));

        // 1. First: Get messages before updating them to know who sent them
        const messagesToUpdate = await Message.find({
            _id: { $in: validObjectIds },
            receiverId: userId,
            read: false
        }).lean();

        console.log(`📋 Messages found to mark as read:`, messagesToUpdate.length);

        if (messagesToUpdate.length === 0) {
            return response.json({
                success: true,
                updatedCount: 0,
                message: 'There are messages to mark as read'
            });
        }

        // 2. Update messages as read
        const updateResult = await Message.updateMany(
            {
                _id: { $in: validObjectIds },
                receiverId: userId,
                read: false
            },
            { $set: { read: true } }
        );

        console.log(`✅ Update messages on BD:`, updateResult.modifiedCount);

        // 3. Group messages by sender (senderId)
        const messagesBySender = messagesToUpdate.reduce((acc, msg) => {
            const sender = msg.senderId.toString();
            if (!acc[sender]) acc[sender] = [];
            acc[sender].push(msg._id.toString());
            return acc;
        }, {});

        console.log(`👥 Messages grouped by sender:`, messagesBySender);

        // 4. Obtain necessary references
        const io = request.app.get('io');
        const connectedUsers = request.app.get('connectedUsers');

        // 5. Notify each sender via Socket.IO
        Object.entries(messagesBySender).forEach(([senderId, messageIdsList]) => {
            const senderSocketId = connectedUsers.get(senderId);

            console.log(`🔍 Looking for a socket for the sender ${senderId}:`, senderSocketId ? 'Found' : 'No found');

            if (senderSocketId) {
                const payload = {
                    messageIds: messageIdsList,
                    readerId: userId
                };

                io.to(senderSocketId).emit('messages_read', payload);
                console.log(`📤 Notification sent to ${senderId}:`, payload);
            }
        });

        // 6. Succesfull respinse
        response.json({
            success: true,
            updatedCount: updateResult.modifiedCount,
            affectedSenders: Object.keys(messagesBySender).length,
            notifiedSenders: Object.keys(messagesBySender).filter(senderId =>
                connectedUsers.get(senderId)
            ).length
        });

    } catch (error) {
        console.error('❌ Error in PATCH /read:', error);
        response.status(500).json({
            error: 'Internal Server Error',
            details: error.message
        });
    }
});

//Delete a message
router.delete('/:messageId', userExtractor, async (request, response) => {
    const userId = request.user.id
    const messageId = new mongoose.Types.ObjectId(request.params.messageId)


    if (!mongoose.Types.ObjectId.isValid(messageId)) {
        return response.status(400).json({ error: 'Invalid message ID' });
    }

    const messageObjectId = new mongoose.Types.ObjectId(messageId);

    // Find the message first
    const msg = await Message.findById(messageObjectId).lean();

    if (!msg) {
        return response.status(404).json({ error: 'Message not found' });
    }

    // 1) Create deletion record for this user
    await DeletedItem.create({
        userId,
        itemType: 'message',
        itemId: messageId
    })

    // 2) Check if the other person has already deleted this message
    const otherUser = msg.senderId === userId ? msg.receiverId : msg.senderId
    const also = await DeletedItem.findOne({
        userId: otherUser,
        itemType: 'message',
        itemId: messageId
    })

    if (also) {
        // 3) Both deleted: delete message and DeletedItem log
        await Message.findByIdAndDelete(messageId)
        await DeletedItem.deleteMany({ itemType: 'message', itemId: messageId })
    }

    response.json({ success: true })
})

router.delete('/chat/:otherUserId', userExtractor, async (request, response) => {
    try {
        const userId = request.user.id
        const otherUserId = request.params.otherUserId // ✅ Corregido el nombre

        // Validar que el otherUserId sea válido
        if (!mongoose.Types.ObjectId.isValid(otherUserId)) {
            return response.status(400).json({ error: 'Invalid user ID' });
        }

        // Verificar que no sea el mismo usuario
        if (userId === otherUserId) {
            return response.status(400).json({ error: "Cannot delete chat with yourself" });
        }

        console.log(`🗑️ User ${userId} deleting chat with ${otherUserId}`);

        // 1) Log of chat deletion by this user
        await DeletedItem.create({
            userId,
            itemType: 'chat',
            itemId: userId, // ✅ Corregido: usar userId como itemId
            chatWith: otherUserId
        })

        // 2) Check if the other user already deleted it
        const also = await DeletedItem.findOne({
            userId: otherUserId,
            itemType: 'chat',
            itemId: otherUserId, // ✅ Corregido: usar otherUserId como itemId
            chatWith: userId
        })

        console.log(`🔍 Other user deletion record:`, also ? 'Found' : 'Not found');

        if (also) {
            console.log(`💥 Both users deleted - removing all messages and records`);

            // 3) Both deleted: delete all messages from the conversation
            const deleteResult = await Message.deleteMany({
                $or: [
                    { senderId: userId, receiverId: otherUserId },
                    { senderId: otherUserId, receiverId: userId }
                ]
            })

            console.log(`📧 Deleted ${deleteResult.deletedCount} messages`);

            // 4) Remove the chat deletion records
            const deletedItems = await DeletedItem.deleteMany({
                itemType: 'chat',
                $or: [
                    { userId, chatWith: otherUserId },
                    { userId: otherUserId, chatWith: userId }
                ]
            })

            console.log(`🗂️ Deleted ${deletedItems.deletedCount} deletion records`);
        }

        response.json({ success: true })
    } catch (error) {
        console.error('❌ Error deleting chat:', error);
        response.status(500).json({ error: 'Error deleting chat' });
    }
})

module.exports = router;


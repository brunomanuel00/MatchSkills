const Message = require('../models/Message')
const DeletedItem = require('../models/DeleteItem')
const User = require('../models/User')


async function handleUserMessageDeletion(userIdToDelete) {
    try {

        // 1) Get all messages where the user participates
        const allMessages = await Message.find({
            $or: [
                { senderId: userIdToDelete },
                { receiverId: userIdToDelete }
            ]
        }).lean()

        // 2) Group messages by conversation
        const conversationGroup = new Map()

        for (const msg of allMessages) {
            const otherUserId = msg.senderId.toString() === userIdToDelete
                ? msg.receiverId.toString()
                : msg.senderId.toString()

            if (!conversationGroup.has(otherUserId)) {
                conversationGroup.set(otherUserId, [])
            }
            conversationGroup.get(otherUserId).push(msg)
        }

        // 3) Process each conversation 
        for (const [otherUserId, message] of conversationGroup) {

            const otherUserExist = await User.findById(otherUserId)

            if (!otherUserExist) {
                // Case 1: Both users deleted - delete messages completely
                const messageIds = message.map(msg => msg._id)

                await Message.deleteMany({ _id: { $in: messageIds } })

                // Clear related DeleteItem record
                await DeletedItem.deleteMany({
                    itemType: "message",
                    itemId: { $in: messageIds }
                })

                // Clear related chat record

                await DeletedItem.deleteMany({
                    itemType: "chat",
                    $or: [
                        { userId: userIdToDelete, itemId: otherUserId },
                        { userId: otherUserId, itemId: userIdToDelete }
                    ]
                })
                console.log(`✅ Completely deleted ${messageIds.length} messages between deleted users: ${userIdToDelete} and ${otherUserId}`);

            }
            else {
                // Case 2: Only one deleted user - mark message as deleted
                for (const msg of message) {

                    // Check if a deletion record already exist for this message
                    const existingDeletion = await DeletedItem.findOne({
                        userId: userIdToDelete,
                        itemType: "message",
                        itemId: msg._id
                    })

                    if (existingDeletion) {
                        // The other user already deleted it  - delete message completely

                        await Message.findByIdAndDelete(msg._id);

                        await DeletedItem.deleteMany({
                            itemId: msg._id,
                            itemType: "message"
                        })

                        console.log(`🗑️ Message ${msg._id} completely deleted (both users deleted it)`);
                    } else {
                        // Just create the record
                        await DeletedItem.create({
                            userId: userIdToDelete,
                            itemType: 'message',
                            itemId: msg._id
                        });

                        console.log(`📝 Mark ${message.length} messages as deleted for user ${userIdToDelete} in conversation with ${otherUserId}`);

                    }
                }

            }
        }

        // 4. Clear deleted chat logs where the user participated
        await DeletedItem.deleteMany({
            itemType: 'chat',
            userId: userIdToDelete
        });
        console.log(`✅ Message cleanup completed for the user ${userIdToDelete}`);

    } catch (error) {
        console.log('❌ Error in handleUserMessagesDeletion: ', error);
        throw error;

    }

}


module.exports = { handleUserMessageDeletion }
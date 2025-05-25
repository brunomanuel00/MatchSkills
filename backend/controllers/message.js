const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { userExtractor } = require('../utils/middleware');
const mongoose = require('mongoose');
// const { io } = require('socket.io-client');

// Enviar mensaje mejorado
router.post('/', userExtractor, async (req, res) => {
    try {
        const { receiverId, content } = req.body;
        const senderId = req.user.id;

        //  Validaciones básicas
        if (senderId === receiverId) {
            return res.status(400).json({ error: 'No puedes enviarte mensajes a ti mismo' });
        }

        // 2. Verificar si el receptor está viendo este chat activamente y emitir el evento via socket
        const io = req.app.get('io');
        const connectedUsers = req.app.get('connectedUsers');
        const activeChats = req.app.get('activeChats' || new Map())

        //Comprobar si el receptor esta en el chat
        const isReceiverViewingChat = activeChats.get(receiverId) === senderId

        //  Crear y guardar mensaje
        const newMessage = new Message({
            senderId,
            receiverId,
            content,
            read: isReceiverViewingChat
        });

        const savedMessage = await newMessage.save();

        //  Buscar sockets conectados
        const receiverSocketId = connectedUsers.get(receiverId);
        const senderSocketId = connectedUsers.get(senderId);

        //  Populate para datos del usuario
        const populatedMessage = await Message.populate(savedMessage, [
            { path: 'senderId', select: 'name avatar' },
            { path: 'receiverId', select: 'name avatar' }
        ]);

        //  Preparar payload para Socket.io
        const messagePayload = {
            ...populatedMessage.toObject(),
            timestamp: populatedMessage.timestamp.getTime()
        };

        //  Enviar a receptor si está conectado
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('new_message', messagePayload);
        }

        //  Enviar confirmación al emisor
        if (senderSocketId) {
            io.to(senderSocketId).emit('message_sent', messagePayload);
        }

        res.status(201).json(populatedMessage);
    } catch (error) {
        res.status(500).json({ error: 'Error al enviar mensaje' });
    }
});

// Obtener historial de mensajes con paginación
router.get('/:userId', userExtractor, async (req, res) => {
    try {
        const currentUser = req.user.id;
        const otherUser = req.params.userId;

        // Validación mejorada de ObjectId
        if (!mongoose.Types.ObjectId.isValid(otherUser)) {
            return res.status(400).json({ error: 'ID de usuario inválido' });
        }

        // 2. Buscar mensajes en ambas direcciones
        const messages = await Message.find({
            $or: [
                { senderId: currentUser, receiverId: otherUser },
                { senderId: otherUser, receiverId: currentUser }
            ]
        })
            .sort({ timestamp: 1 })
            .populate('senderId', 'name avatar')
            .populate('receiverId', 'name avatar');

        // 3. Formatear fechas
        const formattedMessages = messages.map(msg => ({
            ...msg.toObject(),
            timestamp: msg.timestamp.getTime()
        }));

        res.json(formattedMessages);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener mensajes' });
    }
});

// Lista de chats optimizada
router.get('/chats/list', userExtractor, async (req, res) => {

    try {

        const userId = req.user._id;

        const chats = await Message.aggregate([
            {  //Filtrar mensajes por usuarios
                $match: {
                    $or: [
                        { senderId: userId }, // Mensajes ENVIADOS por el usuario
                        { receiverId: userId } // Mensajes RECIBIDOS por el usuario
                    ]
                }
            },
            { $sort: { timestamp: -1 } }, //Ordenar por fecha descendente
            {
                $group: {
                    _id: {
                        $cond: [// Condicional para determinar el ID del contacto
                            { $eq: ["$senderId", userId] }, // Si el mensaje fue ENVIADO por el usuario
                            "$receiverId", // → El contacto es el receptor
                            "$senderId"  // → El contacto es el remitente
                        ]
                    },
                    lastMessage: { $first: "$$ROOT" }, // Guarda el primer mensaje del grupo (el más reciente)
                    unreadCount: {
                        $sum: {
                            $cond: [ // Suma 1 si el mensaje es no leído y recibido por el usuario
                                {
                                    $and: [
                                        { $eq: ["$receiverId", userId] }, // Mensaje recibido
                                        { $eq: ["$read", false] } // No leído
                                    ]
                                },
                                1, // Si cumple, suma 1
                                0 // Si no, suma 0
                            ]
                        }
                    }
                }
            },
            {
                $lookup: {// Obtener datos del usuario contacto
                    from: "users", // Colección de usuarios
                    localField: "_id", // Campo local (ID del contacto)
                    foreignField: "_id", // Campo en la colección "users"
                    as: "user"  // Guarda el resultado en "user" (array)
                }
            },
            { $unwind: "$user" }, //Convertir array en objeto
            {
                $project: {//Dar el formato final
                    _id: 0, // Excluir el campo _id del grupo
                    user: {
                        _id: "$user._id",
                        name: "$user.name",
                        avatar: {
                            url: "$user.avatar.url" //Extraer solo la Url del avatar
                        }
                    },
                    lastMessage: {
                        content: "$lastMessage.content",
                        timestamp: "$lastMessage.timestamp",
                        read: "$lastMessage.read"
                    },
                    unreadCount: 1 // Incluir el conteo de no leídos
                }
            }
        ]);

        res.json(chats);
    } catch (error) {
        console.error("Error en /chats/list:", error);
        res.status(500).json({ error: "Error al obtener chats" });
    }
});

// En tu archivo de rutas de mensajes (paste-3.txt)
router.patch('/read', userExtractor, async (req, res) => {
    try {
        const userId = req.user.id;
        const { messageIds } = req.body;

        console.log(`📖 Usuario ${userId} intentando marcar como leídos:`, messageIds);

        // Validación mejorada
        if (!messageIds?.length) {
            return res.status(400).json({ error: 'Se requiere un array de messageIds' });
        }

        // Convertir a ObjectIds válidos
        const validObjectIds = messageIds.filter(id => mongoose.Types.ObjectId.isValid(id))
            .map(id => new mongoose.Types.ObjectId(id));

        // 1. PRIMERO: Obtener los mensajes ANTES de actualizarlos para saber quién los envió
        const messagesToUpdate = await Message.find({
            _id: { $in: validObjectIds },
            receiverId: userId,
            read: false
        }).lean();

        console.log(`📋 Mensajes encontrados para marcar como leídos:`, messagesToUpdate.length);

        if (messagesToUpdate.length === 0) {
            return res.json({
                success: true,
                updatedCount: 0,
                message: 'No hay mensajes para marcar como leídos'
            });
        }

        // 2. Actualizar mensajes como leídos
        const updateResult = await Message.updateMany(
            {
                _id: { $in: validObjectIds },
                receiverId: userId,
                read: false
            },
            { $set: { read: true } }
        );

        console.log(`✅ Mensajes actualizados en BD:`, updateResult.modifiedCount);

        // 3. Agrupar mensajes por emisor (senderId)
        const messagesBySender = messagesToUpdate.reduce((acc, msg) => {
            const sender = msg.senderId.toString();
            if (!acc[sender]) acc[sender] = [];
            acc[sender].push(msg._id.toString());
            return acc;
        }, {});

        console.log(`👥 Mensajes agrupados por emisor:`, messagesBySender);

        // 4. Obtener referencias necesarias
        const io = req.app.get('io');
        const connectedUsers = req.app.get('connectedUsers');

        // 5. Notificar a cada emisor via Socket.IO
        Object.entries(messagesBySender).forEach(([senderId, messageIdsList]) => {
            const senderSocketId = connectedUsers.get(senderId);

            console.log(`🔍 Buscando socket para emisor ${senderId}:`, senderSocketId ? 'ENCONTRADO' : 'NO ENCONTRADO');

            if (senderSocketId) {
                const payload = {
                    messageIds: messageIdsList,
                    readerId: userId
                };

                io.to(senderSocketId).emit('messages_read', payload);
                console.log(`📤 Notificación enviada a ${senderId}:`, payload);
            }
        });

        // 6. Respuesta exitosa
        res.json({
            success: true,
            updatedCount: updateResult.modifiedCount,
            affectedSenders: Object.keys(messagesBySender).length,
            notifiedSenders: Object.keys(messagesBySender).filter(senderId =>
                connectedUsers.get(senderId)
            ).length
        });

    } catch (error) {
        console.error('❌ Error en PATCH /read:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            details: error.message
        });
    }
});

// router.delete()

module.exports = router;

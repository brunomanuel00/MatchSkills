const https = require('https')
const fs = require('fs')
const path = require('path')
const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')
const { Server } = require('socket.io')

// Leer certificados SSL (asegúrate de generarlos antes en ./cert/)
const key = fs.readFileSync(path.join(__dirname, 'cert', 'key.pem'))
const cert = fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))

const connectedUsers = new Map()
const activeChats = new Map()

const server = https.createServer({ key, cert }, app)

const io = new Server(server, {
    cors: {
        origin: ['https://localhost:5173'], // usa https en local también
        methods: ['GET', 'POST'],
        credentials: true,
    },
})


app.set('io', io);
app.set('connectedUsers', connectedUsers);
app.set('activeChats', activeChats);

io.on('connection', (socket) => {
    console.log('🟢 Nuevo cliente conectado:', socket.id);

    // Obtener userId del query handshake
    const userId = socket.handshake.query.userId?.toString();
    if (!userId) {
        console.log('❌ Conexión rechazada: userId no proporcionado');
        return socket.disconnect(true);
    }

    //  Registrar usuario conectado
    connectedUsers.set(userId, socket.id);
    console.log(`👤 Usuario ${userId} conectado (Socket: ${socket.id})`);

    socket.on('set_active_chat', (chatId) => {

        if (chatId) {
            activeChats.set(userId, chatId)
            console.log(`👁️ Usuario ${userId} está viendo el chat con: ${chatId}`);
        } else {
            // Si es null, eliminar el registro de chat activo
            activeChats.delete(userId);
            console.log(`👁️ Usuario ${userId} cerró los chats activos`);
        }

    })


    socket.on('private_message', async (msg) => {
        try {
            // Validación básica
            if (!msg.receiverId || !msg.content) {
                return console.log('❌ Mensaje inválido:', msg);
            }

            // Buscar receptor conectado
            const receiverSocketId = connectedUsers.get(msg.receiverId);

            if (receiverSocketId) {
                // Enviar mensaje en tiempo real
                io.to(receiverSocketId).emit('new_message', {
                    ...msg,
                    timestamp: new Date(),
                    _id: Date.now().toString(), // ID temporal
                    senderId: userId,
                    read: isReceiverViewingChat
                });
            }
        } catch (error) {
            console.error('Error en private_message:', error);
        }
    });

    // Escuchar evento para marcar mensajes como leídos instantáneamente
    socket.on('mark_messages_read', async ({ messageIds, senderId }) => {
        try {
            if (!messageIds || !Array.isArray(messageIds) || messageIds === 0) return

            // Intentar buscar el socket del remitente para notificarle
            const senderSocketId = connectedUsers.get(senderId)

            if (senderSocketId) {
                // Notificar al remitente que sus mensajes fueron leídos
                io.to(senderSocketId).emit('messages_read', {
                    messageIds,
                    readerId: userId
                })

            }

        } catch (error) {
            console.error('Error en mark_messages_read:', error);

        }
    })

    // Escucha cuando un usuario está escribiendo en un chat 1 a 1
    // En el evento 'typing' del servidor
    socket.on('typing', ({ receiverId, senderId, isTyping }) => {
        const receiverSocketId = connectedUsers.get(receiverId);

        if (receiverSocketId) {
            // Enviar con formato consistente
            socket.to(receiverSocketId).emit('typing', {
                senderId: senderId,
                isTyping: isTyping
            });
        }
    });


    // Escucha cuando el usuario deja de escribir
    socket.on("stopTyping", ({ to }) => {
        socket.to(to).emit("stopTyping", { from: socket.userId });
    });



    // Mensaje grupal
    // socket.on('group_message', ({ groupId, message }) => {
    //     io.to(groupId).emit('group_message', message);
    // });

    // // Unirse a grupo
    // socket.on('join_group', (groupId) => {
    //     socket.join(groupId);
    //     console.log(`📢 Socket ${socket.id} unido al grupo ${groupId}`);
    // });

    // // Notificación individual
    // socket.on('notify', ({ userId, notification }) => {
    //     const socketId = connectedUsers.get(userId);
    //     if (socketId) {
    //         io.to(socketId).emit('notify', notification);
    //     }
    // });



    // Desconexión
    socket.on('disconnect', () => {
        console.log('🔴 Cliente desconectado:', socket.id);
        for (let [userId, socketId] of connectedUsers) {
            if (socketId === socket.id) {
                connectedUsers.delete(userId);
                break;
            }
        }
    });

    if (process.env.NODE_ENV === 'production') {
        app.use((req, res, next) => {
            if (req.protocol === 'http') {
                return res.redirect(`https://${req.headers.host}${req.url}`)
            }
            next()
        })
    }
});


server.listen(config.PORT, () => {
    logger.info(`🚀 Server running on port ${config.PORT}`);
});

module.exports = server;


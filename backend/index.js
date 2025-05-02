const http = require('http');
const app = require('./app');
const config = require('./utils/config');
const logger = require('./utils/logger');
const { Server } = require('socket.io');

const server = http.createServer(app); // Reemplazamos app.listen()

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173'], // Cambia esto a tu frontend si es necesario
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// Almacena usuarios conectados
const onlineUsers = new Map();

io.on('connection', (socket) => {
    console.log('🟢 New client connected:', socket.id);

    // Cuando el usuario se identifica
    socket.on('addUser', (userId) => {
        onlineUsers.set(userId, socket.id);
        console.log('👤 Usuario conectado:', userId);
    });

    // Cuando se envía un mensaje
    socket.on('sendMessage', ({ senderId, receiverId, content }) => {
        const receiverSocketId = onlineUsers.get(receiverId);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit('getMessage', {
                senderId,
                content,
                timestamp: new Date()
            });
        }
    });

    socket.on('disconnect', () => {
        console.log('🔴 Cliente desconectado:', socket.id);

        // Eliminar usuario de onlineUsers
        for (let [userId, socketId] of onlineUsers) {
            if (socketId === socket.id) {
                onlineUsers.delete(userId);
                break;
            }
        }
    });
});

server.listen(config.PORT, () => {
    logger.info(`🚀 Server running on port ${config.PORT}`);
});

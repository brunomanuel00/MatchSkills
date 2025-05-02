const { io } = require('socket.io-client');

const socket = io('http://localhost:3001', {
    withCredentials: true
});

socket.on('connect', () => {
    console.log('✅ Conectado al servidor:', socket.id);

    socket.emit('addUser', 'user123');
    socket.emit('sendMessage', {
        senderId: 'user123',
        receiverId: 'user456',
        content: 'Hola desde el cliente de prueba'
    });
});

socket.on('getMessage', (msg) => {
    console.log('📨 Mensaje recibido:', msg);
});

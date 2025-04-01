const userRouter = require('express').Router()
const User = require('../models/User')
const { userExtractor } = require('../utils/middleware')
const { upload, handleMulterError, handleAvatarUpload } = require('./cloudinary')

userRouter.get('/', userExtractor, async (request, response) => {
    const users = await User.find({})
    response.json(users)
})

userRouter.get('/:id', userExtractor, async (request, response) => {
    const user = await User.findById(request.params.id)
    response.json(user)
})

userRouter.post('/',)

userRouter.delete('/:id', userExtractor, async (request, response) => {

    const userIdToDelete = request.params.id;
    const userRequesting = request.user;

    if (userRequesting.id !== userIdToDelete && userRequesting.role !== 'admin') {
        const error = new Error('No tienes permisos para eliminar este usuario');
        error.name = 'UnauthorizedError';
        throw error;
    }

    await User.findByIdAndDelete(userIdToDelete);

    response.status(204).end();
})

userRouter.patch("/:id", userExtractor, upload.single('avatar'), handleMulterError, async (request, response) => {

    const userId = request.params.id;
    const requestingUser = request.user;
    const updateData = request.body;

    if (requestingUser.id !== userId && requestingUser.rol !== 'admin') {
        return response.status(403).json({
            error: 'No autorizado: Solo puedes editar tu propio perfil o necesitas ser admin'
        });
    }

    const user = await User.findById(userId);
    if (!user) {
        return response.status(404).json({ error: 'Usuario no encontrado' });
    }

    const updates = {};

    // Campos básicos (solo si vienen en el request)
    if (updateData.name !== undefined) updates.name = updateData.name;
    if (updateData.email !== undefined) updates.email = updateData.email;
    if (updateData.skills !== undefined) updates.skills = updateData.skills;
    if (updateData.lookingFor !== undefined) updates.lookingFor = updateData.lookingFor;

    // Manejo especial del avatar
    if (request.file) {
        // Subir nueva imagen
        updates.avatar = await handleAvatarUpload(request.file, userId);
    } else if (updateData.avatar === null || updateData.avatar === '') {
        // Restablecer a avatar por defecto si se envía explícitamente como null o vacío
        updates.avatar = {
            public_id: 'default_avatar',
            url: process.env.DEFAULT_AVATAR_URL
        };
    }
    // Si no se envía nada sobre el avatar, se mantiene el existente

    // Cambio de contraseña
    if (updateData.password) {
        if (updateData.password.length < 8) {
            return response.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
        }
        updates.passwordHash = await bcrypt.hash(updateData.password, 10);
    }

    // Actualización de rol (solo admin)
    if (updateData.rol && requestingUser.rol === 'admin') {
        updates.rol = updateData.rol;
    }

    // Aplicar actualizaciones
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updates },
        { new: true, runValidators: true }
    );

    // Preparar respuesta
    const userResponse = updatedUser.toObject();
    delete userResponse.passwordHash;
    delete userResponse.__v;

    response.json(userResponse);

})

module.exports = userRouter
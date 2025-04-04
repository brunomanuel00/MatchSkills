const userRouter = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
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

userRouter.patch("/:id",
    userExtractor,
    upload.single('avatar'),
    handleMulterError,
    async (request, response) => {

        const userId = request.params.id;
        const requestingUser = request.user;
        const updateData = request.body;

        // Validación de permisos
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

        // Campos básicos
        if (updateData.name !== undefined) updates.name = updateData.name;
        if (updateData.email !== undefined) updates.email = updateData.email;

        // Validación de skills
        if (updateData.skills !== undefined) {
            try {
                updates.skills = typeof updateData.skills === 'string'
                    ? JSON.parse(updateData.skills)
                    : updateData.skills;
                if (!Array.isArray(updates.skills)) {
                    throw new Error();
                }
            } catch (e) {
                return response.status(400).json({ error: 'Formato inválido para skills' });
            }
        }

        // Validación de lookingFor
        if (updateData.lookingFor !== undefined) {
            try {
                updates.lookingFor = typeof updateData.lookingFor === 'string'
                    ? JSON.parse(updateData.lookingFor)
                    : updateData.lookingFor;
                if (!Array.isArray(updates.lookingFor)) {
                    throw new Error();
                }
            } catch (e) {
                return response.status(400).json({ error: 'Formato inválido para lookingFor' });
            }
        }

        // Manejo de avatar
        if (request.file) {
            updates.avatar = await handleAvatarUpload(request.file, userId);
        } else if (updateData.avatar === '' || updateData.avatar === null) {
            updates.avatar = {
                public_id: 'default_avatar',
                url: process.env.DEFAULT_AVATAR_URL
            };
        }

        // Validación de password
        if (updateData.password) {
            if (typeof updateData.password !== 'string' || updateData.password.length < 8) {
                return response.status(400).json({
                    error: 'La contraseña debe ser un string con al menos 8 caracteres'
                });
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
    });

module.exports = userRouter
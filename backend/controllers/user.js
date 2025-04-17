const userRouter = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const { userExtractor } = require('../utils/middleware')
const { upload, handleMulterError, handleAvatarUpload } = require('./cloudinary')

userRouter.get('/', userExtractor, async (_request, response) => {
    const users = await User.find({})
    response.json(users)
})

userRouter.post('/array_users', userExtractor, async (request, response) => {
    const users = request.body;
    const userRequesting = request.user;

    if (userRequesting.rol !== 'admin') {
        const error = new Error("You don't have permission for change user");
        error.name = 'UnauthorizedError';
        throw error;
    }

    if (!Array.isArray(users)) {
        return response.status(400).json({ error: 'Invalid format. Expected an array of users.' });
    }

    try {
        const saltRounds = 10;

        const createdUsers = await Promise.all(
            users.map(async user => {
                const { name, email, password, skills, lookingFor, rol, avatar } = user;

                if (!name || !email || !password) {
                    throw new Error(`Missing required fields for user: ${name || email}`);
                }

                if (password.length < 8) {
                    throw new Error(`Password too short for user: ${email}`);
                }

                const existEmail = await User.findOne({ email });

                if (existEmail) {
                    throw new Error(`Email already exists: ${email}`);
                }

                if (rol === 'admin') {
                    throw new Error(`Attempt to create admin user: ${email}`);
                }

                const passwordHash = await bcrypt.hash(password, saltRounds);

                const newUser = new User({
                    name,
                    email,
                    passwordHash,
                    skills,
                    lookingFor,
                    rol,
                    avatar
                });

                return await newUser.save();
            })
        );

        response.status(201).json({ success: true, count: createdUsers.length, users: createdUsers });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});


userRouter.get('/:id', userExtractor, async (request, response) => {
    const user = await User.findById(request.params.id)
    response.json(user)
})

userRouter.delete('/array_users', userExtractor, async (request, response) => {

    const userRequesting = request.user;

    if (userRequesting.rol !== 'admin') {
        const error = new Error("You don't have permission for change user");
        error.name = 'UnauthorizedError';
        throw error;
    }

    await User.findByIdAndDelete(userIdToDelete);

    response.status(204).end();
})


userRouter.delete('/:id', userExtractor, async (request, response) => {

    const userIdToDelete = request.params.id;
    const userRequesting = request.user;

    if (userRequesting.id !== userIdToDelete && userRequesting.rol !== 'admin') {
        const error = new Error("You don't have permission for change user");
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

    // Validación de permisos
    if (requestingUser.id !== userId && requestingUser.rol !== 'admin') {
        return response.status(403).json({
            error: 'Unauthorized: You can only edit your own profile or you need to be an admin.'
        });
    }

    const user = await User.findById(userId);
    if (!user) {
        return response.status(404).json({ error: 'User not found' });
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
            return response.status(400).json({ error: 'Invalid format for skills' });
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
            return response.status(400).json({ error: 'Invalid format for lookingFor' });
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
                error: 'The password could not be updated.'
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
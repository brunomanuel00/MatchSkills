const userRouter = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const { userExtractor } = require('../utils/middleware')
const { upload, handleMulterError, handleAvatarUpload } = require('./cloudinary')
const Match = require('../models/Match')

userRouter.get('/', userExtractor, async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1; // Base 10 explícita
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        // Añadir validación numérica
        if (isNaN(page) || isNaN(limit)) {
            return res.status(400).json({ error: 'Parámetros inválidos' });
        }

        const [users, total] = await Promise.all([
            User.find({}).skip(skip).limit(limit).lean(),
            User.countDocuments()
        ]);

        // Forzar tipo numérico
        const numericTotal = Number(total);
        const totalPages = Math.ceil(numericTotal / limit);
        // console.log("Estos son los users", await User.find({}))
        // const usersTotal = await User.find({})
        // res.json(usersTotal)

        res.json({
            users: users.map(user => ({
                ...user,
                // Transformación adicional por si acaso
                id: user._id ? user._id.toString() : user.id,
                _id: undefined
            })),
            pagination: {
                total: numericTotal, // <- Asegurar número
                totalPages,
                currentPage: page,
                pageSize: limit
            }
        });

    } catch (error) {
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});

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

                const savedUser = await newUser.save();

                await fetch('http://localhost:3001/api/matches/calculate', {
                    method: 'POST',
                    headers: {
                        'Cookie': `token=${request.cookies.token}`
                    }
                });
                return savedUser;
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
    try {
        // 1. Verificar usuario autenticado
        const userRequesting = request.user;
        if (!userRequesting) {
            return response.status(401).json({ error: 'token missing or invalid' });
        }

        // 2. Validar rol de administrador
        if (userRequesting.rol !== 'admin') {
            const error = new Error("Requires admin privileges");
            error.name = 'AuthorizationError';
            error.status = 403;
            throw error;
        }

        // 3. Validar estructura del body
        const { ids } = request.body;

        if (!Array.isArray(ids)) {
            return response.status(400).json({
                error: 'Invalid request format: expected array of user IDs'
            });
        }

        if (ids.length === 0) {
            return response.status(400).json({
                error: 'No users selected for deletion'
            });
        }

        // 4. Prevenir auto-eliminación
        if (ids.includes(userRequesting.id)) {
            return response.status(403).json({
                error: 'Admin users cannot delete themselves'
            });
        }

        // 5. Eliminar usuarios y obtener resultado
        const deleteResult = await User.deleteMany({
            _id: { $in: ids },
            rol: { $ne: 'admin' } // Prevenir eliminación de otros admins
        });

        await Match.updateMany(
            { 'matches.id': { $in: ids } },
            { $pull: { matches: { id: { $in: ids } } } }
        );

        await Match.deleteMany({ userId: { $in: ids } });

        // 6. Verificar si se eliminaron todos los solicitados
        if (deleteResult.deletedCount === 0) {
            return response.status(404).json({
                error: 'No valid users found for deletion',
                details: 'Users may be admin or non-existent'
            });
        }

        // 7. Respuesta exitosa
        response.status(204).end();

    } catch (error) {
        response.status(400).json({ error: error.message })
    }
});


userRouter.delete('/:id', userExtractor, async (request, response) => {

    const userIdToDelete = request.params.id;
    const userRequesting = request.user;

    if (userRequesting.id !== userIdToDelete && userRequesting.rol !== 'admin') {
        const error = new Error("You don't have permission for change user");
        error.name = 'UnauthorizedError';
        throw error;
    }

    await User.findByIdAndDelete(userIdToDelete);

    await Match.updateMany(
        { 'matches.id': userIdToDelete },
        { $pull: { matches: { id: userIdToDelete } } }
    );

    await Match.deleteOne({ userIdToDelete });

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
    if (updateData.lookingFor !== undefined) {
        fetch('http://localhost:3001/api/matches/calculate', { // Ajusta la URL de tu servidor si es diferente
            method: 'POST',
            headers: {
                'Cookie': `token=${request.cookies.token}` // Envía la cookie para la autenticación
            }
        });
    }
});

module.exports = userRouter
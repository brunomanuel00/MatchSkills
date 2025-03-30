const userRouter = require('express').Router()
const User = require('../models/User')
const middleware = require('../utils/middleware')


userRouter.get('/', async (_request, response) => {
    const users = await User.find({})
    response.json(users)
})

userRouter.get('/:id', middleware.userExtractor, middleware.tokenExtractor, async (request, response) => {
    const user = await User.findById(request.params.id)
    response.json(user)
})

userRouter.delete('/:id', middleware.userExtractor, async (request, response) => {

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

userRouter.patch("/:id", middleware.userExtractor, async (request, response) => {

    const userId = request.params.id;
    const requestingUser = request.user;
    const updateData = request.body;

    if (requestingUser.id !== userId && requestingUser.rol !== 'admin') {
        return response.status(403).json({
            error: 'No autorizado: Solo puedes editar tu propio perfil o necesitas ser admin'
        });
    }

    // 2. Buscar usuario a actualizar
    const user = await User.findById(userId);
    if (!user) {
        return response.status(404).json({ error: 'Usuario no encontrado' });
    }

    // 3. Actualización segura
    const allowedUpdates = {
        name: updateData.name,
        email: updateData.email,
        skills: updateData.skills,
        lookingFor: updateData.lookingFor,
        avatar: updateData.avatar
    };

    // 4. Cambio de contraseña (si se proporciona)
    if (updateData.password) {
        if (updateData.password.length < 8) {
            return response.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
        }
        allowedUpdates.passwordHash = await bcrypt.hash(updateData.password, 10);
    }

    // 5. Actualizar rol (solo admin)
    if (updateData.rol && requestingUser.rol === 'admin') {
        allowedUpdates.rol = updateData.rol;
    }

    // 6. Aplicar actualizaciones
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: allowedUpdates },
        { new: true, runValidators: true }
    );

    // 7. Preparar respuesta (sin datos sensibles)
    const userResponse = updatedUser.toObject();
    delete userResponse.passwordHash;
    delete userResponse.__v;

    response.json(userResponse);


})



module.exports = userRouter
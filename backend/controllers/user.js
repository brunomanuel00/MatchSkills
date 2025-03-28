const userRouter = require('express').Router()
const User = require('../models/User')
const middleware = require('../utils/middleware')

userRouter.get('/', async (_request, response) => {
    const users = await User.find({})
    response.json(users)
})

userRouter.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id)
    res.json(user)
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



module.exports = userRouter
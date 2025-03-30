const logger = require('./logger')
const morgan = require('morgan')
const User = require('../models/User')
const jwt = require('jsonwebtoken')

morgan.token('body', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : '';
});

const morganMiddleware = morgan(':method :url :status - :response-time ms :body');


const unknownEndpoint = (_request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};

const tokenExtractor = (request, _response, next) => {
    const authorization = request.get('Authorization');
    if (authorization && authorization.startsWith('Bearer ')) {
        request.token = authorization.replace('Bearer ', '')
    } else {
        request.token = null;
    }
    next();
}

const userExtractor = async (request, response, next) => {
    const token = request.cookies.token;

    if (!token) {
        return response.status(401).json({ error: 'no token provided' });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' });
    }

    const user = await User.findById(decodedToken.id);
    if (!user) {
        return response.status(401).json({ error: 'user not found' });
    }

    request.user = user;
    next();
}

const errorHandler = (error, _request, response, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    if (error.name === 'MongooseError') {
        return response.status(500).send({
            error: 'error to get the information'
        });
    }
    if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message });
    }
    if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
        return response.status(400).json({ error: 'expected `username` to be unique' })
    }
    if (error.name === 'UnauthorizedError') {
        return response.status(403).json({ error: error.message });
    }
    if (error.name === 'TokenExpiredError') {
        return response.status(401).json({ error: 'token expired' });
    }
    if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({ error: 'invalid token' });
    }
    if (error.code === 11000) {
        return response.status(400).json({ error: 'mail exist' });
    }

    next(error);
}

module.exports = {
    morganMiddleware,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor
}
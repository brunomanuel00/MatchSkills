const express = require('express')
const app = express()
require('express-async-errors')
const cors = require('cors')
const authRoutes = require('./controllers/auth')
const userRoutes = require('./controllers/user')
const matchRoutes = require('./controllers/match')
const messageRoutes = require('./controllers/message');
const cookieParser = require('cookie-parser');
const middleware = require('./utils/middleware')
const config = require('./utils/config')
const mongoose = require('mongoose')
const logger = require('./utils/logger')

mongoose.set('strictQuery', false)

const url = config.MONGODB_URI

logger.info(url)

mongoose.connect(url)
    .then(_result => {
        logger.info('Connected to MongoDB')
    })
    .catch(error => {
        logger.error('error connecting to MongoDB:', error)
    })

const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:3001'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Origen no permitido por CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json())
app.use(cookieParser());
app.use(middleware.morganMiddleware)
// app.use(middleware.userExtractor)
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/matches', matchRoutes)
app.use('/api/messages', messageRoutes);

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
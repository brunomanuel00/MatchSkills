const express = require('express')
const app = express()
require('express-async-errors')
const cors = require('cors')
const authRoutes = require('./controllers/auth')
const userRoutes = require('./controllers/user')
const middleware = require('./utils/middleware')
const config = require('./utils/config')
const mongoose = require('mongoose')
const logger = require('./utils/logger')

mongoose.set('strictQuery', true)

const url = config.MONGODB_URI

logger.info(url)

mongoose.connect(url)
    .then(_result => {
        logger.info('Connected to MongoDB')
    })
    .catch(error => {
        logger.error('error connecting to MongoDB:', error)
    })

app.use(cors())
app.use(express.json())
app.use(middleware.morganMiddleware)
app.use(middleware.tokenExtractor)
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
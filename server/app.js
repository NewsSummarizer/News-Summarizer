const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const helmet = require('helmet')
const routes = require('./routes')
const errorMiddleware = require('./middlewares/error.middleware')

const app = express()

const logger = require('./middlewares/logger.middleware')

app.use(express.json())
app.use(cookieParser())

app.use(helmet())
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))

app.use(logger)

app.use('/api', routes)

app.use(errorMiddleware)

module.exports = app
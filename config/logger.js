const express = require('express')
const winston = require('winston')
const expresswinston = require('express-winston')
require('winston-mongodb')
require('dotenv').config()

const app = express()

const logger = app.use(expresswinston.logger({
    statusLevels: true,
    transports: [
        new winston.transports.File({
            level: "error",
            json: true,
            db: process.env.mongoURL
        })
    ],
    
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    )
}))


module.exports = { logger }
import App from './src/app'

import * as bodyParser from 'body-parser'
import loggerMiddleware from './src/middleware/logger'
import  UssdController  from './src/controllers/ussd.controller'


import * as dotenv from "dotenv";
import * as path from "path";
const http = require('http');
const https = require('https');
dotenv.config();
const app = new App({
    port: process.env.SERVER_PORT? parseInt(process.env.SERVER_PORT) : 5000,
    controllers: [
        new UssdController()
    ],
    middleWares: [
        bodyParser.urlencoded({ extended: true }),
        bodyParser.raw(),
        bodyParser.json(),
        bodyParser.text(),
        loggerMiddleware
    ]
})

app.listen()
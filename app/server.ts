import { NotFoundError } from '@prisma/client/runtime';

import cookieParser from 'cookie-parser';
import express from 'express';
import morgan from 'morgan';

import { Request, Response } from "express";

import routers from './routers';
import { ValidationError } from "./exceptions/ValidationError";
import { ApiError } from "./exceptions/ApiError";
import logger from './common/logger';
import { Prisma } from '@prisma/client';
import cdnRouter from './routers/_cdnRouter';

const app = express();

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, reason)
})

process.on('uncaughtException', err => {
    console.log(`Uncaught Exception: ${err.message}`)
})

const fileUpload = require('express-fileupload');

app.use(express.json({limit: "20mb"}))
app.use(express.urlencoded({
    limit: "20mb",
    extended: true,
    parameterLimit: 50000
}))

app.use(cookieParser());
app.use(morgan('dev'));

app.use(fileUpload());

app.use((req: Request, res: Response, next) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', process.env.APP_URL);

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, Referrer-Policy');

    res.setHeader('Access-Control-Allow-Credentials', 'true');

    res.setHeader('Access-Control-Expose-Headers', 'Set-Cookie');

    next();
});

app.use(express.static('public'));

app.use('/cdn', cdnRouter);
app.use('/api', routers);

app.use((err, req, res, next) => {
    logger.error(err, {
        context: req.context,
        body: req.body,
        query: req.query,
        params: req.params,
    });

    if (err instanceof NotFoundError) {
        const formattedError = {
            status: 404,
            message: err.message,
        }

        return res.status(404).json(formattedError);
    } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        const formattedError = {
            status: 404,
            message: err.message,
        }

        return res.status(404).json(formattedError);
    } else if (err instanceof ApiError) {
        const formattedError = {
            status: err.code,
            message: err.message,
            ...( err.errors ? { errors: err.errors}: {} ),
        }

        return res.status(err.code).json(formattedError);
    } else if (err instanceof ValidationError) {
        const formattedError = {
            status: 422,
            errors: err?.errors,
        }

        return res.status(422).json(formattedError);
    } else {
        const formattedError = {
            status: 500,
            errors: process.env.DEBUG ? err?.errors: ['An error has occurred'],
            stack: process.env.DEBUG ? err?.stack: [],
        }

        req.error = formattedError;

        return res.status(500).json(formattedError);
    }
});

export default app;
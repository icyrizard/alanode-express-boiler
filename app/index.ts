import "reflect-metadata";
require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'local'}` })

import app from './server';
import logger from "./common/logger";
import { prismaClient } from "./database/PrismaClient";

const port = Number(process.env.PORT || 80);

prismaClient.$connect().then(async () => {
    app.listen(port, () => {
        logger.info('Express server started on port: ' + port);
    });
})

export default app;

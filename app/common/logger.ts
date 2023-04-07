import { createLogger, format, transports } from 'winston';

const Sentry = require('winston-transport-sentry-node').default;

const print = format.printf((info) => {
    const log = `${info.level}: ${info.message}`;

    return info.stack
        ? `${log}\n${info.stack}`
        : log;
});

const options = {
    sentry: {
        dsn: process.env.SENTRY_DSN,
    },
    level: process.env.LOG_LEVEL || 'info',
};

const transporters = [
    new transports.Console(),
];

if (process.env.ENVIRONMENT !== 'local') {
    console.log('Setting sentry logger');
    transporters.push(new Sentry(options));
}

const logger = createLogger({
    defaultMeta: {
        service: `${process.env.SERVICE_NAME}-${process.env.ENVIRONMENT}`,
    },
    format: format.combine(
        format.errors({ stack: true }),
        print,
    ),
    transports: transporters,
});


export default logger;
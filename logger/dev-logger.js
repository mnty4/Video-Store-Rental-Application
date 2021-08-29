const { format, createLogger, transports } = require('winston');
const { timestamp, combine, printf, json, splat, colorize, errors } = format;
const path = require('path');

function buildDevLogger() {
    const logFormat = printf(({ level, message, timestamp, stack }) => {
        return `${timestamp} ${level}: ${stack || message}`;
    });
    
    return createLogger({
        transports: [
            new transports.Console({
                format: combine(
                    colorize(),
                    timestamp({ format: 'YYYY-MM-DD HH:mm:ss'}),
                    errors({ stack: true }),
                    logFormat),
                level: 'info',
                handleExceptions: true,
                handleRejections: true,
            }),
            new transports.File({
                filename: path.join(__dirname, '../logs/combined.log'),
                format: json(),
                handleExceptions: true,
                handleRejections: true,
            }),
            new transports.File({
                filename: path.join(__dirname, '../logs/error.log'),
                format: combine(json(), timestamp(), splat()),
                level: 'error',
                handleExceptions: true,
                handleRejections: true,
            })
        ],
    });
}

module.exports = buildDevLogger;
const { format, createLogger, transports } = require('winston');
const { timestamp, combine, errors, json } = format;
const path = require('path');

function buildProdLogger() {
    
    return createLogger({ 
        defaultMeta: { service: 'user-service' },
        transports: [
            new transports.Console({format: 
                combine(
                timestamp(),
                errors({ stack: true }),
                json()
            )}),
            new transports.File({
                filename: path.join(__dirname, '../logs/combined.log'),
                format: json(),
                handleExceptions: true,
                handleRejections: true,
            }),
            new transports.File({
                filename: path.join(__dirname, '../logs/error.log'),
                format: combine(json(), timestamp()),
                level: 'error',
                handleExceptions: true,
                handleRejections: true,
            })
        ]
    });

    
}

module.exports = buildProdLogger;
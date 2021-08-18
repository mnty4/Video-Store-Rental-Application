const buildDevLogger = require('./dev-logger');
const buildProdLogger = require('./prod-logger');

let logger = null;
if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    logger = buildDevLogger();
} else {
    logger = buildProdLogger();
}

module.exports = logger;
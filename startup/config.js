const config = require('config');

module.exports = function(logger) {
    if (!config.get('jwtPrivateKey')) {
        logger.error('FATAL ERROR: jwtPrivateKey is not defined.');
        process.exit(1);
    }
}
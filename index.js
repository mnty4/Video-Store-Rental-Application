const logger = require('./logger');
const express = require('express');
const app = express();

require('./startup/middleware')(app)
require('./startup/db')(logger);
require('./startup/routes')(app);
require('./startup/config')(logger);
require('./startup/validation.js')();

const port = process.env.PORT || 3000;
const server = app.listen(port, () => logger.info(`listening at port: ${port}...`));

module.exports = server;
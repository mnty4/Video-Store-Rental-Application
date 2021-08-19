const logger = require('./logger');
const express = require('express');
const app = express();

require('./startup/db')();
require('./startup/prod')(app);
require('./startup/routes')(app);
require('./startup/config')();
require('./startup/validation.js')();

const port = process.env.PORT || 3000;
const server = app.listen(port, () => logger.info(`listening at port ${port}...`));

module.exports = server;
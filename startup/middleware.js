const startupDebugger = require('debug')('app:startup');
const morgan = require('morgan');
const helmet = require('helmet');
const express = require('express');
const logger = require('../logger');

module.exports = function(app) {
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static('public'));
    app.use(helmet());
    
    if(process.env.NODE_ENV === 'development') {
        app.use(morgan('tiny'));
        logger.debug('morgan enabled');
    }
    //logger.info(app.get('NODE_ENV') == process.env.NODE_ENV);
}


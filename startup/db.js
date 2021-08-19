const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');
const logger = require('../logger');

module.exports = function() {
    const db = config.get('db');
    mongoose.connect(db, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true, 
        useFindAndModify: false, 
        useCreateIndex: true 
    })    
        .then(() => logger.info(`connected to ${db}...`));
}
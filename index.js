const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const startupDebugger = require('debug')('app:startup');
const morgan = require('morgan');
const helmet = require('helmet');

const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');

const express = require('express');
const app = express();

const url = process.env.url || 'mongodb://localhost/vidley';

mongoose.connect(url, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useFindAndModify: false, 
    useCreateIndex: true 
})
    .then(console.log('connected to mongoDB...'))
    .catch(err => console.error(err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());

if(app.get('env') === 'development') {
    app.use(morgan('tiny'));
    startupDebugger('Morgan enabled...');
}

app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);




const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening at port: ${port}...`));
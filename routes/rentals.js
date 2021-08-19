const { Rental, validate } = require('../models/rental');
const { Movie } = require('../models/movie');
const { Genre } = require('../models/genre');
const { Customer } = require('../models/customer');
const auth = require('../middleware/auth');

const mongoose = require('mongoose');
const Fawn = require('fawn');
const express = require('express');
const router = express.Router();

Fawn.init(mongoose);

router.get('/', auth, async(req, res) => {
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
});

router.post('/', async(req, res) => {
    const { error } = await validate(req.body);
    if(error) return res.status(400).send(error.message);

    const customer = await Customer.findById(req.body.customerId);
    if(!customer) return res.status(400).send('invalid customerId');

    const movie = await Movie.findById(req.body.movieId);
    if(!movie) return res.status(400).send('invalid movieId');

    if(movie.numberInStock === 0) return res.status(400).send('movie not in stock');
    
    const rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });

    try {
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', { _id: movie._id }, {
                $inc: { numberInStock: -1 }
            })
            .run();

        res.send(rental);
    }
    catch(ex) {
        res.status(500).send('Something failed.');
    }
    
    
   
    
    
});


module.exports = router;
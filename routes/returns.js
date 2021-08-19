const validate = require('../middleware/validate');
const validateAsyncWrapper = require('../middleware/validateAsyncWrapper');
const Joi = require('joi');
const auth = require('../middleware/auth');
const {Rental} = require('../models/rental');
const {Movie} = require('../models/movie');
const express = require('express');
const router = express.Router();

const validateReturn = validateAsyncWrapper(async (req) => {
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    });
    await schema.validateAsync(req.body); 
});

router.post('/', [auth, validate(validateReturn)], async (req, res) => {
    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

    if(!rental) return res.status(404).send('rental not found');
    if(rental.dateReturned) return res.status(400).send('return already processed');

    rental.return();
    await rental.save();

    await Movie.updateOne({ _id: rental.movie._id }, {
        $inc: { numberInStock: 1 }
    });

    return res.send(rental);
});

module.exports = router;
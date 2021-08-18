const { Movie, validate } = require('../models/movie');
const { Genre } = require('../models/genre');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async(req, res) => {
    const movies = await Movie.find().sort({ title: 1 })
    res.send(movies);
});

router.get('/:id', async(req, res) => {
    const movie = await Movie.findById(req.params.id);
    if(!movie) return res.status(404)
        .send('no movies with that ID could be found');

    res.send(movie);
});

router.post('/', auth, async(req, res) => {
    const { error } = await validate(req.body);
    if(error) return res.status(400).send(error.message);

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(400).send('invalid genre');

    const movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });
    await movie.save();

    res.send(movie);
});

router.put('/:id', auth, async (req, res) => {
    const { error } = await validate(req.body);
    if(error) return res.status(400).send(error.message);

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(400).send('invalid genre');

    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        $set: {
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        }
    }, { new: true });

    if(!customer) return res.status(404)
        .send('no movies with that ID could be found');

    res.send(customer);
});

router.delete('/:id', auth, async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if (!customer) return res.status(404)
        .send('no movies with that ID could be found');
    res.send(customer);
});
module.exports = router;
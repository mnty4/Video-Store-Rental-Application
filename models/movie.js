const mongoose = require('mongoose');
const Joi = require('joi');
const { genreSchema } = require('./genre');

const Movie = mongoose.model('Movie', new mongoose.Schema({
    title: {
        type: String,
        minlength: 3,
        maxlength: 255,
        required: true,
        trim: true
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    }
}));

async function validateMovie(movie) {
    try {
        const schema = Joi.object({
            title: Joi.string().min(3).max(255).required(),
            genreId: Joi.objectId().required(),
            numberInStock: Joi.number().min(0).max(255),
            dailyRentalRate: Joi.number().min(0).max(255)
        })
    
        return await schema.validateAsync(movie);
    }
    catch(e) {
        return {
            error: {
                message: e.details[0].message,
                obj: e
            }
        };
    }
    
}

exports.Movie = Movie;
exports.validate = validateMovie;
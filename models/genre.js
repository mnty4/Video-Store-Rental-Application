const mongoose = require('mongoose');
const Joi = require('joi');
const validateAsyncWrapper = require('../middleware/validateAsyncWrapper');

const genreSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    }
});
const Genre = mongoose.model('Genre', genreSchema);

async function validateGenre(genre) {
    try {
        const schema = Joi.object({
            name: Joi.string().min(3).max(50).required()
        });
        return await schema.validateAsync(genre);
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

exports.Genre = Genre;
exports.genreSchema = genreSchema;
exports.validateGenre = validateAsyncWrapper(async (req) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required()
    });
    await schema.validateAsync(req.body);
});
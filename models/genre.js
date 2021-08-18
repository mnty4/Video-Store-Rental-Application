const mongoose = require('mongoose');
const Joi = require('joi');

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
exports.validate = validateGenre;
exports.genreSchema = genreSchema;
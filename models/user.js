const mongoose = require('mongoose');
const Joi = require('joi');

const User = mongoose.model('User', new mongoose.Schema({
    name: {
        type: String,
        minlength: 5,
        maxlength: 50,
        require: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    }
}));

async function validateUser(user) {
    try {
        const schema = Joi.object({
            name: Joi.string().min(5).max(50).required(),
            email: Joi.string().min(5).max(255).required().email(),
            password: Joi.string().min(5).max(255).required()
        });
        return await schema.validateAsync(user);
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

exports.User = User;
exports.validate = validateUser;
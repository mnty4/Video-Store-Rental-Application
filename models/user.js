const mongoose = require('mongoose');
const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
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
    },
    isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
    return token;
}

const User = mongoose.model('User', userSchema);

async function validateUser(user) {
    try {
        
        const schema = Joi.object({
            name: Joi.string().min(3).max(50).required(),
            email: Joi.string().min(5).max(255).required().email(),
            password: passwordComplexity({
                min: 10,
                max: 30,
                lowerCase: 1,
                upperCase: 1,
                numeric: 1,
                symbol: 1,
                requirementCount: 3,
            })
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
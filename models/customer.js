const mongoose = require('mongoose');
const Joi = require('joi');

const Customer = mongoose.model('Customer', new mongoose.Schema({
    isGold: {
        type: Boolean, 
        default: false
    },
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    phone: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    }
}));

async function validateCustomer(customer) {
    try {
        const schema = Joi.object({
            isGold: Joi.boolean(),
            name: Joi.string().min(3).max(50).required(),
            phone: Joi.string().min(3).max(50).required()
        });
        return await schema.validateAsync(customer);
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

exports.Customer = Customer
exports.validate = validateCustomer;
const mongoose = require('mongoose');
const Joi = require('joi');
const moment = require('moment');

const rentalSchema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minlength: 3,
                maxlength: 50
            },
            isGold: {
                type: Boolean,
                default: false
            },
            phone: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50
            }
        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                minlength: 3,
                maxlength: 255,
                required: true,
                trim: true
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 255
            }
        }),
        required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
});

rentalSchema.statics.lookup = function(customerId, movieId) {
    return this.findOne({
    'customer._id': customerId,
    'movie._id': movieId
});
}

rentalSchema.methods.return = function() {
    this.dateReturned = new Date();
    
    const daysRented = moment().diff(this.dateOut, 'days');
    this.rentalFee = daysRented * this.movie.dailyRentalRate;
}

const Rental = mongoose.model('Rental', rentalSchema);


async function validateRental(rental) {
    try {
        const schema = Joi.object({
            customerId: Joi.objectId().required(),
            movieId: Joi.objectId().required()
        });
        return await schema.validateAsync(rental);
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

exports.Rental = Rental;
exports.validate = validateRental;
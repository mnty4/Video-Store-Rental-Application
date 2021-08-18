const { User } = require('../models/user');

const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = await validate(req.body);
    if(error) return res.status(400).send(error.message);

    let user = await User.findOne({ email: req.body.email });
    if(!user) return res.status(400).send('Invalid email or password');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid email or password');

    const token = user.generateAuthToken();
    res.send(token);
});

async function validate(req) {
    try {
        
        const schema = Joi.object({
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
        return await schema.validateAsync(req);
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

module.exports = router;
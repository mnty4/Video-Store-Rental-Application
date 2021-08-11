const { User, validate } = require('../models/user');
const _ = require('lodash');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    res.send(await User.find().sort({ name: 1 }));
});

router.post('/', async (req, res) => {
    const { error } = await validate(req.body);
    if(error) return res.status(400).send(error.message);

    let user = await User.findOne({ email: req.body.email });
    if(user) return res.status(400).send('User already registered.');

    user = new User(_.pick(req.body, ['name', 'email', 'password']));

    await user.save()

   

    res.send( _.pick(user, ['_id', 'name', 'email']));
});

module.exports = router;
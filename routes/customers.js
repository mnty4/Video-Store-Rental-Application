const { Customer, validate } = require('../models/customer');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', auth, async (req, res) => {
    const customers = await Customer.find().sort({ name: 1 });
    res.send(customers);
});

router.get('/:id', auth, async (req, res) => {
    const customer = await Customer.findById(req.params.id)
    if(!customer) return res.status(404).send('No customer with that ID found');
    res.send(customer);
});

router.post('/', auth, async (req, res) => {
    const { error } = await validate(req.body);
    if(error) return res.status(400).send(error.message);

    const customer = new Customer({
        isGold: req.body.isGold,
        name: req.body.name,
        phone: req.body.phone
    });
    
    await customer.save();
    res.send(customer);
});

router.put('/:id', auth, async (req, res) => {
    const { error } = await validate(req.body);
    if(error) return res.status(400).send(error.message);

    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        $set: {
            isGold: req.body.isGold,
            name: req.body.name,
            phone: req.body.phone
        }
    }, { new: true });

    if(!customer) return res.status(404).send('No customer with that ID found');

    res.send(customer);
});

router.delete('/:id', auth, async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if (!customer) return res.status(404).send('No customer with that ID found');
    res.send(customer);
});



module.exports = router;
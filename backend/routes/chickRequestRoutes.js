const express = require('express');
const router = express.Router();

const request = require('../models/request');

router.post('/', async (req, res) => {
    try {
        const newRequest = new request(req.body);
        let existingRequest = await request.findOne({ farmerName: req.body.farmerName });
        if (existingRequest) {
            return res.status(409).json({ error: 'cant make a request now' });
        }
        await newRequest.save();
        return res.json({ success: true });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'error try again' });
    }
});

module.exports = router;

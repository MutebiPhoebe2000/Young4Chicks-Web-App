const express = require('express');
const router = express.Router();

const FeedsRequest = require('../models/feedsModels');

router.post('/', async (req, res) => {
    try {
        const { farmerName, farmerNIN, quantityFeeds, typeFeeds, farmerType } = req.body;
        const newRequest = new FeedsRequest({
            farmerName,
            farmerNIN,
            quantityFeeds: Number(quantityFeeds),
            typeFeeds,
            farmerType
        });
        await newRequest.save();
        return res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'error try again' });
    }
});

// Route to update a specific feeds request by ID
router.put('/:id', async (req, res) => {
    try {
        const { farmerName, farmerNIN, quantityFeeds, typeFeeds, farmerType } = req.body;
        const updatedFeeds = await FeedsRequest.findByIdAndUpdate(
            req.params.id,
            { farmerName, farmerNIN, quantityFeeds, typeFeeds, farmerType },
            { new: true }
        );

        if (!updatedFeeds) {
            return res.status(404).json({ error: 'Feeds not found' });
        }

        res.json(updatedFeeds);
    } catch (error) {
        console.error('Error updating feeds:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to get a specific feeds request by ID - must be last to avoid conflicts
router.get('/:id', async (req, res) => {
    try {
        const feeds = await FeedsRequest.findById(req.params.id);
        if (!feeds) {
            return res.status(404).json({ error: 'Feeds not found' });
        }
        res.json(feeds);
    } catch (error) {
        console.error('Error fetching feeds:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

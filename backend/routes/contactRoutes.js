const express = require('express');
const router = express.Router();

const Contact = require('../models/Contact');
const { ensureAdmin } = require('../middleware/authMiddleware');

router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const newContact = new Contact({ name, email, subject, message });
        await newContact.save();
        res.json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Contact submit error:', error);
        res.status(500).json({ error: 'Failed to send message, please try again' });
    }
});

router.get('/', ensureAdmin, async (req, res) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });
        res.json({ messages });
    } catch (error) {
        console.error('Contact list error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/:id/read', ensureAdmin, async (req, res) => {
    try {
        const updated = await Contact.findByIdAndUpdate(req.params.id, { status: 'Read' }, { new: true });
        if (!updated) {
            return res.status(404).json({ error: 'Message not found' });
        }
        res.json({ success: true, message: updated });
    } catch (error) {
        console.error('Contact mark-read error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;

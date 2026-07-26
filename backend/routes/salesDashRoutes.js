const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Lead = require('../models/Lead');
const request = require('../models/request');
const { ensureSalesRep } = require('../middleware/authMiddleware');

router.get('/dashboard', ensureSalesRep, async (req, res) => {
    try {
        const clients = await User.find({ userFRole: 'Farmer' }).sort({ createdAt: -1 });
        const leads = await Lead.find({ salesRep: req.user._id }).sort({ createdAt: -1 });
        const orders = await request.find().sort({ createdAt: -1 });

        const totalSales = orders.filter(o => o.status === 'Completed').reduce((sum, o) => sum + (o.numChicks * 2500), 0);
        const newLeadsCount = leads.filter(l => l.status === 'New').length;

        res.json({
            user: req.user,
            clients,
            leads,
            orders,
            totalSales,
            newLeadsCount,
            totalClients: clients.length
        });
    } catch (error) {
        console.error('Sales Rep dashboard error:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});

// Add New Lead
router.post('/leads', ensureSalesRep, async (req, res) => {
    try {
        const { farmName, ownerName, phoneNumber, leadSource, notes } = req.body;
        const newLead = new Lead({
            farmName,
            ownerName,
            phoneNumber,
            leadSource,
            notes,
            salesRep: req.user._id
        });
        await newLead.save();
        res.json({ success: true, message: 'Lead added' });
    } catch (error) {
        res.status(400).json({ error: 'Failed to add lead' });
    }
});

// Add New Client (Farmer)
router.post('/clients', ensureSalesRep, async (req, res) => {
    try {
        const { clientFarmName, clientOwnerName, clientEmail, clientPhone } = req.body;

        const defaultPassword = 'Password123';

        const newUser = new User({
            farmerFName: clientOwnerName,
            farmerFEmail: clientEmail,
            farmerFNumber: clientPhone,
            farmerFAddress: clientFarmName,
            userFRole: 'Farmer',
            farmerFPassword: defaultPassword,
            farmerFConfirmPassword: defaultPassword
        });

        await User.register(newUser, defaultPassword);
        res.json({ success: true, message: 'Client added' });
    } catch (error) {
        console.error('Add client error:', error);
        res.status(400).json({ error: 'Failed to add client' });
    }
});

// Convert Lead
router.post('/leads/:id/convert', ensureSalesRep, async (req, res) => {
    try {
        await Lead.findByIdAndUpdate(req.params.id, { status: 'Converted' });
        res.json({ success: true, message: 'Lead converted' });
    } catch (error) {
        res.status(400).json({ error: 'Failed to convert lead' });
    }
});

module.exports = router;

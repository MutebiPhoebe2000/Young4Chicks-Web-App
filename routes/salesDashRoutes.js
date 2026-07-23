const express = require ('express');
const router = express.Router();

// Import models
const User = require('../models/User');
const Lead = require('../models/Lead');
const request = require('../models/request');

// Middleware to check if user is logged in and is a Sales Rep
function isSalesRep(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated() && req.user.userFRole === 'SalesRep') {
    return next();
  }
  res.redirect('/login');
}

router.get('/', isSalesRep, async (req, res) => {
    try {
        // Fetch clients (Farmers)
        const clients = await User.find({ userFRole: 'Farmer' }).sort({ createdAt: -1 });
        
        // Fetch leads
        const leads = await Lead.find({ salesRep: req.user._id }).sort({ createdAt: -1 });
        
        // Fetch requests (Orders)
        const orders = await request.find().sort({ createdAt: -1 });
        
        // Stats
        const totalSales = orders.filter(o => o.status === 'Completed').reduce((sum, o) => sum + (o.numChicks * 2500), 0);
        const newLeadsCount = leads.filter(l => l.status === 'New').length;

        res.render("salesRepDash", {
            user: req.user,
            clients,
            leads,
            orders,
            totalSales: totalSales.toLocaleString(),
            newLeadsCount,
            totalClients: clients.length
        });
    } catch (error) {
        console.error('Sales Rep dashboard error:', error);
        res.status(500).send('Server Error');
    }
});

// Add New Lead
router.post('/add-lead', isSalesRep, async (req, res) => {
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
        res.redirect('/salesDash?success=Lead added');
    } catch (error) {
        res.redirect('/salesDash?error=Failed to add lead');
    }
});

// Add New Client (Farmer)
router.post('/add-client', isSalesRep, async (req, res) => {
    try {
        // This normally would use the User.register from auth but for simplicity here:
        const { clientFarmName, clientOwnerName, clientEmail, clientPhone } = req.body;
        
        // We need a password for the new user, let's auto-generate or use a default
        const defaultPassword = 'Password123';
        
        const newUser = new User({
            farmerFName: clientOwnerName,
            farmerFEmail: clientEmail,
            farmerFNumber: clientPhone,
            farmerFAddress: clientFarmName,
            userFRole: 'Farmer',
            farmerFPassword: defaultPassword, // Placeholder, would usually be hashed or set by user
            farmerFConfirmPassword: defaultPassword
        });
        
        await User.register(newUser, defaultPassword);
        res.redirect('/salesDash?success=Client added');
    } catch (error) {
        console.error('Add client error:', error);
        res.redirect('/salesDash?error=Failed to add client');
    }
});

// Convert Lead
router.post('/convert-lead/:id', isSalesRep, async (req, res) => {
    try {
        await Lead.findByIdAndUpdate(req.params.id, { status: 'Converted' });
        res.redirect('/salesDash?success=Lead converted');
    } catch (error) {
        res.redirect('/salesDash?error=Failed to convert lead');
    }
});

module.exports = router;
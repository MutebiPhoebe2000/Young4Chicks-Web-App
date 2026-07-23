const express = require('express');
const router = express.Router();

// Import models - Simple and clear!
const User = require('../models/User');
const request = require('../models/request');
const FeedsRequest = require('../models/feedsModels');

// Middleware to check if user is logged in - Simple authentication!
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// Main dashboard route - Shows overview with stats
router.get('/', isLoggedIn, async (req, res) => {
  try {
    // Get the logged in farmer
    const farmer = req.user;
    
    // Count farmer's requests
    const totalRequests = await request.countDocuments({ farmerName: farmer.farmerFName });
    const pendingRequests = await request.countDocuments({ 
      farmerName: farmer.farmerFName, 
      status: 'Pending' 
    });
    const completedOrders = await request.countDocuments({ 
      farmerName: farmer.farmerFName, 
      status: 'Completed' 
    });
    
    // Calculate total spent based on actual requests
    const allRequests = await request.find({ farmerName: farmer.farmerFName });
    const totalSpent = allRequests.reduce((total, req) => {
      // Pricing logic: Chick = 2500, Feed (if exists) = 5000 per unit
      const chickCost = (req.numChicks || 0) * 2500;
      const feedsCost = (req.feedsQuantity || 0) * 5000;
      return total + chickCost + feedsCost;
    }, 0);
    
    // Get farmer's recent requests
    const chickRequests = await request.find({ farmerName: farmer.farmerFName })
      .sort({ createdAt: -1 })
      .limit(10);
    
    // Render dashboard with all data
    res.render('farmerDash', {
      user: farmer,
      totalRequests: totalRequests,
      pendingRequests: pendingRequests,
      completedOrders: completedOrders,
      totalSpent: totalSpent.toLocaleString(),
      chickRequests: chickRequests,
      // Payment data (simulated based on logic)
      totalPaid: Math.floor(totalSpent * 0.6).toLocaleString(),
      pendingPayment: Math.floor(totalSpent * 0.4).toLocaleString(),
      nextDue: Math.floor(totalSpent * 0.1).toLocaleString(),
      // Delivery data
      pendingDeliveries: pendingRequests,
      inTransit: 0,
      delivered: completedOrders,
      scheduled: Math.floor(pendingRequests * 0.5)
    });
    
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).send('Server Error - Please try again');
  }
});

// Route to submit new chick request
router.post('/new-request', isLoggedIn, async (req, res) => {
  try {
    const { typeChicks, numChicks, chickFeeds, feedsQuantity, farmerType, deliveryDate, notes } = req.body;
    
    // Create new request
    const newRequest = new request({
      farmerName: req.user.farmerFName,
      typeChicks: typeChicks,
      numChicks: Number(numChicks),
      chickFeeds: chickFeeds,
      feedsQuantity: feedsQuantity ? Number(feedsQuantity) : 0,
      farmerType: farmerType,
      deliveryDate: deliveryDate,
      notes: notes,
      status: 'Pending'
    });
    
    await newRequest.save();
    
    res.redirect('/farmerDash?success=Request submitted successfully!');
    
  } catch (error) {
    console.error('New request error:', error);
    res.redirect('/farmerDash?error=Failed to submit request');
  }
});

// Route to submit quick request
router.post('/quick-request', isLoggedIn, async (req, res) => {
    try {
      const { quickChickType, quickQuantity, quickDeliveryDate } = req.body;
      
      const newRequest = new request({
        farmerName: req.user.farmerFName,
        typeChicks: quickChickType,
        numChicks: Number(quickQuantity),
        farmerType: 'Returning', // Quick request assumes returning for simplicity or logic
        deliveryDate: quickDeliveryDate,
        notes: 'Quick request submitted via modal',
        status: 'Pending'
      });
      
      await newRequest.save();
      res.redirect('/farmerDash?success=Quick request submitted!');
    } catch (error) {
      console.error('Quick request error:', error);
      res.redirect('/farmerDash?error=Failed to submit quick request');
    }
});

// Route to update farmer profile
router.post('/update-profile', isLoggedIn, async (req, res) => {
  try {
    const { farmerFName, farmerFEmail, farmerFNumber, farmerFAddress } = req.body;
    
    await User.findByIdAndUpdate(req.user._id, {
      farmerFName: farmerFName,
      farmerFEmail: farmerFEmail,
      farmerFNumber: farmerFNumber,
      farmerFAddress: farmerFAddress
    });
    
    res.redirect('/farmerDash?success=Profile updated successfully!');
    
  } catch (error) {
    console.error('Profile update error:', error);
    res.redirect('/farmerDash?error=Failed to update profile');
  }
});

// Route to get request details
router.get('/request/:id', isLoggedIn, async (req, res) => {
  try {
    const requestDetails = await request.findById(req.params.id);
    
    if (!requestDetails) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    if (requestDetails.farmerName !== req.user.farmerFName) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json(requestDetails);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Route to cancel a request
router.post('/cancel-request/:id', isLoggedIn, async (req, res) => {
  try {
    const requestToCancel = await request.findById(req.params.id);
    
    if (!requestToCancel) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    if (requestToCancel.farmerName !== req.user.farmerFName) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    if (requestToCancel.status !== 'Pending') {
      return res.status(400).json({ error: 'Only pending requests can be cancelled' });
    }
    
    await request.findByIdAndUpdate(req.params.id, { status: 'Cancelled' });
    res.json({ success: true });
    
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
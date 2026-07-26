const express = require('express');
const router = express.Router();

const User = require('../models/User');
const request = require('../models/request');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

// Main dashboard route - Shows overview with stats
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
  try {
    const farmer = req.user;

    const totalRequests = await request.countDocuments({ farmerName: farmer.farmerFName });
    const pendingRequests = await request.countDocuments({
      farmerName: farmer.farmerFName,
      status: 'Pending'
    });
    const completedOrders = await request.countDocuments({
      farmerName: farmer.farmerFName,
      status: 'Completed'
    });

    const allRequests = await request.find({ farmerName: farmer.farmerFName });
    const totalSpent = allRequests.reduce((total, req) => {
      const chickCost = (req.numChicks || 0) * 2500;
      const feedsCost = (req.feedsQuantity || 0) * 5000;
      return total + chickCost + feedsCost;
    }, 0);

    const chickRequests = await request.find({ farmerName: farmer.farmerFName })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      user: farmer,
      totalRequests,
      pendingRequests,
      completedOrders,
      totalSpent,
      chickRequests,
      totalPaid: Math.floor(totalSpent * 0.6),
      pendingPayment: Math.floor(totalSpent * 0.4),
      nextDue: Math.floor(totalSpent * 0.1),
      pendingDeliveries: pendingRequests,
      inTransit: 0,
      delivered: completedOrders,
      scheduled: Math.floor(pendingRequests * 0.5)
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Server Error - Please try again' });
  }
});

// Route to submit new chick request
router.post('/new-request', ensureAuthenticated, async (req, res) => {
  try {
    const { typeChicks, numChicks, chickFeeds, feedsQuantity, farmerType, deliveryDate, notes } = req.body;

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

    res.json({ success: true, message: 'Request submitted successfully!' });

  } catch (error) {
    console.error('New request error:', error);
    res.status(400).json({ error: 'Failed to submit request' });
  }
});

// Route to submit quick request
router.post('/quick-request', ensureAuthenticated, async (req, res) => {
    try {
      const { quickChickType, quickQuantity, quickDeliveryDate } = req.body;

      const newRequest = new request({
        farmerName: req.user.farmerFName,
        typeChicks: quickChickType,
        numChicks: Number(quickQuantity),
        farmerType: 'Returning',
        deliveryDate: quickDeliveryDate,
        notes: 'Quick request submitted via modal',
        status: 'Pending'
      });

      await newRequest.save();
      res.json({ success: true, message: 'Quick request submitted!' });
    } catch (error) {
      console.error('Quick request error:', error);
      res.status(400).json({ error: 'Failed to submit quick request' });
    }
});

// Route to update farmer profile
router.post('/update-profile', ensureAuthenticated, async (req, res) => {
  try {
    const { farmerFName, farmerFEmail, farmerFNumber, farmerFAddress } = req.body;

    await User.findByIdAndUpdate(req.user._id, {
      farmerFName: farmerFName,
      farmerFEmail: farmerFEmail,
      farmerFNumber: farmerFNumber,
      farmerFAddress: farmerFAddress
    });

    res.json({ success: true, message: 'Profile updated successfully!' });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(400).json({ error: 'Failed to update profile' });
  }
});

// Route to get request details
router.get('/requests/:id', ensureAuthenticated, async (req, res) => {
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
router.post('/requests/:id/cancel', ensureAuthenticated, async (req, res) => {
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

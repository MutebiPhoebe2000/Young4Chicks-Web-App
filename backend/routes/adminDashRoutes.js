const express = require('express');
const router = express.Router();

const User = require('../models/User');
const request = require('../models/request');
const Stock = require('../models/chickStockModels');
const Contact = require('../models/Contact');
const { ensureAdmin } = require('../middleware/authMiddleware');

// Main dashboard route
router.get('/dashboard', ensureAdmin, async (req, res) => {
  try {
    const totalFarmers = await User.countDocuments({ userFRole: 'Farmer' });
    const totalSalesReps = await User.countDocuments({ userFRole: 'SalesRep' });
    const totalBrooderManagers = await User.countDocuments({ userFRole: 'BrooderManager' });
    const totalRequests = await request.countDocuments();
    const completedOrders = await request.countDocuments({ status: 'Completed' });
    const totalMessages = await Contact.countDocuments();
    const unreadMessages = await Contact.countDocuments({ status: 'New' });

    const allRequests = await request.find();
    const totalRevenue = allRequests.reduce((total, req) => {
      if (req.status === 'Completed') {
        const chickCost = (req.numChicks || 0) * 2500;
        const feedsCost = (req.feedsQuantity || 0) * 5000;
        return total + chickCost + feedsCost;
      }
      return total;
    }, 0);

    const farmerRequests = await request.find().sort({ createdAt: -1 });
    const users = await User.find()
      .select('farmerFName farmerFEmail farmerFNumber farmerFAddress userFRole status createdAt')
      .sort({ createdAt: -1 });
    const stockItems = await Stock.find();
    const messages = await Contact.find().sort({ createdAt: -1 });

    res.json({
      user: req.user,
      totalFarmers,
      totalSalesReps,
      totalBrooderManagers,
      totalRequests,
      completedOrders,
      totalRevenue,
      totalMessages,
      unreadMessages,
      farmerRequests,
      users,
      stockItems,
      messages
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Approve Request
router.post('/requests/:id/approve', ensureAdmin, async (req, res) => {
  try {
    await request.findByIdAndUpdate(req.params.id, { status: 'Approved' });
    res.json({ success: true, message: 'Request approved' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to approve request' });
  }
});

// Reject Request
router.post('/requests/:id/reject', ensureAdmin, async (req, res) => {
  try {
    await request.findByIdAndUpdate(req.params.id, { status: 'Rejected' });
    res.json({ success: true, message: 'Request rejected' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to reject request' });
  }
});

// Add Stock
router.post('/stock', ensureAdmin, async (req, res) => {
  try {
    const { category, chickType, age, quantity } = req.body;
    const newStock = new Stock({
      category,
      chickType,
      age: Number(age),
      quantity: Number(quantity),
      stockDate: new Date()
    });
    await newStock.save();
    res.json({ success: true, message: 'Stock added' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to add stock' });
  }
});

// Add Product
router.post('/products', ensureAdmin, async (req, res) => {
  try {
    const { productName, productCategory, productStock } = req.body;
    const newProduct = new Stock({
      category: productCategory === 'chick-types' ? 'exotic' : 'local',
      chickType: productName,
      age: 0,
      quantity: Number(productStock),
      stockDate: new Date()
    });
    await newProduct.save();
    res.json({ success: true, message: 'Product added' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to add product' });
  }
});

// Suspend / Unsuspend User
router.post('/users/:id/suspend', ensureAdmin, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { status: 'Suspended' });
    res.json({ success: true, message: 'User suspended' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to suspend user' });
  }
});

// Delete User
router.delete('/users/:id', ensureAdmin, async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;

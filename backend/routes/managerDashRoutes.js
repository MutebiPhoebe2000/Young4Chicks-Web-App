const express = require('express');
const router = express.Router();

const User = require('../models/User');
const request = require('../models/request');
const Stock = require('../models/chickStockModels');
const { ensureBrooderManager } = require('../middleware/authMiddleware');

// Main dashboard route
router.get('/dashboard', ensureBrooderManager, async (req, res) => {
  try {
    const totalFarmers = await User.countDocuments({ userFRole: 'Farmer' });
    const totalRequests = await request.countDocuments();
    const completedOrders = await request.countDocuments({ status: 'Completed' });

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
    const users = await User.find().sort({ createdAt: -1 });
    const stockItems = await Stock.find();

    res.json({
      user: req.user,
      totalFarmers,
      totalRequests,
      completedOrders,
      totalRevenue,
      farmerRequests,
      users,
      stockItems
    });
  } catch (error) {
    console.error('Manager dashboard error:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Approve Request
router.post('/requests/:id/approve', ensureBrooderManager, async (req, res) => {
  try {
    await request.findByIdAndUpdate(req.params.id, { status: 'Approved' });
    res.json({ success: true, message: 'Request approved' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to approve request' });
  }
});

// Reject Request
router.post('/requests/:id/reject', ensureBrooderManager, async (req, res) => {
  try {
    await request.findByIdAndUpdate(req.params.id, { status: 'Rejected' });
    res.json({ success: true, message: 'Request rejected' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to reject request' });
  }
});

// Add Stock
router.post('/stock', ensureBrooderManager, async (req, res) => {
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

// Suspend User
router.post('/users/:id/suspend', ensureBrooderManager, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { status: 'Suspended' });
    res.json({ success: true, message: 'User suspended' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to suspend user' });
  }
});

// Add Product (Same as stock for now or you can create a Product model)
router.post('/products', ensureBrooderManager, async (req, res) => {
    try {
        const { productName, productCategory, productPrice, productStock, productDescription } = req.body;
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

module.exports = router;

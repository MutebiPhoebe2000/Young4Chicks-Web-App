const express = require('express');
const router = express.Router();

// Import models
const User = require('../models/User');
const request = require('../models/request');
const Stock = require('../models/chickStockModels');

// Middleware to check if user is logged in and is a manager
function isManager(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated() && req.user.userFRole === 'BrooderManager') {
    return next();
  }
  res.redirect('/login');
}

// Main dashboard route
router.get('/', isManager, async (req, res) => {
  try {
    // Get stats
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

    // Get lists
    const farmerRequests = await request.find().sort({ createdAt: -1 });
    const users = await User.find().sort({ createdAt: -1 });
    const stockItems = await Stock.find();

    res.render('managerDash', {
      user: req.user,
      totalFarmers,
      totalRequests,
      completedOrders,
      totalRevenue: totalRevenue.toLocaleString(),
      farmerRequests,
      users,
      stockItems
    });
  } catch (error) {
    console.error('Manager dashboard error:', error);
    res.status(500).send('Server Error');
  }
});

// Approve Request
router.post('/approve-request/:id', isManager, async (req, res) => {
  try {
    await request.findByIdAndUpdate(req.params.id, { status: 'Approved' });
    res.redirect('/managersDash?success=Request approved');
  } catch (error) {
    res.redirect('/managersDash?error=Failed to approve request');
  }
});

// Reject Request
router.post('/reject-request/:id', isManager, async (req, res) => {
  try {
    await request.findByIdAndUpdate(req.params.id, { status: 'Rejected' });
    res.redirect('/managersDash?success=Request rejected');
  } catch (error) {
    res.redirect('/managersDash?error=Failed to reject request');
  }
});

// Add Stock
router.post('/add-stock', isManager, async (req, res) => {
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
    res.redirect('/managersDash?success=Stock added');
  } catch (error) {
    res.redirect('/managersDash?error=Failed to add stock');
  }
});

// Suspend User
router.post('/suspend-user/:id', isManager, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { status: 'Suspended' });
    res.redirect('/managersDash?success=User suspended');
  } catch (error) {
    res.redirect('/managersDash?error=Failed to suspend user');
  }
});

// Add Product (Same as stock for now or you can create a Product model)
router.post('/add-product', isManager, async (req, res) => {
    try {
        const { productName, productCategory, productPrice, productStock, productDescription } = req.body;
        // For simplicity, we can use the Stock model or create a separate Product model
        const newProduct = new Stock({
            category: productCategory === 'chick-types' ? 'exotic' : 'local',
            chickType: productName,
            age: 0,
            quantity: Number(productStock),
            stockDate: new Date()
        });
        await newProduct.save();
        res.redirect('/managersDash?success=Product added');
    } catch (error) {
        res.redirect('/managersDash?error=Failed to add product');
    }
});

module.exports = router;
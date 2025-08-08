const express = require('express');
const router = express.Router();
const {ensureAuthenticated, ensureFarmer} = require('../middleware/authMiddleware')

const chickStock = require('../models/chickModels');
const Stock = require('../models/chickStockModels');

router.get('/addChicks', (req, res) => {
    res.render('chicksRequestForm')
})
// A post route to send data to the database 

router.post('/addChicks', async (req, res) => {
    try {
        console.log(req.body);
        const newRequest = new chickStock(req.body);
        await newRequest.save();
    } catch (error) {
        console.error(error)
        res.status(400).render('chicks')
    }
});


router.get('/addStock', (req, res) => {
    res.render('chickStock')
})
// A post route to send data to the database 

router.get('/chickRequest', ensureAuthenticated, ensureFarmer, async(req, res) => {
    try {
        const requests = await chickStock.find({//returns requests from the db for a particular user
            user: req.session.user._id,//captures the currently login user
        });
        const isStarter = requests.length === 0;
        console.log('These are my request so far',requests);
        res.render('chicksRequestForm', {isStarter})
    } catch (error) {
        console.error(error.message);
        res.redirect('/farmerDashboard');
    }
});

router.post('/cc', async (req, res) => {
    try {
        console.log(req.body);
        const {farmerName, chicksNum, typeChicks, farmerType, unitPrice, totalPrice} = req.body;
        const userId = req.session.user._id;
        const newRequest = new chickStock({
            farmerName, chicksNum, typeChicks, farmerType, unitPrice, totalPrice,
            user: userId
        })
        await newRequest.save();
    } catch (error) {
        console.error(error)
        res.status(400).render('chicksRequestForm');
    }
});

module.exports = router;
// const express = require('express');
// const router = express.Router();
// //const {ensureAuthenticated, ensureFarmer} = require('../middleware/authMiddleware')

// const chickStock = require('../models/chickStockModels');
// const Stock = require('../models/chickStockModels');

// router.get('/addChicks', (req, res) => {
//     res.render('chicks')
// })

// router.post('/addChicks', async (req, res) => {
    
// })

// // A post route to send data to the database
// router.get('/addStock', (req, res) => {
//     res.render('chickStock')
// })  
// router.post('/addStock', async (req, res) => {
//     try {
//         console.log(req.body);
//         const newStock = new chickStock(req.body);
//         await newStock.save();
//     } catch (error) {
//         console.error(error)
//         res.status(400).render('chickStock')
//     }
// });



// router.get('/updateStock/:id', async (req, res) => {
//     try {
//         const stockItem = await chickStock.findById(req.params.id);
//         res.render('updateChickStock', { stockItem });
//     } catch (error) {
//         console.error(error.message);
//         res.redirect('/farmerDashboard');
//     }
// });

// router.post('/updateStock/:id',  async (req, res) => {
//     try {
//         console.log(req.body);
//         const {farmerName, chicksNum, typeChicks, farmerType, unitPrice, totalPrice} = req.body;
//         await chickStock.findByIdAndUpdate(req.params.id, {
//             farmerName, chicksNum, typeChicks, farmerType, unitPrice, totalPrice
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(400).render('updateChickStock');
//     }
// });

// router.get('/chickRequests', async(req, res) => {
//     try {
//         const requests = await chickStock.find({
//             user: req.session.user._id,
//         });
//         const isStarter = requests.length === 0;
//         console.log('These are my request so far',requests);
//         res.render('chicksRequestForm', {isStarter})
//     } catch (error) {
//         console.error(error.message);
//         res.redirect('/farmersDash');
//     }
// });

// router.post('/chickRequests', async (req, res) => {
//     try {
//         console.log(req.body);
//         const {farmerName, chicksNum, typeChicks, farmerType, unitPrice, totalPrice} = req.body;
//         const userId = req.session.user._id;
//         const newRequest = new chickStock({
//             farmerName, chicksNum, typeChicks, farmerType, unitPrice, totalPrice,
//             user: userId
//         })
//         await newRequest.save();
//     } catch (error) {
//         console.error(error)
//         res.status(400).render('chicksRequestForm');
//     }
// });
// router.get('/updateStock/:id', async (req, res) => {
//     try {
//         const stockItem = await chickStock.findById(req.params.id);
//         res.render('updateChickStock', { stockItem });
//     } catch (error) {
//         console.error(error.message);
//         res.redirect('/farmerDashboard');
//     }
// })

// router.post('/updateStock/:id',  async (req, res) => {
//     try {
//         console.log(req.body);
//         const {farmerName, chicksNum, typeChicks, farmerType, unitPrice, totalPrice} = req.body;
//         await chickStock.findByIdAndUpdate(req.params.id, {
//             farmerName, chicksNum, typeChicks, farmerType, unitPrice, totalPrice
//         });
//     } catch (error) {
//         console.error(error)
//         res.status(400).render('updateChickStock');
//     }
// })

// // Route to update a specific chick by ID
// router.put('/:id', async (req, res) => {
//     try {
//         const { chicksNum, typeChicks, farmerType, unitPrice, totalPrice } = req.body;
//         const updatedChick = await chickStock.findByIdAndUpdate(
//             req.params.id,
//             { chicksNum, typeChicks, farmerType, unitPrice, totalPrice },
//             { new: true }
//         );
        
//         if (!updatedChick) {
//             return res.status(404).json({ error: 'Chick not found' });
//         }
        
//         res.json(updatedChick);
//     } catch (error) {
//         console.error('Error updating chick:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// // Route to get a specific chick by ID - must be last to avoid conflicts
// router.get('/:id', async (req, res) => {
//     try {
//         const chick = await chickStock.findById(req.params.id);
//         if (!chick) {
//             return res.status(404).json({ error: 'Chick not found' });
//         }
//         res.json(chick);
//     } catch (error) {
//         console.error('Error fetching chick:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// module.exports = router;


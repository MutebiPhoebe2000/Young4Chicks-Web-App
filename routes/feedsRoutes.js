
const express = require('express');
const router = express.Router();
//const {ensureAuthenticated, ensureFarmer} = require('../middleware/authMiddleware')

const FeedsRequest = require('../models/feedsModels');



// Render the feeds request form
router.get('/', (req, res) => {
    res.render('feedsRequest');
});

router.get('/chickRequests', async(req, res) => {
    try {
        const feedsRequests = await FeedsRequest.find({});
        const isStarter = feedsRequests.length === 0;
        console.log('These are my request so far', feedsRequests);
        res.render('feedsRequest', {isStarter})
    } catch (error) {
        console.error(error.message);
        res.redirect('/farmersDash');
    }
});

router.post('/', async (req, res) => {
    try {
        console.log(req.body);
        const { farmerName, farmerNIN, quantityFeeds, typeFeeds, farmerType } = req.body;
        const newRequest = new FeedsRequest({
            farmerName,
            farmerNIN,
            quantityFeeds: Number(quantityFeeds),
            typeFeeds,
            farmerType
        });
        await newRequest.save();
        return res.redirect('/feedsRequest');
    } catch (error) {
        console.error(error)
        res.status(400).render('feedsRequest');
    }
});
router.get('/updateStock/:id', async (req, res) => {
    try {
        const stockItem = await FeedsRequest.findById(req.params.id);
        res.render('updateFeedStock', { stockItem });
    } catch (error) {
        console.error(error.message);
        res.redirect('/farmerDashboard');
    }
})

router.post('/updateStock/:id',  async (req, res) => {
    try {
        console.log(req.body);
        const { farmerName, farmerNIN, quantityFeeds, typeFeeds, farmerType } = req.body;
        await FeedsRequest.findByIdAndUpdate(req.params.id, {
            farmerName,
            farmerNIN,
            quantityFeeds,
            typeFeeds,
            farmerType
        });
    } catch (error) {
        console.error(error)
        res.status(400).render('updateFeedStock');
    }
})

// Route to update a specific feeds request by ID
router.put('/:id', async (req, res) => {
    try {
        const { farmerName, farmerNIN, quantityFeeds, typeFeeds, farmerType } = req.body;
        const updatedFeeds = await FeedsRequest.findByIdAndUpdate(
            req.params.id,
            { farmerName, farmerNIN, quantityFeeds, typeFeeds, farmerType },
            { new: true }
        );
        
        if (!updatedFeeds) {
            return res.status(404).json({ error: 'Feeds not found' });
        }
        
        res.json(updatedFeeds);
    } catch (error) {
        console.error('Error updating feeds:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to get a specific chick by ID - must be last to avoid conflicts
router.get('/:id', async (req, res) => {
    try {
        const feeds = await FeedsRequest.findById(req.params.id);
        if (!feeds) {
            return res.status(404).json({ error: 'Feeds not found' });
        }
        res.json(feeds);
    } catch (error) {
        console.error('Error fetching feeds:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

// router.get('/addChicks', (req, res) => {
//     res.render('chicks')
// })

// router.post('/addChicks', async (req, res) => {
    
// })

// // A post route to send data to the database  
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

// router.get('/addStock', (req, res) => {
//     res.render('chickStock')
// })

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
















// const express = require('express');
// const router = express.Router();

// // Mounted at /feedsRequest in index.js, so route here is '/'
// router.get('/', (req, res) => {
//     res.render('feedsRequest');
// });

// router.post('/', (req, res) => {
//     // TODO: Implement saving logic if needed
//     console.log('Feeds request submission:', req.body);
//     res.redirect('/feedsRequest');
// });
// module.exports = router;
const express = require ('express'); 
const router = express.Router();
const chickStock = require('../models/chickModels'); 

router.get('/addchicks', (req, res) =>{
    res.render("chickRequestForm")
})

router.post('/addChicks', (req,res) => {
    console.log(req.body);
    const newStock = new chickStock(req.body);
    newStock.save();
})

module.exports = router;

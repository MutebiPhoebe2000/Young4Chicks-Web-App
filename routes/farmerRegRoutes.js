const express = require ('express'); 
const router = express.Router();

router.get('/addfarmer', (req, res) =>{
    res.render("farmerReg")
})




module.exports = router;
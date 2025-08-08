const express = require ('express');
const router = express.Router();

router.get('/farmersDash', (req, res) => {
    res.render("farmerDash")
})

module.exports = router;
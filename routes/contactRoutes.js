const express = require('express');
const router = express.Router();

router.get('/contactPage', (req, res) => {
    res.render('contact')
});
module.exports = router;
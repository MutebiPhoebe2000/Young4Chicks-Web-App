const express = require('express');
const router = express.Router();

router.get('/aboutPage', (req, res) => {
    res.render('about')
});
module.exports = router;
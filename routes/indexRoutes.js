const express = require('express');
const router = express.Router();

router.get('/Young4Chicks', (req, res) => {
    res.render('index')
});
module.exports = router;
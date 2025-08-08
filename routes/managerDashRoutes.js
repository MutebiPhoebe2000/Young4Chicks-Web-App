const express = require ('express'); 
const router = express.Router();

router.get('/managersDash', (req, res) =>{
    res.render("managerDash")
})




module.exports = router;
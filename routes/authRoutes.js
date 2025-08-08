const express = require('express');
const router = express.Router();

const User = require('../models/User');
const passport = require('passport');

router.get('/signup', (req, res) => {
    res.render('signup');
})

router.post('/signup', async (req, res) => {
    try {
        const user = new User(req.body);
        let existingUser = await User.findOne({ email: req.body.email });// to check if the email is the same as the one that is coming
        if (existingUser) {
            return res.status(400).send('Email already Exists');
        } else {
            await User.register(user, req.body.password, (err) => {
                if (err) {
                    throw err;
                }
                res.redirect('/login');
            })
        }
    } catch (error) {
        res.status(400).send('Opps, something went wrong!')
    }
});

router.get('/login', (req, res) => {
    res.render('login');
})

router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => {
    req.session.user = req.user;
    if (req.user.role == 'farmer') {
        res.redirect("/farmersDash")
    } else if (req.user.role == 'salesRep') {
        res.send("This is the Sales Representative dashboard")
    } else if (req.user.role == 'brooderManager') {
        res.redirect("/managersDash")
    } else {
        res.send("You don't have a role in the System")
    }
}
);

router.get('/logout', (req, res) => {
    if(req.session){
        req.session.destroy((error) => {
            if(error){
                return res.status(500).send('Error Logging Out!');
            }
            res.redirect('/');
        });
    }
});

module.exports = router;



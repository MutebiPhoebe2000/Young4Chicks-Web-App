const express = require('express');
const router = express.Router();

const User = require('../models/User');
const passport = require('passport');

router.post('/signup', async (req, res) => {
    try {
        const user = new User(req.body);
        let existingUser = await User.findOne({ farmerFEmail: req.body.farmerFEmail });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already Exists' });
        }
        User.register(user, req.body.farmerFPassword, (err) => {
            if (err) {
                console.error(err);
                return res.status(400).json({ error: 'Opps, something went wrong!' });
            }
            res.json({ success: true });
        });
    } catch (error) {
        res.status(400).json({ error: 'Opps, something went wrong!' });
    }
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return res.status(500).json({ error: 'Server error' });
        if (!user) return res.status(401).json({ error: 'Invalid email or password' });

        req.logIn(user, (err) => {
            if (err) return res.status(500).json({ error: 'Server error' });

            let role = null;
            if (user.userFRole === 'Farmer') role = 'farmer';
            else if (user.userFRole === 'SalesRep') role = 'salesRep';
            else if (user.userFRole === 'BrooderManager') role = 'brooderManager';

            if (!role) {
                return res.status(403).json({ error: "You don't have a role in the System" });
            }

            res.json({
                success: true,
                role,
                user: {
                    _id: user._id,
                    farmerFName: user.farmerFName,
                    farmerFEmail: user.farmerFEmail,
                    userFRole: user.userFRole
                }
            });
        });
    })(req, res, next);
});

router.get('/me', (req, res) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return res.json({
            authenticated: true,
            user: {
                _id: req.user._id,
                farmerFName: req.user.farmerFName,
                farmerFEmail: req.user.farmerFEmail,
                userFRole: req.user.userFRole
            }
        });
    }
    res.json({ authenticated: false });
});

router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ error: 'Error Logging Out!' });
        req.session.destroy((error) => {
            if (error) return res.status(500).json({ error: 'Error Logging Out!' });
            res.clearCookie('connect.sid');
            res.json({ success: true });
        });
    });
});

module.exports = router;

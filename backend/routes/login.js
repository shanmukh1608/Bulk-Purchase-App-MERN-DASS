const router = require('express').Router();
const jwt = require('jsonwebtoken');

let Vendor = require('../models/vendor.model');
let Customer = require('../models/customer.model');


// Login for vendor
router.route('/vendor').post(function (req, res) {
    let username = req.body.username;
    let password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({ error: 'Missing user information' });
    } else {
        Vendor.findOne({ username: username }, function (err, user) {
            if (err) return res.status(400).json({ error: 'Sorry, our hampsters are on break!' });
            if (!user) return res.status(400).json({ error: 'Sorry, no user found!' });

            user.comparePasswords(password, function (err, match) {
                if (err) return res.status(400).json({ error: 'Sorry, our hampsters are on break!' });
                if (match) {
                    res.send("Match")
                    // User is verified
                    // res.send({ token: getWebToken(user) });
                } else {
                    return res.status(400).json({ error: 'Incorrect Username or Password' });
                }
            });

        });
    }
});


// Login for customer
router.route('/customer').post(function (req, res) {
    let username = req.body.username;
    let password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({ error: 'Missing user information' });
    } else {

        Customer.findOne({ username: username }, function (err, user) {
            if (err) return res.status(400).json({ error: 'Sorry, our hampsters are on break!' });
            if (!user) return res.status(400).json({ error: 'Sorry, no user found!' });

            user.comparePasswords(password, function (err, match) {
                if (err) return res.status(400).json({ error: 'Sorry, our hampsters are on break!' });

                if (match) {
                    // User is verified
                    // res.send("Match")
                    jwt.sign({ user }, 'secretkey', (err, token) => {
                        res.json({
                            token
                        });
                    })
                    // res.send({ token: getWebToken(user) });
                } else {
                    return res.status(400).json({ error: 'Incorrect Username or Password' });
                }
            });

        });
    }
});


module.exports = router;
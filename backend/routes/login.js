const router = require('express').Router();
const jwt = require('jsonwebtoken');

let User = require('../models/user.model');

// Login for vendor
router.route('/vendor').post(function (req, res) {
	let username = req.body.username;
	let password = req.body.password;

	if (!username || !password) {
		return res.status(400).json({ error: 'Missing user information' });
	} else {
		User.findOne({ isVendor: true, username: username }, function (err, user) {
			if (err) return res.status(400).json({ error: 'Error' });
			if (!user) return res.status(400).json({ error: 'Sorry, no user found!' });

			user.comparePasswords(password, function (err, match) {
				if (err) return res.status(400).json({ error: 'Error' });
				if (match) {
					// User is verified
					jwt.sign({ user }, 'secretkey', (err, token) => {
						res.json({
							token
						});
					})
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

		User.findOne({ isVendor:false, username: username }, function (err, user) {
			if (err) return res.status(400).json({ error: 'Error' });
			if (!user) return res.status(400).json({ error: 'Sorry, no user found!' });
			
			user.comparePasswords(password, function (err, match) {
				if (err) return res.status(400).json({ error: 'Error' });

				if (match) {
					// User is verified
					jwt.sign({ user }, 'secretkey', (err, token) => {
						res.json({
							token
						});
					})
				} else {
					return res.status(400).json({ error: 'Incorrect Username or Password' });
				}
			});

		});
	}
});


module.exports = router;
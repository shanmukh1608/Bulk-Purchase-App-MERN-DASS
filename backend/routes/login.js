const router = require('express').Router();
const jwt = require('jsonwebtoken');

let User = require('../models/user.model');

/*
APIs
Vendor login - works
Customer login - works
Check if authToken is vendor or customer - works
*/

function verifyToken(req, res, next) {
	// Get auth header value
	const bearerHeader = req.headers['authorization'];
	// Check if bearer is undefined
	if (typeof bearerHeader !== 'undefined') {
		// Split at the space
		const bearer = bearerHeader.split(' ');
		// Get token from array
		const bearerToken = bearer[1];
		// Set the token
		req.token = bearerToken;
		// Next middleware
		next();
	} else {
		// Forbidden
		res.sendStatus(403);
	}
}

// Login for vendor
router.route('/vendor').post(async function (req, res) {
	let username = req.body.username;
	let password = req.body.password;

	if (!username || !password) {
		return res.status(400).json({ error: 'Missing user information' });
	} else {
		await User.findOne({ isVendor: true, username: username }, function (err, user) {
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

		User.findOne({ isVendor: false, username: username }, function (err, user) {
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

router.route('/check').get(verifyToken, function (req, res) {
	console.log("AAA")
	console.log(req.token)
	jwt.verify(req.token, 'secretkey', (err, authData) => {
		if (err) return res.status(500).json({"Error" : "Error occurred"})
		else
		{
			let token = req.token;
			User.findOne({_id: authData.user._id }).lean().exec(function (err, user) {
				if (err) return res.status(500).send("Error")
				if (!user) return res.status(400).send("Error")

				return res.status(200).send(user.isVendor)
			})
		}
	})
});


module.exports = router;
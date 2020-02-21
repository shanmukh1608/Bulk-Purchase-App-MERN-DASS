const router = require('express').Router();
const jwt = require('jsonwebtoken');

let Product = require('../models/product.model');
let Review = require('../models/review.model');
let Order = require('../models/order.model')
let User = require('../models/user.model');

/*
APIs
List a new product - works
View all products - works
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

// Adding a new product
router.route('/add').post(verifyToken, function (req, res) {
	jwt.verify(req.token, 'secretkey', async (err, authData) => {
		if (err) return res.sendStatus(402);
		else {
			await User.findOne({ isVendor: true, _id: authData.user._id }, function (err, user) {
				if (err) return res.sendStatus(400);
				if (!user) return res.json({ error: 'Current user is not a vendor' });

				req.body.vendorid = user._id;

				// if logged in user is a vendor
				let product = new Product(req.body);
				console.log(req.body)
				product.save()
					.then(product => {
						res.json({ 'Product': 'Product added successfully' });
					})
					.catch(err => {
						res.json({error: 'Error'});
					})
			})
		}
	})
});

// Getting all products
router.route('/').get(function (req, res) {
	Product.find({}).lean().exec(async function (err, products) {
		if (err) console.log(err);
		else {
			res.json(products);
		}
	});
});	

module.exports = router;
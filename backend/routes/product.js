const router = require('express').Router();
const jwt = require('jsonwebtoken');

let Product = require('../models/product.model');
let User = require('../models/user.model');

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
				if (!user) return res.status(400).json({ error: 'Current user is not a vendor' });

				req.body.vendorid = user._id;

				// if logged in user is a vendor
				let product = new Product(req.body);
				product.save()
					.then(product => {
						res.status(200).json({ 'Product': 'Product added successfully' });
					})
					.catch(err => {
						res.status(400).send('Error');
					})
			})
		}
	})
});

// Getting all products for particular vendor
router.route('/vendor').get(function (req, res) {
	let inputVendorid = req.headers.vendorid;
	Product.find({ vendorid: inputVendorid }).lean().exec(async function (err, products) {
		if (err) console.log(err);
		else {
			for (let i = 0; i < products.length; i++) {
				let index = 0;
				await User.findOne({ isVendor: true, _id: products[i].vendorid }, function (err, vendor) {
					if (err) res.sendStatus(400);
					if (!vendor) return res.status(400).json({ error: 'Vendor not found' });

					index = i
					name = vendor.username
				});

				products[index].vendorname = name;
			}

			res.json(products);
		}
	});
});

// Getting all products
router.route('/').get(function (req, res) {
	Product.find({}).lean().exec(async function (err, products) {
		if (err) console.log(err);
		else {
			for (let i = 0; i < products.length; i++) {
				let index = 0;
				await User.findOne({ isVendor: true, _id: products[i].vendorid }, function (err, vendor) {
					if (err) console.log(err);
					if (!vendor) return res.status(400).json({ error: 'Vendor not found' });

					index = i
					name = vendor.username
				});

				products[index].vendorname = name;
			}

			res.json(products);
		}
	});
});

module.exports = router;
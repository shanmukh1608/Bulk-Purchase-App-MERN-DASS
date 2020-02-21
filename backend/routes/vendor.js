const router = require('express').Router();
const jwt = require('jsonwebtoken');

let Vendor = require('../models/user.model');
let Product = require('../models/product.model');
let Review = require('../models/review.model');
let Order = require('../models/order.model')

/*
APIs
Add vendor - works
View all vendors - works
Get all products by particular vendor - works
Cancel specific listing - works
View all products ready to dispatch - works
Dispatch order - works
View all dispatched products with reviews
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

// Adding a new vendor
router.route('/add').post(function (req, res) {
	let vendor = new Vendor(req.body);
	vendor.save()
		.then(vendor => {
			res.status(200).json({ 'Vendor': 'Vendor added successfully' });
		})
		.catch(err => {
			res.status(400).send('Error');
		});
});

// Getting all vendors
router.route('/').get(function (req, res) {
	Vendor.find({ isVendor: true }, function (err, users) {
		if (err) {
			console.log(err);
		} else {
			res.json(users);
		}
	});
});

// Getting all products for particular vendor
router.route('/product').get(verifyToken, function (req, res) {
	// console.log("aaa")
	jwt.verify(req.token, 'secretkey', (err, authData) => {
		if (err) res.send('Error authenticating');
		else {
			Vendor.findOne({ isVendor: true, _id: authData.user._id }).lean().exec(function (err, vendor) { //checks vendor
				if (err) res.send('Error authenticating');
				else {
					if (!vendor) res.send('User logged in is not a vendor');
					let inputVendorid = vendor._id;
					Product.find({ vendorid: inputVendorid, status: "Waiting"}).lean().exec(async function (err, products) {
						if (err) res.send('Error retrieving products');
						else {
							if (!products)
								res.send('No product found');

							// for (let i = 0; i < products.length; i++) {
							// 	let index = 0;
							// 	await Vendor.findOne({ isVendor: true, _id: products[i].vendorid }, function (err, vendor) {
							// 		if (err) res.sendStatus(400);
							// 		if (!vendor) return res.status(400).json({ error: 'Vendor not found' });

							// 		index = i
							// 		name = vendor.username
							// 	});

							// 	products[index].vendorname = name;
							// }

							res.json(products);
						}
					});
				}
			})
		}
	})
});

// Cancel specific product
router.route('/cancel').post(function (req, res) {
	let inputProductid = req.body.productid;

	Product.findById(inputProductid, async function (err, product) {
		if (err) return res.status(500).send("Error")
		else {
			if (!product)
				res.status(400).send('No product found');

			product.status = "Canceled";
			product.save()
				.then(product => {
					res.status(200).send('Canceled product');
				})
				.catch(err => {
					if (err) res.status(500).send("Error canceling product")
				});
		}
	});
});

// View orders ready to dispatch
router.route('/viewPlaced').get(verifyToken, function (req, res) {
	jwt.verify(req.token, 'secretkey', (err, authData) => {
		if (err) res.send('Error authenticating');
		else {
			Vendor.findOne({ isVendor: true, _id: authData.user._id }).lean().exec(function (err, vendor) { //checks vendor
				if (err) res.send('Error authenticating');
				else {
					Product.find({ vendorid: vendor._id, status: "Placed" }, async function (err, products) {
						if (err) return res.send("Error")
						else {
							if (!products)
								res.status(400).send('No products found');

							res.json(products);
						}
					})
				}
			})
		}
	});
});

// Dispatch orders
router.route('/dispatch').post(function (req, res) {
	let inputProductid = req.body.productid;

	Product.findById(inputProductid, async function (err, product) {
		if (err) return res.status(500).send("Error")
		else {
			if (!product)
				res.json({error: 'No product found'});

			if (product.remaining <= 0)
				product.status = "Dispatched";
			else
				res.json({error: "Can't dispatch yet"});

			product.save()
				.then(product => {
					res.send('Dispatched product');
				})
				.catch(err => {
					if (err) res.json({error:"Error dispatching product"})
				});
		}
	});
});

// View dispatched orders
router.route('/viewDispatched').get(verifyToken, function (req, res) {
	jwt.verify(req.token, 'secretkey', (err, authData) => {
		if (err) res.status(500).send('Error authenticating');
		else {
			Vendor.findOne({ isVendor: true, _id: authData.user._id }).lean().exec(function (err, vendor) { //checks vendor
				if (err) res.status(500).send('Error authenticating');
				else {
					Product.find({ vendorid: vendor._id, status: "Dispatched" }, async function (err, products) {
						if (err) return res.status(500).send("Error")
						else {
							if (!products)
								res.status(400).send('No products found');

							for (let i = 0; i < products.length; i++) {
								let index = 0, count = 0;
								await Order.find({ productid: products[i]._id }, async function (err, orders) {
									if (err) return res.status(500).send("Error querying database")
									if (!orders) return res.status(400).json({ error: 'Orders not found' });

									for (let j = 0; j < orders.length; j++) {
										await Reviews.find({ orderid: orders[i]._id }, function (err, reviews) {
											if (err) return res.status(500).send("Error querying database")
											if (!reviews) return res.status(400).json({ error: 'Reviews not found' });

											index = i
											reviews[count] = Reviews.review
											count = count + 1
										})
									}
								});

								products[index].vendorname = reviews;
							}
							res.json(products);
						}
					})
				}
			})
		}
	});
});


module.exports = router;
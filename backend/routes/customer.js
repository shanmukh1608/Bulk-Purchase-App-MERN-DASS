const router = require('express').Router();
const jwt = require('jsonwebtoken');

let Customer = require('../models/user.model');
let Product = require('../models/product.model')

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

// Adding a new customer
router.route('/add').post(function (req, res) {
    let customer = new Customer(req.body);
    customer.save()
        .then(customer => {
            res.status(200).json({ 'Customer': 'Customer added successfully' });
        })
        .catch(err => {
            res.status(400).send('Error');
        });
});

// Getting all customers
router.route('/').get(function (req, res) {
    Customer.find({ isVendor: false }, function (err, users) {
        if (err) {
            console.log(err);
        } else {
            res.json(users);
        }
    });
});

// Search all products
// header contains authToken which tells us which customer is logged in
// body contains string
router.route('/search').get(verifyToken, function (req, res) {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) res.status(400).send('Error authenticating user token');
        else {
            Customer.findOne({ isVendor: false, _id: authData.user._id }).lean().exec(function (err, user) {
                if (err) res.status(400).send('Error finding user');
                if (!user) res.status(400).send('User is not a customer');

                inputString = req.body.string;
                Product.find({name: inputString}).lean().exec(function (err, products) {
                    if (err) res.status(400).send('Error retrieving products');
                    if (!products) res.status(400).send('No products found')

                    res.json(products);
                })
            })
        }
    })
});

module.exports = router;
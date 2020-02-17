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
// if body contains filter = price, quantity, or rating & sort = up or down

router.route('/search').get(verifyToken, function (req, res) {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) res.status(400).send('Error authenticating user token');
        else {
            Customer.findOne({ isVendor: false, _id: authData.user._id }).lean().exec(function (err, user) {
                if (err) res.status(400).send('Error finding user');
                if (!user) res.status(400).send('User is not a customer');

                inputString = req.body.string;
                inputFilter = req.body.filter;
                inputSort = req.body.sort;

                let sortType;
                if (inputSort == "ascending") sortType = 1;
                else if (inputSort == "descending") sortType = -1;

                if (inputFilter != "rating") {
                    Product.find({ name: inputString }).sort({ price: sortType }).lean().exec(async function (err, products) {
                        if (err) res.status(400).send('Error retrieving products');
                        if (!products) res.status(400).send('No products found')

                        for (let i = 0; i < products.length; i++) {
                            let index = 0;
                            await Customer.findOne({ isVendor: true, _id: products[i].vendorid }, function (err, vendor) {
                                if (err) console.log(err);
                                if (!vendor) return res.status(400).json({ error: 'Vendor not found' });

                                index = i
                                name = vendor.username
                            });

                            products[index].vendorname = name;
                        }

                        res.json(products);
                    })
                }

                else {
                    Product.find({ name: inputString }).sort({ price: sortType }).lean().exec(async function (err, products) {
                        for (let i = 0; i < products.length; i++) {
                            let index = 0;
                            await Customer.findOne({ isVendor: true, _id: products[i].vendorid }, function (err, vendor) {
                                if (err) console.log(err);
                                if (!vendor) return res.status(400).json({ error: 'Vendor not found' });

                                index = i
                                name = vendor.username
                                rating = vendor.totalRating/vendor.numRating;
                            });

                            products[index].rating = rating;
                            products[index].vendorname = name;
                        }

                        products.sort(function(a, b){
                            return a.rating - b.rating;
                        });

                        res.json(products);
                    })
                }
                // }
            })
        }
    })
});

module.exports = router;
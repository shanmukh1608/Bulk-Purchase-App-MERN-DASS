const router = require('express').Router();
const jwt = require('jsonwebtoken');

let Customer = require('../models/user.model');
let Product = require('../models/product.model');
let Review = require('../models/review.model');
let Order = require('../models/order.model')

/*
APIs
Add customer - works
Get all customers - works
Search through all products - works
See all orders for customer - works
Edit order if not dispatched - works
Rate vendor - works
Retrieve reviews of a vendor
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

// Adding a new customer
router.route('/add').post(function (req, res) {
    let customer = new Customer(req.body);
    console.log(req.body)
    customer.save()
        .then(customer => {
            res.status(200).json({ 'Customer': 'Customer added successfully' });
        })
        .catch(err => {
            console.log(err)
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

                inputString = req.params.string;
                inputFilter = req.params.filter;
                inputSort = req.params.sort;

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
                                rating = vendor.totalRating / vendor.numRating;
                            });

                            products[index].rating = rating;
                            products[index].vendorname = name;
                        }

                        products.sort(function (a, b) {
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

// body contains vendorID
router.route('/vendorReviews').get(function (req, res) {
    Product.find({ vendorid: req.param.vendorid }, async function (err, products) {
        if (err) return res.status(500).send("Error")
        else {
            if (!products)
                res.status(400).send('No products found');

            for (let i = 0; i < products.length; i++) {
                let index = 0, count = 0, reviewsToAdd = [];
                await Order.find({ productid: products[i]._id }, async function (err, orders) {
                    if (err) return res.status(500).send("Error querying database")
                    if (!orders) return res.status(400).json({ error: 'Orders not found' });

                    for (let j = 0; j < orders.length; j++) {
                        await Review.find({ orderid: orders[i]._id }, function (err, reviews) {
                            if (err) return res.status(500).send("Error querying database")
                            if (!reviews) return res.status(400).json({ error: 'Reviews not found' });

                            index = i
                            reviewsToAdd[count] = Review.reviews
                            count = count + 1
                        })
                    }
                });

                products[index].vendorname = reviewsToAdd;
            }
            res.json(products);
        }
    })
});

// Getting all orders for particular customer
router.route('/orders').get(verifyToken, function (req, res) {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) res.status(500).send('Error authenticating');
        else {
            Customer.findOne({ isVendor: false, _id: authData.user._id }).lean().exec(function (err, customer) { //checks customer
                if (err) res.status(500).send('Error authenticating');
                else {
                    if (!customer) res.status(500).send('User logged in is not a customer!');
                    Order.find({ customerid: customer._id }).lean().exec(async function (err, orders) {
                        if (err) res.status(500).send('Error retrieving orders');
                        else {
                            if (!orders) {
                                console.log("Nothing")
                                res.status(400).send('No product found');
                            }

                            for (let i = 0; i < orders.length; i++) {
                                let index = 0, remainingRequired = 0;
                                await Product.findOne({ _id: orders[i].productid }, function (err, product) {
                                    if (err) res.sendStatus(400);
                                    if (!product) return res.status(400).json({ error: 'Vendor not found' });

                                    index = i
                                    status = product.status
                                    remainingRequired = product.remaining
                                });

                                orders[index].status = status;
                                if (orders[index].status == "waiting")
                                    orders[index].remainingRequired = remainingRequired

                            }

                            res.json(orders);
                        }
                    });
                }
            })
        }
    })
});

// edit order if not dispatched
// expects orderid and newquantity in body
router.route('/editOrder').post(verifyToken, function (req, res) {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) res.status(500).send('Error authenticating');
        else {
            Customer.findOne({ isVendor: false, _id: authData.user._id }).lean().exec(function (err, customer) { //checks customer
                if (err) res.status(500).send('Error authenticating');
                else {
                    if (!customer) res.status(500).send('User logged in is not a customer!');

                    Order.findOne({ _id: req.body.orderid }, async function (err, order) {
                        if (err) res.status(500).send('Error retrieving order');
                        else {
                            if (!order)
                                res.status(400).send('No order found');

                            let oldqty = order.quantity;
                            order.quantity = req.body.newqty;
                            order.save()
                                .then(order => {
                                    res.status(200).send('Order edited');
                                })
                                .catch(err => {
                                    if (err) res.status(500).send("Error editing order")
                                });

                            Product.findOne({ _id: order.productid }, async function (err, product) {
                                if (err) res.status(500).send('Error retrieving product');
                                else {
                                    if (!order) res.status(400).send('No product found');
                                    product.remaining += oldqty;
                                    product.remaining = product.remaining - order.quantity;
                                    if (product.remaining <= 0) product.status = "Placed"
                                    // else product.status = "Waiting"


                                    product.save()
                                        .then(product => {
                                            res.status(200).send("Successfully ordered")
                                        })
                                        .catch(err => {
                                            if (err) res.status(500).send("Error saving updated quantity in database")
                                        });
                                }

                            })

                            res.json(order);
                        }
                    });
                }
            })
        }
    })
});

router.route('/rateVendor').post(function (req, res) {
    // body contains vendorID, rating (0-5)
    Customer.findOne({ isVendor: true, _id: req.body.vendorid }, function (err, vendor) {
        if (err) res.status(500).send('Error finding vendor');
        else {
            if (!vendor) res.status(400).send('No such vendor');

            vendor.totalRating = vendor.totalRating + req.body.rating;
            vendor.numRating = vendor.numRating + 1;

            vendor.save()
                .then(vendor => {
                    res.status(200).send("Successfully rated vendor")
                })
                .catch(err => {
                    if (err) res.status(500).send("Error saving rating in database")
                });
        }
    })
})




module.exports = router;
// }
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
    // console.log(req.body)
    customer.save()
        .then(customer => {
            res.status(200).json({ 'Customer': 'Customer added successfully' });
        })
        .catch(err => {
            // console.log(err)
            res.status(400).send('Error');
        });
});

// Getting all customers
router.route('/').get(function (req, res) {
    Customer.find({ isVendor: false }, function (err, users) {
        if (err) {
            // console.log(err);
        } else {
            res.json(users);
        }
    });
});

// Search all products
// header contains authToken which tells us which customer is logged in
// params contains string
// if params contains filter = price, quantity, or rating & sort = up or down

router.route('/search').get(verifyToken, function (req, res) {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) return res.json({ error: 'Error authenticating user token' });
        else {
            Customer.findOne({ isVendor: false, _id: authData.user._id }).lean().exec(function (err, user) {
                if (err) return res.json({ error: 'Error finding user' });
                if (!user) return res.json({ error: 'User is not a customer' });

                let inputString = req.query.string;
                let inputFilter = req.query.filter;
                let inputSort = req.query.sort;

                // console.log(inputString, inputFilter, inputSort);

                Product.find({ name: inputString, status: { $ne: "Canceled" } }).lean().exec(async function (err, products) {
                    if (err) return res.json({ error: 'Error retrieving products' });
                    if (!products) return res.json({ error: 'No products found' });

                    for (let i = 0; i < products.length; i++) {
                        let index = 0, name, rating;
                        await Customer.findOne({ isVendor: true, _id: products[i].vendorid }, function (err, vendor) {
                            if (err) console.log(err);
                            if (!vendor) return res.json({ error: 'Vendor not found' });

                            index = i
                            name = vendor.username
                            rating = vendor.totalRating / vendor.numRating
                        });

                        products[index].vendorname = name;
                        products[index].vendorrating = rating;

                    }

                    if (inputSort == "ascending") {
                        if (inputFilter == "price")
                            products.sort(function (a, b) {
                                return a.price - b.price;
                            });
                        else if (inputFilter == "quantity") {
                            products.sort(function (a, b) {
                                return a.remaining - b.remaining;
                            });
                        }
                        else if (inputFilter == "rating")
                            products.sort(function (a, b) {
                                return a.vendorrating - b.vendorrating;
                            });
                    }
                    else if (inputSort == "descending") {
                        if (inputFilter == "price")
                            products.sort(function (a, b) {
                                return b.price - a.price;
                            });
                        else if (inputFilter == "quantity") {
                            products.sort(function (a, b) {
                                return b.remaining - a.remaining;
                            });
                        }
                        else if (inputFilter == "rating")
                            products.sort(function (a, b) {
                                return b.vendorrating - a.vendorrating;
                            });
                    }

                    res.json(products);
                })


                // else {
                //     Product.find({ name: inputString }).sort({ price: sortType }).lean().exec(async function (err, products) {
                //         for (let i = 0; i < products.length; i++) {
                //             let index = 0, name, rating;
                //             await Customer.findOne({ isVendor: true, _id: products[i].vendorid }, function (err, vendor) {
                //                 if (err) console.log(err);
                //                 if (!vendor) return res.prependListenerjson({ error: 'Vendor not found' });

                //                 index = i
                //                 name = vendor.username
                //                 rating = vendor.totalRating / vendor.numRating;
                //             });

                //             products[index].vendorname = name;
                //             products[index].rating = rating;
                //         }

                //         products.sort(function (a, b) {
                //             return a.rating - b.rating;
                //         });

                //         res.json(products);
                //     })
                // }
                // }
            })
        }
    })
});

// query contains vendorID
router.route('/vendorReviews').get(function (req, res) {
    Product.find({ vendorid: req.query.vendorid }).lean().exec(async function (err, products) {
        if (err) return res.status(500).send("Error")
        else {
            if (!products)
                res.status(400).send('No products found');
            else {
                for (let i = 0; i < products.length; i++) {
                    let index = 0, count = 0, reviewsToAdd = [];

                    await Order.find({ productid: products[i]._id }, async function (err, orders) {
                        if (err) return res.status(500).send("Error querying database")
                        else {
                            if (!orders) return res.status(400).json({ error: 'Orders not found' });
                            else {
                                for (let j = 0; j < orders.length; j++) {
                                    await Review.find({ orderid: orders[j]._id }, function (err, reviews) {
                                        if (err) return res.status(500).send("Error querying database")
                                        else {
                                            if (!reviews) return res.status(400).json({ error: 'Reviews not found' });
                                            else {
                                                console.log("Oh hey")
                                                index = 
                                                reviewsToAdd.push(reviews)
                                                count = count + 1
                                            }
                                        }
                                    })
                                }
                            }
                        }
                    });

                    products[index].reviews = reviewsToAdd;
                }
            }
            res.json(products);
        }
    })
});

// Getting all orders for particular customer
router.route('/orders').get(verifyToken, function (req, res) {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) res.json({ error: 'Error authenticating' });
        else {
            Customer.findOne({ isVendor: false, _id: authData.user._id }).lean().exec(function (err, customer) { //checks customer
                if (err) res.json({ error: 'Error authenticating' });
                else {
                    if (!customer) res.json({ error: 'User logged in is not a customer!' });
                    else
                        Order.find({ customerid: customer._id }).lean().exec(async function (err, orders) {
                            if (err) res.json({ error: 'Error retrieving orders' });
                            else {
                                if (!orders) {
                                    // console.log("Nothing")
                                    res.json({ error: 'No product found' });
                                }

                                for (let i = 0; i < orders.length; i++) {
                                    let name, index = 0, remainingRequired = 0;
                                    let index2 = 0, vendorname;

                                    await Product.findOne({ _id: orders[i].productid }, async function (err, product) {
                                        if (err) return res.sendStatus(400);
                                        if (!product) return res.json({ error: 'Vendor not found' });

                                        index = i
                                        name = product.name
                                        status = product.status
                                        remainingRequired = product.remaining


                                        await Customer.findOne({ isVendor: true, _id: product.vendorid }).lean().exec(function (err, vendor) {
                                            if (err) return res.sendStatus(400);
                                            if (!vendor) return res.json({ error: 'Vendor not found' });

                                            vendorname = vendor.username
                                        });
                                    });

                                    await Product.findOne({ _id: orders[i].productid }, async function (err, product) {
                                    });

                                    orders[index].name = name;
                                    orders[index].status = status;

                                    if (orders[index].status == "waiting")
                                        orders[index].remainingRequired = remainingRequired

                                    // console.log(vendorname)

                                    orders[index].vendorname = vendorname;
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
    // body contains vendor username, rating (0-5)
    // console.log(req.body.vendorname)
    Customer.findOne({ isVendor: true, username: req.body.vendorname }, function (err, vendor) {
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
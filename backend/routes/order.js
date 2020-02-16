const router = require('express').Router();
const jwt = require('jsonwebtoken');

let Product = require('../models/product.model');
let User = require('../models/user.model');
let Order = require('../models/order.model');


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

// Placing a new order
router.route('/add').post(verifyToken, function (req, res) {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) return console.log("error")
        else {
            User.findOne({ isVendor: false, _id: authData.user._id }).lean().exec(function (err, user) {
                if (err) return console.log("error")
                if (!user) return res.status(400).json({ error: 'Current user is not a customer' });

                req.body.customerid = user._id; //userid retrieved from authToken
                req.body.productid = req.headers.productid; //productid retrieved through headers

                // if logged in user is a vendor
                let order = new Order(req.body);
                order.save()
                    .catch(err => {
                        res.status(400).send('Error updating Order database');
                    })

                Product.findByIdAndUpdate(order.productid, { $inc: { remaining: -1 * order.quantity } }, function (err, product) {
                    if (err) console.log("Error")
                    else {
                        if (product.remaining <= order.quantity) {
                            Product.findByIdAndUpdate(order.productid, { status: "placed" }, function (err, product) {
                                if (err) res.status(400).send('Error changing status')
                                res.status(200).send("Succesfully placed order")
                            });
                        }
                    }
                });
            });
        }
    })
});

// Getting all orders
router.route('/').get(async function (req, res) {
    await Order.find({}).lean().exec(async function (err, orders) {
        if (err) console.log(err);
        else {
            res.json(orders);
        }
    });
});

module.exports = router;

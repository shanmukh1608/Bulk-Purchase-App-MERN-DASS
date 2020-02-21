const router = require('express').Router();
const jwt = require('jsonwebtoken');

let Customer = require('../models/user.model');
let Product = require('../models/product.model');
let Review = require('../models/review.model');
let Order = require('../models/order.model')

/*
APIs
Make new review - works
View all reviews - works
*/

router.route('/reviewOrder').post(function (req, res) {
    // body contains orderID, rating (0-5), review string
    let review = new Review(req.body);
    review.save()
        .then(review => {
            res.json({ 'status': "Review added successfully" });
        })
        .catch(err => {
            res.json({ 'error': 'Error' });
        });
})

// Getting all orders
router.route('/').get(function (req, res) {
    Review.find({}).lean().exec(function (err, reviews) {
        if (err) console.log(err);
        else {
            res.json(reviews);
        }
    });
});

module.exports = router;

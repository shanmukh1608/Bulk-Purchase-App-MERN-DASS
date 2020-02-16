const router = require('express').Router();
let Customer = require('../models/user.model');

// Adding a new customer
router.route('/add').post(function(req, res) {
    let customer = new Customer(req.body);
    customer.save()
        .then(customer => {
            res.status(200).json({'Customer': 'Customer added successfully'});
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


module.exports = router;
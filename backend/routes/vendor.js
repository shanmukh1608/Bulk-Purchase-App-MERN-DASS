const router = require('express').Router();
let Vendor = require('../models/user.model');

// Adding a new vendor
router.route('/add').post(function(req, res) {
	let vendor = new Vendor(req.body);
	vendor.save()
		.then(vendor => {
			res.status(200).json({'Vendor': 'Vendor added successfully'});
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


module.exports = router;
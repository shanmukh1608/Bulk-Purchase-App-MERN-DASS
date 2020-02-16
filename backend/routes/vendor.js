const router = require('express').Router();
let Vendor = require('../models/vendor.model');

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
	Vendor.find(function (err, users) {
        console.log("test");
		if (err) {
			console.log(err);
		} else {
			res.json(users);
		}
	});
});


module.exports = router;
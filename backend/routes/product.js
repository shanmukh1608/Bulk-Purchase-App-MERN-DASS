const router = require('express').Router();
const jwt = require('jsonwebtoken');

let Product = require('../models/product.model');
let Vendor = require('../models/vendor.model');

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

// router.route('/api').post(verifyToken, (req, res) => {
//   jwt.verify(req.token, 'secretkey', (err, authData) => {
//     if (err) {
//       res.sendStatus(402);
//     } else {
//       res.json({
//         message: 'Post created...',
//         authData
//       });
//     }
//   });
// });

// Adding a new product
router.route('/add').post(verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) return res.sendStatus(402);
    else {
      Vendor.findOne({ _id: authData['user']['_id'] }, function (err, user) {
        if (err) return res.sendStatus(400);
        if (!user) return res.status(400).json({ error: 'Current user is not a vendor' });

        // if logged in user is a vendor
        let product = new Product(req.body);
        product.save()
          .then(product => {
            res.status(200).json({ 'Product': 'Product added successfully' });
          })
          .catch(err => {
            res.status(400).send('Error');
          })
      })
    }
  })
});

// Getting all products
router.route('/').get(function (req, res) {
  Product.find(function (err, users) {
    console.log("test");
    if (err) {
      console.log(err);
    } else {
      res.json(users);
    }
  });
});

module.exports = router;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let VendorSchema = new mongoose.Schema({
	username: { 
		type: String, 
		required: true, 
		unique: true, 
		trim: true 
  	},
  	password: { 
		type: String, 
		required: true, 
		trim: true 
  	},
  	numrating: { 
		type: Number, 
		default: 0
  	},
  	totalrating: { 
		type: Number, 
		default: 0
  	}
});

// hashes each password
VendorSchema.pre('save', function (next) {
	const vendor = this;

	bcrypt.genSalt(10, function (err, salt) {
		if (err) return next(err);

		bcrypt.hash(vendor.password, salt, function (err, hash) {
			if (err) return next(err);

			vendor.password = hash;
			next();
		});
	});
});

// method to compare password
VendorSchema.methods.comparePasswords = function(candidatePassword, callback) {
	const vendor = this;
  
	bcrypt.compare(candidatePassword, vendor.password, function(err, isMatch) {
	  if (err) return callback(err);
  
	  callback(null, isMatch);
	})
  }


module.exports = mongoose.model('Vendor', VendorSchema);
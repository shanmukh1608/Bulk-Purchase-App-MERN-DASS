const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let CustomerSchema = new mongoose.Schema({
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
	}
});

CustomerSchema.pre('save', function (next) {
	const customer = this;

	bcrypt.genSalt(10, function (err, salt) {
		if (err) return next(err);

		bcrypt.hash(customer.password, salt, function (err, hash) {
			if (err) return next(err);

			customer.password = hash;
			next();
		});
	});
});

CustomerSchema.methods.comparePasswords = function(candidatePassword, callback) {
	const customer = this;
  
	bcrypt.compare(candidatePassword, customer.password, function(err, isMatch) {
	  if (err) return callback(err);
  
	  callback(null, isMatch);
	})
  }


module.exports = mongoose.model('Customer', CustomerSchema);
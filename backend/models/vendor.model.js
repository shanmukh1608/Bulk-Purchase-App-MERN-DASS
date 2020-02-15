const mongoose = require('mongoose');

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
  	authtoken: { 
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

module.exports = mongoose.model('Vendor', VendorSchema);
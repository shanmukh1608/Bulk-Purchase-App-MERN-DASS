const mongoose = require('mongoose');

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
	},
	authtoken: { 
		type: String, 
		required: true, 
		trim: true 
	}
});
module.exports = mongoose.model('Customer', CustomerSchema);
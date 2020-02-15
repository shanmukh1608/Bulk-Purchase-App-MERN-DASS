const mongoose = require('mongoose');

let ReviewSchema = new mongoose.Schema({
	review: { 
		type: String, 
		default:'none', 
		trim: true 
	},
	rating: { 
		type: Number 
	},
	orderid: { 
		type: mongoose.Schema.Types.ObjectId, 
		ref:'Order'
	}
});

module.exports = mongoose.model('Review', ReviewSchema);
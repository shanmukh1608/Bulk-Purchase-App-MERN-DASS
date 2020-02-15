const mongoose = require('mongoose');

let OrderSchema = new mongoose.Schema({
	quantity: { 
		type: Number, 
		required: true, 
		trim: true 
	},
	productid: { 
		type: mongoose.Schema.Types.ObjectId, 
		ref:'Product'
	},
	customerid: { 
		type: mongoose.Schema.Types.ObjectId, 
		ref:'Customer'
	}
});

module.exports = mongoose.model('Order', OrderSchema);
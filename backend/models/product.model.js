const mongoose = require('mongoose');

let ProductSchema = new mongoose.Schema({
	name: { 
		type: String, 
		required: true, 
		trim: true 
	},
	status: { 
		type: String, 
		default:'Waiting', 
		trim: true 
	},
	price: { 
		type: Number, 
		required: true
	},
	remaining: { 
		type: Number, 
		required: true
	},
	vendorid: { 
		type: mongoose.Schema.Types.ObjectId, 
		ref:'User'
	}
});
module.exports = mongoose.model('Product', ProductSchema);

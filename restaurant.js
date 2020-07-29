let mongoose = require('mongoose');

let restaurantSchema = new mongoose.Schema({
	name:String,
	address:String,
	types:[String],
	phone:String,
	email:String,
	description:String,
	opening_time:String,
	latitude:Number,
	longitude:Number
})

module.exports = mongoose.model('Restaurant',restaurantSchema);
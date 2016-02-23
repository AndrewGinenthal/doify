var mongoose = require('mongoose');



var tasksSchema = mongoose.Schema({
	name: String,
	created: {type: Date, default: Date.now},

	description: String,
	posted_in: String
})

var Task = mongoose.model('Task', tasksSchema)

module.exports = Task
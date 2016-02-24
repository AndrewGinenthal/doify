var mongoose = require('mongoose');
var userSchema = require('./usermodels.js').schema


var tasksSchema = mongoose.Schema({
	name: String,
	created: {type: Date, default: Date.now},

	description: String,
	posted_in: String,
	posted_by: String //Why couldn't I use the userSchema here?
})

var Task = mongoose.model('Task', tasksSchema)

module.exports = Task
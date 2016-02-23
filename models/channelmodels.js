var mongoose = require('mongoose');

var tasksSchema = require ('./taskmodels.js').schema

var channelsSchema = mongoose.Schema({
	name: String,
	created: {type: Date, default: Date.now},
	description: String,
	tasks:[tasksSchema]
})

var Channel = mongoose.model('Channel', channelsSchema)

module.exports = Channel
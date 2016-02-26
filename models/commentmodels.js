var mongoose = require('mongoose');
var userSchema = require('./usermodels.js').schema


var commentSchema = mongoose.Schema({
	comment: String, 
	commenter: String, //why couldn't I use userSchema here?
	created: {type: Date, default: Date.now},

})

var Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment
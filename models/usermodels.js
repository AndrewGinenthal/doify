var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var tasksSchema = require('./taskmodels.js').schema


var userSchema = mongoose.Schema({
	name: String,
	email: String,
	password: String,
	tasks: [tasksSchema]
})

userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

var User = mongoose.model('User', userSchema);

module.exports = User
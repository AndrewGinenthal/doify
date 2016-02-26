var express = require('express');
var router = express.Router();
var passport = require('passport')

var User = require('../models/usermodels.js')
var Task = require('../models/taskmodels.js')
var Channel = require('../models/channelmodels.js')

//INDEX
router.get('/signup', function(req, res){
			res.render('user/signup.ejs')
	})

//CREATE NEW USER
router.post('/signup', passport.authenticate('local-signup', {
	failureRedirect: '/channels'}), function(req, res){
	console.log(req.user)

	res.redirect('/me/'+req.user.name)
})

//LOGOUT
router.get('/logout', function(req, res){
	console.log(req.locals)
	req.logout();
	res.redirect('/channels')
})

// LOGIN
router.post('/login', passport.authenticate('local-login', {
	failureRedirect: '/channels'}), function(req, res){
	res.redirect('/me/' + req.user.name)

	})


// middleware to check login status
function isLoggedIn(req, res, next) {
	console.log('isLoggedIn middleware');

		
  if (req.isAuthenticated()) {
	
  	console.log("successful login!")
  	return next(); 
  } else {  	
  	console.log("BAD LOGIN")
  	res.redirect('/channels');
  	return
  }
}




//PERSONAL USER PAGE
router.get('/:username', isLoggedIn, function(req, res){
	
	
	// sets local variable 'usertrue' for use on ejs page
	req.params.username == req.user.name ? res.locals.usertrue = true : res.locals.usertrue = false;

	User.findOne({'name' : req.params.username}, function(err, user){
		User.findById(req.user, function(err, current){
			res.render('user/usershow.ejs', { user: user, current})	
		})
		
	})
})

// DELETE INVIDIDUAL POST FROM DASHBOARD VIEW (usershow.ejs)
router.delete("/:user/delete_post", function(req, res){
	
	// my terribly cumbersome delete route. I need to store data more effectively.
	// This first one finds it in the tasks collection/model
	console.log('hitting DASHBOARD delete route')
	Task.findOne({"name" : req.body.task}, function(err, task){
		console.log(req.body)
		task.remove();
		console.log("successfully removed:    " + task)
		res.redirect('/me/' + req.params.user)
	})
	// this one then finds it in the channels collection/model
	Channel.findOne({"name": req.body.posted_in}, function(err, channels){
		console.log("i get an array here:      " + channels.tasks)
		for(var i = 0; i < channels.tasks.length; i++){
			if(channels.tasks[i].name === req.body.task){
				console.log("FOUND A MATCH")
				channels.tasks[i].remove();
				channels.save();
			}else{
				console.log("Did not find task");

			}
		}
	})
	// and finally within the user model
	User.findById(req.user, function(err, user){
		for(var i = 0; i < user.tasks.length; i++){
			if(user.tasks[i].name === req.body.task){
				console.log("found a match within user object")
				user.tasks[i].remove();
				user.save()
			}else{
				console.log("no match within user")
			}
		}
	})


})


// DELETE USER
router.delete('/:username', isLoggedIn, function(req, res){
	req.params.username == req.user.name ? res.locals.usertrue = true : res.locals.usertrue = false;
	User.findById(req.user, function(err, user){
		user.remove(function(err){
			res.redirect('/channels')
		})
	})
})


module.exports = router
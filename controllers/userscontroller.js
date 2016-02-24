var express = require('express');
var router = express.Router();
var passport = require('passport')

var User = require('../models/usermodels.js')
var Task = require('../models/taskmodels.js')

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
	console.log('hitting the LOGOUT route')
	console.log(req.body)
	// console.log(req)
	req.logout();
	res.redirect('/channels')
})

// LOGIN
router.post('/login', passport.authenticate('local-login', {
	failureRedirect: '/channels'}), function(req, res){
	console.log('LOGIN POST IS HAPPENING')
	console.log(req.user)
	res.redirect('/me/' + req.user.name)

	})


// middleware to check login status
// used in show route (BELOW)
function isLoggedIn(req, res, next) {
	console.log('isLoggedIn middleware');

		
  if (req.isAuthenticated()) {
	
  	console.log("did it!")
  	// console.log(req.user) (req.user exists)
  	return next(); 
  } else {  	
  	console.log("fucked up")
  	res.redirect('/channels');
  	return
  }
}




//PERSONAL USER PAGE
router.get('/:username', isLoggedIn, function(req, res){
	
	// res.locals.name = req.params.username

	req.params.username == req.user.name ? res.locals.usertrue = true : res.locals.usertrue = false;

	User.findOne({'name' : req.params.username}, function(err, user){
		User.findById(req.user, function(err, current){
			res.render('user/usershow.ejs', { user: user, current})	
		})
		
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

// DELETE POST FROM USER SHOW
router.delete('/:username/delete_post', isLoggedIn, function(req, res){
	req.params.username == req.user.name ? res.locals.usertrue = true : res.locals.usertrue = false;
	User.findOne(req.user, function(err, user){
		console.log("here are the current tasks:    " + user.tasks)
		
	})			
})



// THIS ROUTE IS REDUNDANT - *****REMOVE******
//CREATE

// router.post('/', function(req, res){
// 	User.create(req.body, function(err, user){
// 		res.redirect('/' + user.id)
// 	})
// })

module.exports = router

// DOCS LOGIN

// router.post('/login', function(req, res, next) {
//   passport.authenticate('local-login', function(err, user, info) {
//     if (err) { return next(err); }
//     if (!user) { return res.redirect('/channels'); }
//     req.logIn(user, function(err) {
//       if (err) { return next(err); }
//       return res.redirect('/me/' + user.name);
//     });
//   })(req, res, next);
// });
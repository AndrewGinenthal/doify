var express = require('express');
var router = express.Router();

var User = require ('../models/usermodels.js')
var Task = require('../models/taskmodels.js')
var Channel = require('../models/channelmodels.js')

// SHOW ALL AVAILABLE CHANNELS, EVENTUALLY IN A DROPDOWN
// links to channel pages
router.get('/', function(req, res){
	console.log("the thing below happens in routes (channels)")
	console.log(res.locals)
	console.log("and now to find the value, below...")
	console.log(res.locals.login)
	console.log("how about just req.user?     " + req.user)
	// console.log("and lastly, req.user.name, will it show below...?")
	// console.log(req.user.name)
	// it will not!



	

	Channel.find({}, function(err, channel){
		User.findById(req.user, function(err, user, dummy){
			res.render('main/main.ejs', {channel: channel, user, dummy})	
		})
		
	});
});

// DISPLAY INDIVIDUAL CHANNEL
router.get('/:name', function(req, res){
	Channel.findOne({ 'name': req.params.name }, function(err, channel){
		console.log(channel.tasks.length)
		res.render('main/show.ejs', {channel: channel})
	})
})

// DISPLAY POST WITHIN CHANNEL

router.get('/:name/:id', function(req, res){
	Channel.findOne({'name' : req.params.name}, function(err, channel){
		Task.findOne({'name': req.params.id}, function(err, task){
			res.render('main/postshow.ejs', {task: task, channel})
		})
	})
})

//CREATE NEW CHANNEL
router.post('/', function(req, res){
	console.log("hitting the route");
	Channel.create(req.body, function(err, channel){
		res.redirect('/channels/'+channel.name)
	});
});



//NEW POST FOR CHANNEL
router.post('/:name/newpost', function(req, res){
	console.log(req.body)
	Channel.findOne({'name': req.params.name}, function(err, channel){
		User.findById(req.user, function(err, user){
			console.log("is user defined?=====" + user)
			console.log("how about req.user?====" + req.user)
			var newTask = new Task(req.body);
			

			newTask.save(function(err, task){

			console.log("here is the task on line 70:    " + task)

			channel.tasks.push(task);
			console.log("==== PUSH HAPPENED ====");
			
			
			user.tasks.push(task)
			console.log("the user push happened too!!!!!!!!!*****&&&&&&")
			user.save(function(err){console.log('woohoo')})
			
			channel.save(function(err){

				console.log("saved " + task.name + " successfully!!!!!")
				res.redirect('/channels/'+channel.name+ '/' + task.name)

		})
		
			})
		})
	})
})


module.exports = router
var express = require('express');
var router = express.Router();

var User = require ('../models/usermodels.js')
var Task = require('../models/taskmodels.js')
var Channel = require('../models/channelmodels.js')
var Comment = require('../models/commentmodels.js')

// SHOW ALL AVAILABLE CHANNELS, EVENTUALLY IN A DROPDOWN
// links to channel pages
router.get('/', function(req, res){

	Channel.find({}, function(err, channel){
		User.findById(req.user, function(err, user, dummy){
			res.render('main/main.ejs', {channel: channel, user, dummy})	
		})
		
	});
});

// DISPLAY INDIVIDUAL CHANNEL
router.get('/:name', function(req, res){
	Channel.findOne({ 'name': req.params.name }, function(err, channel){
		User.findById(req.user, function(err, user){
		res.render('main/show.ejs', {channel: channel, user})	
		})
		
	})
})

// DISPLAY POST WITHIN CHANNEL

router.get('/:name/:id', function(req, res){

	Channel.findOne({'name' : req.params.name}, function(err, channel){
		Task.findOne({'_id': req.params.id}, function(err, task){
			User.findById(req.user, function(err, user){
				// sets usertrue variable for use on ejs
				task.posted_by == user.name ? res.locals.usertrue = true : res.locals.usertrue = false;
				res.render('main/postshow.ejs', {task: task, channel, user})
			})
			
		})
	})
})

// DISPLAY EDIT PAGE

router.get('/:channel/:id/edit', function(req, res){
	
	User.findById(req.user, function(err, user){
		Channel.findOne({'name': req.params.channel}, function(err, channel){
			Task.findOne({'_id': req.params.id}, function(err, task){
		res.render('main/edit.ejs', {task: task, channel, user})		
		})
	})
})
	
})

// POST EDITED TASK CONTENT

router.post('/:channel/:id/edit', function(req, res){
	User.findById(req.user, function(err, user){
		Channel.findOne({'name': req.params.channel}, function(err, channel){
			Task.findOne({'_id': req.params.id}, function(err, task){
				// ==================================
				// my shamefully verbose post devices	
				// ==================================

				// updates within task model itself
				task.name = req.body.name;
				task.description = req.body.description
				
				task.save();
				

			
				// updates task within user model
				for (var i = 0; i < user.tasks.length; i++){

				if(user.tasks[i].id === req.params.id){ //differentiate between _id and id, this was hell!
					console.log("MATCHY MATCHY")
					user.tasks[i].name = req.body.name;
					user.tasks[i].description = req.body.description;
					console.log("reassigned values within user model's 'tasks' key's array")
					user.save();
				}else{
					console.log('NO MATCH')
				}
			}



				// updates task within channel model
				for (var i = 0; i < channel.tasks.length; i++){
					if(channel.tasks[i].id = req.params.id){
						channel.tasks[i].name = req.body.name;
						channel.tasks[i].description = req.body.description;
						channel.save();
					}
				}

				res.redirect('/channels/' + req.params.channel + '/' + req.params.id)		
		})
	})
	})
	
})



// DELETE INDIVIDUAL POST FROM CHANNEL VIEW
router.delete('/:name/:postname', function(req, res){

	// Ask Matt for an elegant solution to this issue!
	// Where should the data have been placed in the first place that only one delete (and edit) would have been needed?
	
	// Remove task within task model
	Task.remove({"name": req.params.postname}, function(err, removed){
		console.log("successfully removed:   " + removed);
	})

	// Remove task within channel model
	Channel.findOne({"name": req.params.name}, function(err, channels){
		console.log("i get an array of current channel's tasks here:      " + channels.tasks)
		for(var i = 0; i < channels.tasks.length; i++){
			if(channels.tasks[i].name === req.params.postname){
				console.log("FOUND A MATCH")
				channels.tasks[i].remove();
				channels.save();
			}else{
				console.log("Did not find task");

			}
		}

	// Remove task within user model
	User.findById(req.user, function(err, user){
		for(var i = 0; i < user.tasks.length; i++){
			if(user.tasks[i].name === req.params.postname){
				user.tasks[i].remove();
				user.save();
			}
		}
	})
		res.redirect('/channels/' + req.params.name)
	})
})


//CREATE NEW CHANNEL
router.post('/', function(req, res){
	Channel.create(req.body, function(err, channel){
		res.redirect('/channels/'+channel.name)
	});
});



//NEW TASK POST FOR CHANNEL
router.post('/:name/newpost', function(req, res){
	console.log(req.body)
	Channel.findOne({'name': req.params.name}, function(err, channel){
		User.findById(req.user, function(err, user){

			var newTask = new Task(req.body);
			

			newTask.save(function(err, task){

			// pushes the task to the channels 'tasks' subdoc - Matt: should I have done this?

			channel.tasks.push(task);
			console.log("the push to the CHANNEL happened!")
			
			// pushes the task to the user's 'tasks' subdoc
			user.tasks.push(task)
			console.log("the push to the USER happened!")
			user.save(function(err){console.log('the USER was saved')})
			
			channel.save(function(err){

				console.log("saved " + task.name + " within CHANNEL!")
				res.redirect('/channels/'+channel.name+ '/' + task.id)

		})
		
			})
		})
	})
})




// COMMENTING
// ADD PUSHES TO REQ.USER
// ADD ROUTE FOR INFINITELY NESTED COMMENTS, LIKE REDDIT
router.post("/:channel/:task/comment", function(req, res){
	
	console.log(req.body)
	Task.findOne({"_id": req.params.task}, function(err, task){
		var newComment = new Comment(req.body);
		newComment.save(function(err, comment){
			task.comments.push(comment)
			console.log("pushing comment to task model")
			task.save(function(err){
				console.log("saved task")
			res.redirect('/channels/'+req.params.channel + '/' + req.params.task)
			});
			
		})
			
			
	})
})


module.exports = router
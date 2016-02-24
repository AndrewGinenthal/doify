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
		User.findById(req.user, function(err, user){
		// if (user == null){user == ""}
		res.render('main/show.ejs', {channel: channel, user})	
		})
		
	})
})

// DISPLAY POST WITHIN CHANNEL

router.get('/:name/:id', function(req, res){
	Channel.findOne({'name' : req.params.name}, function(err, channel){
		Task.findOne({'_id': req.params.id}, function(err, task){
			// console.log("do I find a task here?????" + task)
			User.findById(req.user, function(err, user){
				res.render('main/postshow.ejs', {task: task, channel, user})
			})
			
		})
	})
})

// DISPLAY EDIT PAGE

router.get('/:channel/:id/edit', function(req, res){
	console.log("hitting the edit route" + req.params)
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
	console.log("EDIT **** POST **** ROUTE")
	User.findById(req.user, function(err, user){
		Channel.findOne({'name': req.params.channel}, function(err, channel){
			Task.findOne({'_id': req.params.id}, function(err, task){

				
				task.name = req.body.name;
				task.description = req.body.description
				
				task.save();
				console.log("made update to task model")

				console.log("just to be sure, this is user.tasks.length:      " + user.tasks.length)

					console.log("this should be an array, but it's not?   " + user.tasks)

					for (var i = 0; i < user.tasks.length; i++){
						console.log("req.params.id is:      " + req.params.id)
						console.log("user.tasks[i]._id is:  " + user.tasks[i]._id )
					if(user.tasks[i].id === req.params.id){ //holy fuck
						console.log("MATCHY MATCHY")
						user.tasks[i].name = req.body.name;
						user.tasks[i].description = req.body.description;
						console.log("reassigned values within user model's 'tasks' key's array")
						user.save();
					}else{
						console.log('NO MATCH')
					}
				}




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

// DELETE INDIVIDUAL POST
router.delete('/:name/:postname', function(req, res){
	// console.log("hitting the DELEEEEETE route");
	// console.log(res);

	Task.remove({"name": req.params.postname}, function(err, removed){
		console.log("successfully removed:   " + removed);
	})

	Channel.findOne({"name": req.params.name}, function(err, channels){
		console.log("i get an array here:      " + channels.tasks)
		for(var i = 0; i < channels.tasks.length; i++){
			if(channels.tasks[i].name === req.params.postname){
				console.log("FOUND A MATCH")
				channels.tasks[i].remove();
				channels.save();
			}else{
				console.log("Did not find task");

			}
		}

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

	// Channel.remove({"name": req.params.postname}, function(err, removed){
	// 	console.log(removed)
	// 	console.log("did the second query")
	// })


	// Channel.findOne({'name': req.params.name}, function(err, channel){
	// 	Task.findOne({'name': req.params.id}, function(err, task){
	// 		console.log(task)
	// 		task.remove(function(err){
	// 			res.redirect('/channels/' +req.params.name)
	// 		})
	// 	})
	// })
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
				res.redirect('/channels/'+channel.name+ '/' + task.id)

		})
		
			})
		})
	})
})


module.exports = router
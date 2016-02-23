var express = require('express'),
var router = express.Router();


var Task = require('../models/taskmodels.js')
var User = require('../models/usermodels.js')

//INDEX - DOIFY.COM
router.get('/', function(req, res){
	
		res.render('main/show.ejs')
		
	
})

module.exports = router
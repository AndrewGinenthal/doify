var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
var methodOverride = require('method-override');
var expressSession = require('express-session')

var passport = require('passport');
var session = require('session');


require('./config/passport')(passport);





// MIDDLEWARE
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

// PASSPORT STUFF
app.use(expressSession({ name: 'whut', secret: 'conventional wisdom' }))
app.use(passport.initialize());
app.use(passport.session());


app.use(function(req, res, next) {
  res.locals.login = req.isAuthenticated();
  next();
});



// CONTROLLERS

var usersController = require('./controllers/userscontroller.js');
var channelsController = require('./controllers/channelsconrtroller.js');

app.use('/channels', channelsController)
app.use('/me', usersController)



console.local
app.get('/', function(req, res){
	res.redirect('/channels')
})


// CONNECTION
mongoose.connect('mongodb://localhost:27017/doify')

mongoose.connection.once('open', function(){
  console.log('mongoose connection made')
  
  
  app.listen(3000, function(){
  	console.log('====================')
    console.log('listening');
    console.log('====================')
  })
})
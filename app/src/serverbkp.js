'use strict';
// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var session  = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var path = require('path');


var passport = require('passport');
var flash    = require('connect-flash');

var expressValidator = require('express-validator');
var mysql = require('mysql');
var LocalStrategy = require('passport-local').Strategy;

var app      = express();
var port     = process.env.PORT || 8080;


require('./model/passport')(passport); // pass passport for configuration

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
	secret: 'vidyapathaisalwaysrunning',
	resave: true,
	saveUninitialized: true
 } )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

/*
//look for static files in html folder and allow access without .html extension
app.use(express.static('public', {
    extensions: ['ejs'],
}));

app.set('public', __dirname + '/public');


// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

app.set('view engine', 'ejs'); // set up ejs for templating
//app.engine('ejs', require('ejs').renderFile);

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)



// Not required when we set static path to html folder
//send index.html as homepage 
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index');  //Load index.html
  //res.send("Hello World.......!");
});


// required for passport init
app.use(session({
	secret: 'bpmp',
	resave: true,
	saveUninitialized: true
 } )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});
*/

//route for user login/register
var auth = require('./server/routes/auth.js');
app.use('/auth', auth);




//start the server
app.listen(8080,function(){
    console.log('Server started on port 8080');
});


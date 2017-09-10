/*var express = require('express');
var router = express.Router();
var request = require('request');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var passport = require('passport');



router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(cookieParser());*/

module.exports = function(app, passport) {
	
	//var User = require('../../model/user');
	var LocalStrategy = require('passport-local').Strategy;

	/**
	 * user login handler
	 */
	console.log('Welcome Auth');

	app.get('/', function(req, res) {
			res.render('index'); // load the index.ejs file
		});

	app.get('/login', function(req, res){
		res.render('login', { message: req.flash('loginMessage') });
	});

			
	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/register', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('register.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/register', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/register', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));
	
	// =====================================
	// LOGIN ==============================
	// =====================================
	
	app.post('/login',
	  passport.authenticate('local-login', {successRedirect:'/dashboard', failureRedirect:'/login',failureFlash: true}),
	  function(req, res) {
		console.log('Login Success Matched....');  
		if (req.body.remember) {
		  req.session.cookie.maxAge = 1000*10;
		} 
		else {
		  req.session.cookie.expires = false;
		}
		res.redirect('/');
	  });
	
	// =====================================
	// LOGOUT ==============================
	// =====================================
	
	app.get('/logout', function(req, res) {
		console.log('Logout Success ....');
		req.logout();
		res.redirect('/');
	});
 
	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});
	
	app.get('/dashboard', isLoggedIn, function(req, res) {
			res.render('dashboard.html'); // load the dashboard.ejs file
		});
/**
 * requestMaker() function helps make requests using the request package
 * @param {object} [params] data to be sent in the request
 * @return {object} [res] response from the host
 */
 /*
function requestMaker(params, res) {

    //preparing send data
    var reqData = {
        url: params['reqUrl'],
        method: params['reqMethod'],
        headers: params['reqHeaders'],
        json: params['reqJson']
    };

    request(reqData, function(error, response, body) {

        if (!error && response.statusCode == 200) {
			console.log('Login S');
            return res({
                'success': true,
                'message': response['body']
            });
        } else {
            return res({
                'success': false,
                'message': response['body']
            });
        }
    });
}

 
router.post('/login', function(req, res) {
console.log('---Start Auth--');
   var params = {
        'reqHeaders': {
            'Content-Type': 'application/json'
        },
        'reqUrl': 'http://localhost:8080/user/login',
        'reqMethod': 'POST',
        'reqJson': {
            'username': req.body.username, //data from login form
            'password': req.body.password
        }
    };
console.log(params);
    //post request to hasura auth api
    requestMaker(params, function(response) {
		console.log('-----');
			console.log(response['message']);
			console.log('-----');
		console.log(response["success"]);
        console.log(response['message']['message']);
		if (response["success"]) {
            return res.json({
                'success': true,
                'token': response['message']['auth_token'],
                'uid': response['message']['hasura_id']
            });
        } else {
            return res.json({
                'success': false,
                'message': response['message']['message']
            });
        }
    });
});

*/
/**
 * user registration handler
 */
/*
router.post('/register', function(req, res) {

    //preparing send data
    var params = {
        'reqHeaders': {
            'Content-Type': 'application/json'
        },
        'reqUrl': 'http://localhost:8080/signup',
        'reqMethod': 'POST',
        'reqJson': {
            'username': req.body.username, // data from registration from
            'password': req.body.password,
            'email': req.body.email
        }
    };

    //post request to hasura auth api
    requestMaker(params, function(response) {
        if (response['success']) {
            return res.json({
                'success': true,
                'token': response['message']['auth_token'],
                'uid': response['message']['hasura_id']
            });
        } else {
            return res.json({
                'success': false,
                'message': response['message']['message']
            });
        }
    });
});

//export this router to use in our server.js
//module.exports = router;*/
};

function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/login');
}
// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./db_connection');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);
// expose this function to our app using module.exports
module.exports = function(passport) {
	console.log('Welcome Passport Auth');
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
		console.log('Serial');
		console.log(user);
        done(null, user.user_id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(user_id, done) {
		console.log('DeSerial');
        connection.query("SELECT * FROM bp_users WHERE user_id = ? ",[user_id], function(err, rows){
        console.log(rows[0]);
		done(err, rows[0]);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-signup',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
			console.log('Passport signup Use');
            connection.query("SELECT * FROM bp_users WHERE user_name = ?",[username], function(err, rows) {
                console.log(req.body.uemail);
				if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, req.flash('signupMessage', 'The username is already taken.'));
                } else {
                    // if there is no user with that username
                    // create the user
					//console.log('User newUserMysql');
                    var newUserMysql = {
                        username: username,
                        password: bcrypt.hashSync(password, null, null)  // use the generateHash function in our user model
                    };
console.log(newUserMysql);
                    var insertQuery = "INSERT INTO bp_users ( user_name, user_password,email ) values (?,?,?)";

                    connection.query(insertQuery,[newUserMysql.username, newUserMysql.password,req.body.uemail],function(err, rows) {
                    newUserMysql.user_id = rows.insertId;
/*console.log('User Registered');
console.log(newUserMysql);
console.log('User Registered result');
console.log(rows);*/
                        return done(null, newUserMysql);
                    });
                }
            });
        })
    );

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form
            connection.query("SELECT * FROM bp_users WHERE user_name = ?",[username], function(err, rows){
                console.log(username+'.'+password);
				if (err)
                    return done(err);
                if (!rows.length) {
					console.log('loginMessage No user found.');
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the password is wrong
                if (!bcrypt.compareSync(password, rows[0].user_password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                return done(null, rows[0]);
            });
        })
    );
};
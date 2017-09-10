var mysql = require('mysql');
//var orm = require('orm');

var dbconfig = require('./db_connection');
var connection = mysql.createConnection(dbconfig.connection);
connection.query('USE ' + dbconfig.database);

module.exports.getUserByUsername = function(username, callback){
	console.log('getUserByUsername');
	console.log(username);
	connection.query('select user_id id,user_name,user_password from bp_users where user_name = ?',[username],function(err,result){
		
		if (err){
			  console.log(err.toString());
		}
		if (!result.length) {
                    callback(null,false); // req.flash is the way to set flashdata using connect-flash
        }
		else{
					
					console.log(result);
					console.log('User Validation Success');
					callback(null, result[0]);
		}
    });
	//var query = {username: username};
	//User.findOne(query, callback);
	console.log('getUserByUsername End....');
	
}

module.exports.getUserById = function(id, callback){
	//User.findById(id, callback);
	connection.query('select user_id id,user_name,user_password from bp_users where user_id = ?',[id],function(err,result){
		//console.log('Finish id');
		
		if (err){
			  console.log(err.toString());
		}
		else{
					
					console.log(result);
					console.log('User id Validation Success');
					callback(null, result[0]);
		}
    });
	
	console.log('getUserByUserid End....');
}
	
module.exports.comparePassword = function(candidatePassword, hash, callback){
	/*bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
   	if(err) throw err;
    	callback(null, isMatch);
	});*/
	console.log(candidatePassword);
	console.log(hash);
	if (candidatePassword===hash){
		callback(null, true);
	}
	else {
		callback(null, false);
	}
}

module.exports.getUserExpenses = function(user_id, callback){
	console.log('Inside getUserExpenses');
	
	connection.query('select * from bp_user_expenses where user_id = ?',[user_id],function(err,result){
		
		if (err){
			console.log(err.toString());
		}
		if (!result.length) {
            callback(null,false); 
        }
		else{
			console.log(result);
			callback(null, result);
		}
    });
	
	
}
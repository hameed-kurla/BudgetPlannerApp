//getUserExpenses
module.exports = function(app, user) {
	
	app.get('/items', function(req, res) {
		console.log('Get Items');
		//console.log(req.user.user_id);
		var l_user_id=req.user.user_id;
		user.getUserExpenses(l_user_id, function(err, items){
	      	if(err) throw err;
			if(!items){
				return res.json({
					'success': true,
					'message': 'No Items Found'
				});
			}
			
			return res.json({
					'success': true,
					'message': items
            });
			
			//console.log(items);
		});
	});
}
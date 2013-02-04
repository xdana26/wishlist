exports.display = function(req, res, user){
		console.log(res.app.locals.inspect(user));
		res.render('wishlists_cont_display', { 
			title: 'Welcome',
			name: user.Firstname
		});
}
exports.newUser = function(req, res, user){
		console.log(res.app.locals.inspect(user));
		res.render('wishlists_cont_newUser', {
			title: 'Welcome', 
			name: user.Firstname

		});
}

//Will load the index page
exports.index = function(req, res){
  res.render('users_cont_index', { title: 'Wishlist', domain: res.app.settings.domain});
};

//login authentication happens here
exports.auth = function(req, res){
	//body variable gives us the information from the webpage
	var email = req.body.user_email;
	var pass = req.body.password;
	//database can now be accessed
	var database = database.require('./database').connect();	

	var query = "SELECT * FROM Users WHERE Email_addr="+database.escape(email)+"and Password="+database.escape(pass);
	console.log(query);
	database.query(query, function(err, rows, fields){
		//rows object contains all the information
		if(err){
			//handle the response to the default_error controller
			res.app.settings.default_error_cont.dbConError(req, res, err);
			return;
		}	
		console.log(rows);
		if(rows.length === 0){
			//if there is no one in the database with the login info.
			res.render('users_cont_auth_fail', { title: 'Login Failed'})
		}
		else{
			//otherwise hand the request to the wishlish controller
			res.app.settings.wishlists_cont.display(req, res, rows[0]);
		}
	})
	database.end();
};

exports.addUser = function(req, res){
	//body variable gives us the information from the webpage
	var user = {
		Firstname : req.body.firstName,
		Lastname : req.body.lastName,
		Email_addr : req.body.user_email,
		Password : req.body.password
	};
	var pass2 = req.body.pass2;

	if(user.Password != pass2){
		res.render('users_cont_addUser_fail',{title: 'Password does not match', message: 'The passwords you entered do not match'});
		return;
	}
	//database can now be accessed
	var database = require('./database').connect();
	var query = "INSERT INTO Users (Email_addr, Password, Lastname, Firstname) VALUES ("
		+database.escape(user.Email_addr)+","
		+database.escape(user.Password)+","
		+database.escape(user.Lastname)+","
		+database.escape(user.Firstname) +");";
	console.log(query);
	database.query(query, function(err, rows, fields){
		//rows object contains all the information
		if(err){
			if(err.code.match('ER_DUP_ENTRY')){
				res.render('users_cont_addUser_fail',{title: 'Account Exists', message: 'You already have an account with us'});
				return;
			}
			//handle the response to the default_error controller
			res.app.settings.default_error_cont.dbConError(req, res, err);
			return;
		}	
		//if everything works out well
		res.app.settings.wishlists_cont.newUser(req, res, user);
	})
	database.end();
};
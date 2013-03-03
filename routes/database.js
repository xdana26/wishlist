exports.connect = function(){
	var mysql = require('mysql');
	connection = mysql.createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  password : '1234'
	});

	connection.connect(function(err) {
	  if (err) throw err;
	  
	});

	connection.query("use app_wishlist;");	
	return connection;
}
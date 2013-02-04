//This page hits when the url does not match one of page that we have defined

exports.PageNotFound = function(req, res){
  res.status(404).render('default_error', { 
  	title: 'Page does not exist', 
  	message:'Please make sure that the URL you entered is correct' 
  } );
};
exports.dbConError = function(req, res, err){
  err = err || "";
  res.status(404).render('default_error', { 
  	title: 'Database Error', 
	message: 'We appologize for this inconvenience.<br> We are having difficulty with our database<br>'+err+'<br><br>Please try again in some time'
  } );
};

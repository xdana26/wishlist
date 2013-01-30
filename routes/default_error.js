//This page hits when the url does not match one of page that we have defined

exports.error = function(req, res){
  res.status(404).render('error');
};

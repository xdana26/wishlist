
/**
 * Module dependencies.
 */
var domain = 'localhost';

var express = require('express')
  , engine = require('ejs-locals')
  , users_cont = require('./routes/users_controller')
  , default_error_cont = require('./routes/default_error_controller')
  , wishlists_cont = require('./routes/wishlists_controller')
  , mysql = require('mysql')
  , http = require('http')
  , path = require('path');

var app = express();

app.engine('ejs', engine);

var mysql      = require('mysql');
connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '1234'
});

connection.connect(function(err) {
  if (err) throw err;
});

connection.query("use app_wishlist;");

//app.locals.webroot = "http://localhost:3000";

console.log(app.routes);
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.set('domain',domain);             //available at res.app.settings.domain
  app.set('database', connection);        //available at res.app.settings.database
  app.set('wishlists_cont', wishlists_cont);
  app.set('default_error_cont',default_error_cont);

  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  
  app.use(require('stylus').middleware({ 
    src: __dirname + '/public',
    compres: true
  }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

//for debugging purpose..if you want to print a js object 
//you can use console.log(res.app.locals.inspect(js-object));
app.locals.inspect = require('util').inspect;

app.get('/', users_cont.index);
app.post('/',users_cont.auth);
app.post('/newAccount',users_cont.addUser);
app.get('/*', default_error_cont.PageNotFound);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

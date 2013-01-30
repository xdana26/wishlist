
/**
 * Module dependencies.
 */
var domain = 'localhost';

var express = require('express')
  , engine = require('ejs-locals')
  , routes = require('./routes')
  , user = require('./routes/user')
  , default_error = require('./routes/default_error')
  , http = require('http')
  , path = require('path');

var app = express();

app.engine('ejs', engine);

//app.locals.webroot = "http://localhost:3000";

console.log(app.routes);
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.set('domain',domain);             //available at res.app.settings.domain
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/*', default_error.error);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

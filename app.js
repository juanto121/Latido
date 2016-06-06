var express		= require('express'),
	app			= express(),
	port		= process.env.PORT || 5000,
	server		= require('http').createServer(app),
	morgan		= require('morgan'),
	bodyParser	= require('body-parser'),
	route		= require('./app/routes.js');

/*
var fs 			= require('fs'),
	https		= require('https'),
	privateKey 	= fs.readFileSync('./certificates/server.key','utf8'),
	certificate = fs.readFileSync('./certificates/server.crt', 'utf8'),
	credentials = {key: privateKey, cert: certificate},
	serverssl 	= require('https').createServer(credentials, app),
	portssl 	= process.env.PORT_SSL || 443;
*/

// Set-up	============================================

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/public/views');

app.use(express.static( __dirname +'/public'));
app.use(express.static(__dirname));

// Routes	============================================

route(app);

// Run		============================================

app.listen(port,function(){
	console.log("Listening port: " + port);
});
/*
serverssl.listen(portssl, function(){
	console.log("Listening port:" + portssl);
});
*/
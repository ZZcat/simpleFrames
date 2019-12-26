const express = require('express');
const app = express();
const http = require('http')
const https = require('https')
const io = require('socket.io')(server);
const path = require('path');
const crypto = require('crypto');
const fs = require("fs");
var bodyParser = require('body-parser');
var LocalStrategy = require('passport-local').Strategy;
var logger = require('morgan');
var passport = require('passport');
var session = require('express-session');

var privateKey = fs.readFileSync('keys/server.key').toString();
var certificate = fs.readFileSync('keys/server.crt').toString();
//var credentials = crypto.createCredentials({key: privateKey, cert: certificate});
var options = {key: privateKey,cert: certificate};



function requireHTTPS(req, res, next) {
  // The 'x-forwarded-proto' check is for Heroku
  if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "development") {
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
}


if (process.env.NODE_ENV === 'production') {
 console.log("RELEASE, auto forwarding http to https for herokuapp"); //do production stuff
 app.use(requireHTTPS); /// Improve this
} //console.log(process.env._);

app.use(
 //function (req, res, next) {
  express.static(path.join(__dirname, 'iframe'))
 // next()
 //}
);

var passwd = 1235;

/*io.on('connection', (socket) => {
  socket.ccode = 12341;
  socket.emit("challenge", socket.ccode);

  //console.log(socket.ccode)

  socket.on('response', (data) => {
    socket.cpass = 1; // Autopass
		socket.emit('CRresult', {
			result: socket.cpass
		});
	});

  socket.on('echo', (data) => {
		socket.emit('echo', {
			message: data
		});
	});
});*/

var port = process.env.PORT || 8080;

var server = http.createServer(options);
//app);

//server.setSecure(credentials);

//server.listen(port, function() {
//	console.log('Server listening at port %d', port);
//});


// Create a service (the app object is just a callback).

// Create an HTTP service.
http.createServer(app).listen(port);
// Create an HTTPS service identical to the HTTP service.
//https.createServer(options, app).listen(port);
// Tests
console.log("Used port:"+port);

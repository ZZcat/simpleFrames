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

/*app.use(
  express.static(path.join(__dirname, 'iframe'))
);*/

//var passwd = 1235;

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

/////////////////


/**
 * Configure Passport
 */

passport.use(new LocalStrategy(
  function(username, password, done) {
    fs.readFile('passwords.txt', function(err, data) {
      if(err) {
        console.log("Unable to read password file");
        return done('could not read passwords file');
      }
      var passwords = data.toString();
      var list = passwords.split('\n');
      for(var i=0; i<list.length; i++) {
        var parts = list[i].trim().split(',');
        if(parts.length === 2 && username === parts[0] && password === parts[1]) {
          return done(null, {
            user: username 
          });
        }
      }
      return done('Cannot GET /login');
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

var requireAuth = function(req, res, next) {
  if(!req.isAuthenticated()) {
    console.log("Unauth... out you go.");
    return res.redirect('/');
  }
  return next();
}

/**
 * Middleware
 */


//app.set("trust proxy",1); // Test for cookies ////
//app.enable('trust proxy'); // optional, not needed for secure cookies ////
/////////// More tests Start

/*app.all('*', function(req, res, next) {

    res.setHeader("Access-Control-Allow-Origin", "https://mather5.herokuapp.com/");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
});///// More tests end*/


app.use(bodyParser());
app.use(logger('dev'));
app.use(session({
  secret: 'some secret',
  resave: false, //true,
  saveUninitialized: false, //true,
  //expires: new Date(Date.now() + (0)),
  //maxAge: 10 * 1000,
  //origin: "",
  //proxy: true, //// Reverse proxy... week security
  //cookie: {maxAge: 10*1000}
  cookie: { 
    expires: new Date(Date.now() + (3*3600*1000))
    //secure: true,
    //maxAge: 12*1000,
    //path: "/"
    //httpOnly: true
  } // logout time in ms.. set to 2 minutes
  
}));
app.use(passport.initialize());
app.use(passport.session());
app.post('/login', passport.authenticate('local', { 
  failureRedirect: '/'
}), function(req, res) {
  console.log("Auth passed, redir'ing to /menu");
  return res.redirect('/menu');
});

/**
 * Routes 
 */

app.get('/logout', function(req, res){
               req.logout();
               res.redirect('/');
});



app.use('/quadratics', requireAuth, express.static('iframe'));
app.use('/menu', requireAuth, express.static('menu'));
app.use('/constant', requireAuth, express.static('fun'));
app.use(express.static('public'));


//////////////



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

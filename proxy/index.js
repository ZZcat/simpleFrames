var proxy = require('express-http-proxy');
var app = require('express')();
const server = require('http').createServer(app);
 
app.use('/', proxy('surviv.io'));


server.listen(3000, function() {
	console.log('Server listening at port %d', 3000);
});
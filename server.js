var express = require('express'),
    path = require('path'),
    http = require('http'),
    socket = require('./routes/socket.js');

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser()),
    app.use(express.static(path.join(__dirname, 'public')));
});


var server = http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});

// Socket.io Communication
// Hook Socket.io into Express
var io = require('socket.io').listen(server);
io.sockets.on('connection', socket);

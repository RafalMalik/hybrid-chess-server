var socket = require('socket.io'),
    http = require('http'),
    server = http.createServer(),
    socket = socket.listen(server);

var Chess = require('chess.js').Chess;

socket.on('connection', function (connection) {
    console.log('User Connected');

    var game = new Chess();

    connection.on('message', function (msg) {
        socket.emit('message', msg);
    });

    connection.on('disconnect', function () {
        console.log('No to narazie');
    });

    connection.on('move', function (param) {
		console.log(param.targetfield);
        var result = game.move(param.targetfield);
		console.log(result);
        console.log(game.ascii());
    });
});

server.listen(3000, function () {
    console.log('Server started');
});
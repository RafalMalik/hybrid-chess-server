var socket = require('socket.io'),
    http = require('http'),
    server = http.createServer(),
    socket = socket.listen(server);

var Chess = require('./chess').Chess;

socket.on('connection', function (connection) {
    console.log('User Connected');

    var game = new Chess();

    connection.on('message', function (msg) {
        socket.emit('message', msg);
    });

    connection.on('disconnect', function () {
        console.log('No to narazie');
    });

    connection.on('move', function (code) {
        console.log('move' + code);
        var result = game.move({ from: code[0], to: code[1] });
        console.log(result);
    });
});

server.listen(3000, function () {
    console.log('Server started');
});
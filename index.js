var socket = require('socket.io'),
    http = require('http'),
    server = http.createServer(),
    socket = socket.listen(server);

socket.on('connection', function(connection) {
    console.log('User Connected');
    connection.on('message', function(msg){
        socket.emit('message', msg);
    });

    connection.on('disconnect', function () {
       console.log('No to narazie');
    });
});

server.listen(3000, function(){
    console.log('Server started');
});
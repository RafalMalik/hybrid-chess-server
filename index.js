var socket = require('socket.io'),
    http = require('http'),
    server = http.createServer(),
    socket = socket.listen(server);

var Lobby = require("./Lobby/Lobby");
var lobby = new Lobby();

var GameList = require("./GameList/GameList");
var gameList = new GameList();

var questionId = 0;

socket.on('connection', function (connection) {
    console.log('User Connected');

    lobby.add(connection.id);

    socket.sockets.connected[connection.id].emit('welcome', connection.id);

    socket.emit("lobby",  lobby.getPlayers());

    connection.on('message', function (msg) {
        socket.emit('message', msg);
    });

    connection.on('invite', function (players) {
       console.log(players.my);
       console.log(players.on);
       socket.sockets.connected[players.on].emit('invite', players.my);
    });

    connection.on('join', function (players) {
        socket.sockets.connected[players.my].emit('init-game', 1);
        socket.sockets.connected[players.on].emit('init-game', 1);
    });

    connection.on('create-game', function () {

    });



    connection.on('disconnect', function () {

        lobby.remove(connection.id);

    });


});


var playersAll = 0;
var nsp = socket.of('/game');
nsp.on('connection', function(socket){
    console.log('mamy gracza');

    playersAll++;


    if (playersAll >= 2) {
        nsp.emit('start-game', {
            'round' : 5,
            'time' : 2500,
            'questions' : [
                {
                    'content' : 'Pytanie numer 1',
                    'a' : 'Odpowiedz a',
                    'b' : 'Odpowiedz b',
                    'c' : 'Odpowiedz c',
                    'd' : 'Odpowiedz d',
                    't' : 'a'
                },
                {
                    'content' : 'Pytanie numer 2',
                    'a' : 'Odpowiedz a',
                    'b' : 'Odpowiedz b',
                    'c' : 'Odpowiedz c',
                    'd' : 'Odpowiedz d',
                    't' : 'b'
                },
                {
                    'content' : 'Pytanie numer 3',
                    'a' : 'Odpowiedz a',
                    'b' : 'Odpowiedz b',
                    'c' : 'Odpowiedz c',
                    'd' : 'Odpowiedz d',
                    't' : 'c'
                },
                {
                    'content' : 'Pytanie numer 4',
                    'a' : 'Odpowiedz a',
                    'b' : 'Odpowiedz b',
                    'c' : 'Odpowiedz c',
                    'd' : 'Odpowiedz d',
                    't' : 'd'
                },
                {
                    'content' : 'Pytanie numer 5',
                    'a' : 'Odpowiedz a',
                    'b' : 'Odpowiedz b',
                    'c' : 'Odpowiedz c',
                    'd' : 'Odpowiedz d',
                    't' : 'a'
                }
            ]

        });
    }

    socket.on('get-question', function (parameters) {

        if (playersAll > 2) {
            console.log('emituje ' + questionId++);
            nsp.emit('question', {
                'id': questionId
            });
        } else {
            nsp.emit('waiting');
        }

    });

    socket.on('end-game', function(parameters) {
        console.log(socket.id + ' skonczyl gre');
        console.log(parameters);
        parameters.answers.forEach(function(answer){
            console.log(answer);
        });
    });

    socket.on('disconnect', function () {
       playersAll--;

       if (playersAll < 2) {
           console.log('kurwa chopoczki, ogarnijcie sie!');
       }
    });

});



server.listen(3000, function () {
    console.log('Server started');
});
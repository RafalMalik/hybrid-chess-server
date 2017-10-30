var socket = require('socket.io'),
    http = require('http'),
    server = http.createServer(),
    socket = socket.listen(server);

var Lobby = require("./Lobby/Lobby");
var lobby = new Lobby();

var GameList = require("./GameList/GameList");
var gameList = new GameList();

socket.on('connection', function (connection) {

    lobby.welcomeNewPlayer(socket, connection);

    connection.on('invite', function (players) {
        console.log(players);
       lobby.emitTo(socket, 'invite', players.player2, {
            'player1': players.player1,
            'player2': players.player2
       });
    });

    connection.on('join', function (players) {
        var game = {
            'player1': players.player1,
            'player2': players.player2,
            'id' : 1
        };

        gameList.addGame(players.player1, players.player2);

        lobby.emitTo(socket, 'init-game', players.player1, game);
        lobby.setPlayerStatus(players.player1, 1);

        lobby.emitTo(socket, 'init-game', players.player2, game);
        lobby.setPlayerStatus(players.player2, 1);

        socket.emit("lobby", lobby.getPlayers());

    });

    connection.on('discard', function(players) {
       lobby.emitTo(socket, 'discard-invite', players.player1, {
           player: players.player2
       });
    });

    connection.on('disconnect', function () {
        lobby.removePlayer(connection.id);
    });

});

var nsp = socket.of('/game');
nsp.on('connection', function(socket){

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

    socket.on('end-game', function(parameters) {
        console.log(socket.id + ' skonczyl gre');
        // console.log(parameters);
        // parameters.answers.forEach(function(answer){
        //     console.log(answer);
        // });
        if (gameList.markReadyBySocket(socket.id)) {
            //let game = gameList.getGameBySocket(socket.id);
            nsp.emit('end-game', {

            });
        }
        //let index = gameList.getGameIdBySocket(socket.id);
        console.log(index);
    });

    socket.on('disconnect', function () {

    });

});



server.listen(3000, function () {
    console.log('Server started');
});
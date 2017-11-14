var socket = require('socket.io'),
    http = require('http'),
    server = http.createServer(),
    socket = socket.listen(server);

var Lobby = require("./Lobby/Lobby");
var lobby = new Lobby();

var GameList = require("./GameList/GameList");
var gameList = new GameList();

socket.on('connection', function (connection) {


    let id = connection.request._query['playerId'];

    if (id == -1) {
        lobby.welcomeNewPlayer(socket, connection);
    } else {
        lobby.oldPlayer(id, socket, connection);
    }



    connection.on('invite', function (players) {
        lobby.emitTo(socket, 'invite', players.player2.socket, {
            'player1': players.player1,
            'player2': players.player2
        });
    });

    connection.on('join', function (players) {
        gameId = gameList.addGame(players.player1, players.player2);

        lobby.emitTo(socket, 'init-game', players.player1.socket, gameList.getById(gameId));
        lobby.setPlayerStatus(players.player1, 1);

        lobby.emitTo(socket, 'init-game', players.player2.socket, gameList.getById(gameId));
        lobby.setPlayerStatus(players.player2, 1);

        socket.emit("lobby", lobby.getPlayers());

    });

    connection.on('discard', function (players) {
        lobby.emitTo(socket, 'discard-invite', players.player1, {
            player: players.player2
        });
    });

    connection.on('disconnect', function () {
        console.log('Wychodze z gry' + connection.id);
        //lobby.removePlayer(connection.id);
    });

});

var nsp = socket.of('/game');
nsp.on('connection', function (socket) {

    nsp.emit('start-game', {
        'round': 5,
        'time': 2500,
        'questions': [
            {
                'content': 'Pytanie numer 1',
                'a': 'Odpowiedz a',
                'b': 'Odpowiedz b',
                'c': 'Odpowiedz c',
                'd': 'Odpowiedz d',
                't': 'a'
            },
            {
                'content': 'Pytanie numer 2',
                'a': 'Odpowiedz a',
                'b': 'Odpowiedz b',
                'c': 'Odpowiedz c',
                'd': 'Odpowiedz d',
                't': 'b'
            },
            {
                'content': 'Pytanie numer 3',
                'a': 'Odpowiedz a',
                'b': 'Odpowiedz b',
                'c': 'Odpowiedz c',
                'd': 'Odpowiedz d',
                't': 'c'
            },
            {
                'content': 'Pytanie numer 4',
                'a': 'Odpowiedz a',
                'b': 'Odpowiedz b',
                'c': 'Odpowiedz c',
                'd': 'Odpowiedz d',
                't': 'd'
            },
            {
                'content': 'Pytanie numer 5',
                'a': 'Odpowiedz a',
                'b': 'Odpowiedz b',
                'c': 'Odpowiedz c',
                'd': 'Odpowiedz d',
                't': 'a'
            }
        ]

    });

    socket.on('end-game', function (parameters) {
        let game = gameList.getById(parameters.id);
        game.savePoints(parameters.playerId, parameters.points);

        // gameList.markReadyById(index);
        if (game.isFinished()) {
            //let game = gameList.getGameBySocket(socket.id);
            let results = game.getResults();
            nsp.emit('end-game', {
                'results': results,
                'game': game
            });

            console.log('Wychodze z gry' + game.player1.socket);
            console.log('Wychodze z gry' + game.player2.socket);
            lobby.removePlayer(game.player1.socket);
            lobby.removePlayer(game.player2.socket);

        }
    });

    socket.on('disconnect', function (connection) {

    });

});


server.listen(3000, function () {
    console.log('Server started');
});
var socket = require('socket.io'),
    http = require('http'),
    server = http.createServer(),
    socket = socket.listen(server);

var Lobby = require("./Lobby/Lobby");
var lobby = new Lobby();

var GameList = require("./GameList/GameList");
var gameList = new GameList();

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://193.70.113.241:27017/hybrid-quiz";

MongoClient.connect(url, function (err, db) {
    if (err) {
        throw err;
    }

    socket.on('connection', function (connection) {

        let id = connection.request._query['playerId'];

        console.log(id);

        if (id == -1) {
            lobby.newPlayer(socket, connection);
        } else {
            lobby.oldPlayer(id, socket, connection);
        }

        connection.on('invite', function (players) {
            console.log(players);
            lobby.emitTo(socket, 'invite', players.player2.socket, {
                'player1': players.player1,
                'player2': players.player2
            });
        });

        connection.on('join', function (players) {

            var questions = Array();
            var settings = {
                'round': 5,
                'time': 10
            };


            var tmp = db.collection('questions').aggregate([{$sample: {size: 5}}]).toArray(function (err, coll) {

                let gameId = gameList.addGame(players.player1, players.player2, settings, coll);

                lobby.emitTo(socket, 'init-game', players.player1.socket, gameList.getById(gameId));
                lobby.setPlayerStatus(players.player1.id, 1);

                lobby.emitTo(socket, 'init-game', players.player2.socket, gameList.getById(gameId));
                lobby.setPlayerStatus(players.player2.id, 1);

                socket.emit("lobby", lobby.getPlayers());
            });


        });

        connection.on('discard', function (players) {
            lobby.emitTo(socket, 'discard-invite', players.player1, {
                player: players.player2
            });
        });

        connection.on('disconnect', function () {
            lobby.removePlayer(connection.id);
            console.log('Wychodze z gry' + connection.id);

            socket.emit("lobby", lobby.getPlayers());
        });

    });

    var nsp = socket.of('/game');
    nsp.on('connection', function (socket) {

        socket.on('end-game', function (parameters) {
            let game = gameList.getById(parameters.id);
            game.savePoints(parameters.playerId, parameters.points);

            // gameList.markReadyById(index);
            if (game.isFinished()) {
                //let game = gameList.getGameBySocket(socket.id);
                let results = game.getResults();
                console.log(results);
                nsp.emit('end-game', {
                    'results': results,
                    'game': game
                });

                console.log('Wychodze z gry' + game.player1.socket);
                console.log('Wychodze z gry' + game.player2.socket);
                lobby.removePlayer(game.player1.socket);
                lobby.removePlayer(game.player2.socket);
                gameList.removeGame(parameters.id);

            }
        });

        socket.on('end-time', function (parameters) {
            console.log('ebd time kurwa');

            let game = gameList.getById(parameters.id);
            game.savePoints(parameters.playerId, parameters.points);

            // gameList.markReadyById(index);
            if (game.isFinished()) {
                //let game = gameList.getGameBySocket(socket.id);
                let results = game.getResults();
                console.log(results);
                nsp.emit('end-game', {
                    'results': results,
                    'game': game
                });

                console.log('Wychodze z gry' + game.player1.socket);
                console.log('Wychodze z gry' + game.player2.socket);
                lobby.removePlayer(game.player1.socket);
                lobby.removePlayer(game.player2.socket);
                gameList.removeGame(parameters.id);

            }
        });

        socket.on('disconnect', function (connection) {
            lobby.removePlayer(connection.id);

            socket.emit("lobby", lobby.getPlayers());
        });

    });


    server.listen(3000, function () {
        console.log('Server started');
    });

    console.log("Polaczono z baza!");
    //db.close();
});

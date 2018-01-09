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
            lobby.emitTo(socket, 'invite', players.player2.socket, {
                'player1': players.player1,
                'player2': players.player2
            });
        });

        connection.on('join', function (players) {

            var questions = Array();
            var settings = {
                'round': 5,
                'time': 60
            };

            var tmp = db.collection('questions').aggregate([{$sample: {size: settings.round}}]).toArray(function (err, coll) {

                let gameId = gameList.addGame(players.player1, players.player2, settings, coll);

                // lobby.emitTo(socket, 'init-game', players.player1.socket, gameList.getById(gameId));
                lobby.setPlayerStatus(players.player1.id, 1);

                // lobby.emitTo(socket, 'init-game', players.player2.socket, gameList.getById(gameId));
                lobby.setPlayerStatus(players.player2.id, 1);

                socket.sockets.connected[players.player1.socket].join(gameId);
                socket.sockets.connected[players.player2.socket].join(gameId);

                socket.to(gameId).emit('init-game', gameList.getById(gameId));


                socket.emit("lobby", lobby.getPlayers());
            });


        });

        connection.on('discard', function (players) {
            lobby.emitTo(socket, 'discard-invite', players.player1.socket, {
                player: players.player2
            });
        });

        connection.on('disconnect', function () {
            lobby.removePlayer(connection.id);
            console.log('Wychodze z gry' + connection.id);

            socket.emit("lobby", lobby.getPlayers());
        });


        connection.on('end-game', function (parameters) {
            let game = gameList.getById(parameters.id);
            game.savePoints(parameters);

            if (game.isFinished()) {
                let results = game.getResults();
                console.log(results);
                socket.to(parameters.id).emit('end-game', {
                    'results': results,
                    'game': game
                });

                lobby.setPlayerStatus(game.player1.id, 0);
                lobby.setPlayerStatus(game.player2.id, 0);

                socket.sockets.connected[game.player1.socket].leave(parameters.id);
                socket.sockets.connected[game.player2.socket].leave(parameters.id);

                socket.sockets.connected[game.player1.socket].disconnect();
                socket.sockets.connected[game.player2.socket].disconnect();

                db.collection("games").insertOne(game, function (err, res) {
                    if (err) throw err;
                    console.log("Gra zapisana");
                });

                gameList.removeGame(parameters.id);

            }
        });

        connection.on('end-time', function (parameters) {
            let game = gameList.getById(parameters.id);
            game.savePoints(parameters);


            if (game.isFinished()) {
                let results = game.getResults();
                socket.to(parameters.id).emit('end-game', {
                    'results': results,
                    'game': game
                });

                lobby.setPlayerStatus(game.player1.id, 0);
                lobby.setPlayerStatus(game.player2.id, 0);


                socket.sockets.connected[game.player1.socket].leave(parameters.id);
                socket.sockets.connected[game.player2.socket].leave(parameters.id);

                socket.sockets.connected[game.player1.socket].disconnect();
                socket.sockets.connected[game.player2.socket].disconnect();

                db.collection("games").insertOne(game, function (err, res) {
                    if (err) throw err;
                    console.log("Gra zapisana");
                });

                gameList.removeGame(parameters.id);

            }
        });

        var timer = setInterval(function () {
            socket.emit("lobby", lobby.getPlayers());
        }, 5000);

    });

    server.listen(3001, function () {
        console.log('Server started');
    });

    console.log("Polaczono z baza!");
    //db.close();
});

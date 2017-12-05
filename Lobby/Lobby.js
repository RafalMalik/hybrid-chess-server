var Player = require('./../Models/Player');

class Lobby {

    constructor() {
        this.nextPlayerId = 1;
        this.players = [];
    }

    addNewPlayer(socket) {
        console.log('DODAJE ID : ' + socket);
        this.players.push(new Player(this.nextPlayerId, socket));
        this.nextPlayerId++;

        return this.nextPlayerId - 1;
    }

    addOldPlayer(id, socket) {
        this.players.push(new Player(id, socket));

        return id;
    }

    updatePlayerSocket(id, socket, connection) {
        let player = this.players.filter(function(player){
            return player.id !== id;
        });

        player.socket = connection.id;

        socket.sockets.connected[connection.id].emit('update-socket', {
            'socket' : connection.id
        });

        socket.emit("lobby", this.getPlayers());
    }

    removePlayer(socketId) {
        this.players = this.players.filter(function(player){
            return player.socket !== socketId;
        });
        console.log("Goodbye, " + socketId);
    }
    getPlayers() {
        return this.players;
    }

    setPlayerStatus(id, status) {
        for (let player of this.players) {

            if (player.id == id) {
                player.status = status;
            }
        }
    }

    newPlayer(socket, connection) {
        console.log('User Connected');

        let playerId = this.addNewPlayer(connection.id);
        socket.sockets.connected[connection.id].emit('welcome', {
            'id' : playerId,
            'socket' : connection.id
        });
        socket.emit("lobby", this.getPlayers());
    }

    oldPlayer(id, socket, connection) {
        console.log('User Connected');

        let playerId = this.addOldPlayer(id, connection.id);
        socket.sockets.connected[connection.id].emit('welcome', {
            'id' : playerId,
            'socket' : connection.id
        });
        socket.emit("lobby", this.getPlayers());
    }

    emitTo(socket, event, to, parameters) {
        socket.sockets.connected[to].emit(event, parameters);
    }

    setPlayerSocket(id, socket) {
        for (let player of this.players) {

            if (player.id == id) {
                player.socket = sock;
            }
        }
    }



}

module.exports = Lobby;
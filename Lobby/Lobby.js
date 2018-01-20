var Player = require('./../Models/Player');

class Lobby {

    constructor() {
        this.nextPlayerId = 1;
        this.players = [];
    }

    addNewPlayer(socket) {
        let player = new Player(this.nextPlayerId, socket);
        this.players.push(player);
        this.nextPlayerId++;

        return player;
    }

    addOldPlayer(id, socket) {
        let player = new Player(id, socket);
        this.players.push(player);

        return player;
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
        let player = this.addNewPlayer(connection.id);
        socket.sockets.connected[connection.id].emit('welcome', {
            'id' : player.id,
            'socket' : connection.id,
            'avatar' : player.avatar
        });
        socket.emit("lobby", this.getPlayers());
    }

    oldPlayer(id, socket, connection) {
        let player = this.addOldPlayer(id, connection.id);
        socket.sockets.connected[connection.id].emit('welcome', {
            'id' : player.id,
            'socket' : connection.id,
            'avatar' : player.avatar
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
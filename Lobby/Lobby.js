var Player = require('./../Models/Player');

class Lobby {

    constructor() {
        this.nextPlayerId = 1;
        this.players = [];
    }

    addNewPlayer(socket) {
        console.log('DODAJE ID : ' + socket);
        console.log("ID: " + this.nextPlayerId);
        this.players.push(new Player(this.nextPlayerId, socket));
        this.nextPlayerId++;

        return this.nextPlayerId - 1;
    }

    addOldPlayer(id, socket) {
        console.log('DODAJE socket : ' + id);
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

            if (player.socket == id) {
                player.status = status;
            }
        }
    }

    welcomeNewPlayer(socket, connection) {
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

        console.log(connection);

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



}

module.exports = Lobby;
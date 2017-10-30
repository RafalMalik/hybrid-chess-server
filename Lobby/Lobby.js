var Player = require('./../Models/Player');

class Lobby {

    constructor() {
        this.nextPlayerId = 1;
        this.players = [];
    }

    addPlayer(id) {
        console.log('DODAJE ID : ' + id);
        this.players.push(new Player(this.nextPlayerId, id));
        this.nextPlayerId++;

        return this.nextPlayerId - 1;
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

        let playerId = this.addPlayer(connection.id);
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
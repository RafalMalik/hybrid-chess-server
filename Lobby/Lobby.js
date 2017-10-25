var Player = require('./../Models/Player');

class Lobby {

    constructor() {
        this.players = [];
    }

    add(id) {
        this.players.push(new Player(id))
    }
    remove(id) {
        this.players = this.players.filter(function(player){
            return player.id !== id;
        });
        console.log("Goodbye, " + id);
    }
    getPlayers() {
        return this.players;
    }
}

module.exports = Lobby;
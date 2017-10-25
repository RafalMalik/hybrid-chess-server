var Game = require('./../Models/Game');

class GameList {

    constructor() {
        this.gameList = [];
    }

    add(id) {
        this.gameList.push(new Game(id));
        return this.gameList.length - 1;
    }
    remove(id) {
        this.gameList = this.gameList.filter(function(game){
            return game.id !== id;
        });
        console.log("Goodbye, " + id);
    }
    getGameList() {
        return this.gameList;
    }
}

module.exports = GameList;
var Game = require('./../Models/Game');

class GameList {

    constructor() {
        this.nextGameId = 1;
        this.gameList = [];
    }

    addGame(player1, player2) {
        this.gameList.push(new Game(this.nextGameId, player1, player2));
        return this.gameList.length - 1;
    }
    removeGame(id) {
        this.gameList = this.gameList.filter(function(game){
            return game.id !== id;
        });
        console.log("Goodbye, " + id);
    }
    getGameList() {
        return this.gameList;
    }
    getGameIdBySocket(socket) {
        let socketWithNmp = socket.substr(6);
        console.log(socketWithNmp);
        for (let [index, game] of this.gameList.entries()) {

            console.log(game);
            if (game.player1 == socketWithNmp || game.player2 == socketWithNmp) {
                return index;
            }
        }
    }

    markReadyBySocket(socket) {
        let index = this.getGameIdBySocket(socket);
        this.gameList.get(index).ends++;

        if (this.gameList.get(index).ends == 2) {
            return true;
        }

        return false;
    }
}

module.exports = GameList;
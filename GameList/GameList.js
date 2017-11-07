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
    }
    getGameList() {
        return this.gameList;
    }
    getGameIdBySocket(socket) {
        let socketWithNmp = socket.substr(6);
        for (let [index, game] of this.gameList.entries()) {
            if (game.player1.socket == socketWithNmp || game.player2.socket == socketWithNmp) {
                return index;
            }
        }
    }

    markReadyById(id) {
        this.gameList[id].incEnds();
        // this.gameList.get(index).ends++;

        if (this.gameList[id].ends == 2) {
            return true;
        }

        return false;
    }

    savePoints(index, socket, points) {
        this.gameList[index].savePoints(socket, points);
    }

    getResults(index) {
        return this.gameList[index].getResults();
    }

    getStatus(index) {
        return this.gameList[index].status;
    }
}

module.exports = GameList;
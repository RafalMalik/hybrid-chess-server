var Game = require('./../Models/Game');

class GameList {

    constructor() {
        this.nextGameId = 1;
        this.gameList = [];
    }

    addGame(player1, player2) {
        this.gameList.push(new Game(this.nextGameId, player1, player2));
        this.nextGameId++;
        return this.nextGameId - 1;
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

    savePoints(id, playerId, points) {
        let game = this.getById(id);
        game.savePoints(playerId, points);
    }

    getResults(index) {
        return this.gameList[index].getResults();
    }

    getStatus(index) {
        return this.gameList[index].status;
    }

    getById(id) {
        let game =  this.gameList.filter(function(game){
            return game.id === id;
        });

        return game[0];
    }
}

module.exports = GameList;
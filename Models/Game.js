class Game {

    constructor(id, player1, player2) {
        this.id = id;
        this.options = {
            'round': 5
        };
        this.ends = 0;
        this.status = 0;
        this.player1 = player1;
        this.player2 = player2;
    }

    getWinner() {
    }

    isFinished() {

    }
}

module.exports = Game;
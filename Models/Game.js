class Game {

    constructor(id, player1, player2) {
        this.id = id;
        this.options = {
            'round': 5
        };
        this.ends = 0;
        this.status = 0;
        this.player1 = {
            'id': player1.id,
            'socket': player1.socket,
            'points': 0
        };
        this.player2 = {
            'id': player2.id,
            'socket': player2.socket,
            'points': 0
        };
    }

    incEnds() {
        this.ends++;
        if (this.ends == 2) {
            this.status = 1;
        }

    }


    getResults() {
        console.log('pointsy ');
        console.log(this.player1.points);
        console.log(this.player2.points);
        if (this.player1.points > this.player2.points) {
            return {
                'status': 'player1 win',
                'win': this.player1.socket,
                'lose': this.player2.socket
            };
        } else if (this.player1.points < this.player2.points) {
            return {
                'status': 'player2 win',
                'win': this.player2.socket,
                'lose': this.player1.socket
            };
        } else {
            return {
                'status': 'draw'
            };
        }

    }

    savePoints(id, points) {
        if (this.player1.id == id) {
            this.player1.points = points;
        } else {
            this.player2.points = points;
        }
        this.incEnds();
    }

    isFinished() {
        return this.status == 1 ? true : false;

    }
}

module.exports = Game;
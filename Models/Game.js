class Game {

    constructor(id, player1, player2, settings, questions) {
        this.id = id;
        this.ends = 0;
        this.status = 0;
        this.settings = settings;
        this.questions = questions;
        this.player1 = {
            'id': player1.id,
            'socket': player1.socket,
            'points': 0,
            'answers': [],
            'avatar': player1.avatar
        };
        this.player2 = {
            'id': player2.id,
            'socket': player2.socket,
            'points': 0,
            'answers': [],
            'avatar': player2.avatar
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
                'win': this.player1,
                'lose': this.player2
            };
        } else if (this.player1.points < this.player2.points) {
            return {
                'status': 'player2 win',
                'win': this.player2,
                'lose': this.player1
            };
        } else {
            return {
                'status': 'draw'
            };
        }

    }

    savePoints(parameters) {
        if (this.player1.id == parameters.playerId) {
            this.player1.points = parameters.points;
            this.player1.answers = parameters.answers;
            this.player1.time = parameters.time;
            this.player1.avatar = parameters.avatar;
        } else {
            this.player2.points = parameters.points;
            this.player2.answers = parameters.answers;
            this.player2.time = parameters.time;
            this.player2.avatar = parameters.avatar;
        }
        this.incEnds();
    }

    isFinished() {
        return this.status == 1 ? true : false;

    }
}

module.exports = Game;
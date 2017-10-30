class Player {

    constructor(id, socket) {
        this.id = id;
        this.name = "Player_" + id;
        this.socket = socket;
        this.status = 0;
        this.points = 0;
    }


}

module.exports = Player;
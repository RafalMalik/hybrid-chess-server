class Player {


    constructor(id, socket) {
        this.id = id;
        this.name = "Player_" + id;
        this.socket = socket;
        this.status = 0;
        this.points = 0;

        var maxAvatarId = 9;
        var minAvatarId = 1;


        var tmp = Math.floor(Math.random() * (maxAvatarId - minAvatarId + 1)) + minAvatarId;
        this.avatar = 'http://193.70.113.241/resources/avatars/' + tmp + '.png';
    }




}

module.exports = Player;
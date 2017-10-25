class Player {
    // ..and an (optional) custom class constructor. If one is
    // not supplied, a default constructor is used instead:
    // constructor() { }
    constructor(id) {
        this.id = id;
        this.status = 0;
    }

    // Simple class instance methods using short-hand method
    // declaration
    sayName() {
        ChromeSamples.log('Hi, I am a ', this.name + '.');
    }

    sayHistory() {
        ChromeSamples.log('"Polygon" is derived from the Greek polus (many) ' +
            'and gonia (angle).');
    }

    // We will look at static and subclassed methods shortly
}

module.exports = Player;
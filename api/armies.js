class Unit {
    constructor(name, combatValue, id, special) {
        this.name = name,
        this.combatValue = combatValue,
        this.special = special, 
        this.id = id
    }
}

class Imperial extends Unit {
    constructor(name, combatValue, id, special) {
        super();
        this.name = name,
        this.combatValue = combatValue,
        this.special = special;
        this.army = "Imperial";
        this.id = id
    }    
}

class Chaos extends Unit {
    constructor(name, combatValue, id, special) {
        super();
        this.name = name,
        this.combatValue = combatValue,
        this.special = special;
        this.army = "Chaos";
        this.id = id;
    }    
}

module.exports.armies = [
    [
        new Imperial('The Mighty Canon', 2, 'canon', 'canon'),
        new Imperial("Crossbowmen Melgar's", 3, 'melgar', 'crossbow'),
        new Imperial("Imperial Archers of Bogenhaffen", 3, 'bogenhaffen' , 'archer'),
        new Imperial("Imperial Archers of Grunburg", 3, 'grunberg-archers', 'archer'),
        new Imperial("Men-At-Arms of Reikwald", 3, 'reikwald'), 
        new Imperial("Men-At-Arms of Altdorf", 3, 'altdorf'), 
        new Imperial("Men-At-Arms of Grunburg", 3, 'grunburg-arms'), 
        new Imperial("Imperial Knights of Duke Blitzen's", 4, 'blitzens'), 
        new Imperial("Imperial Knights Prince Normand's", 4, 'normands'),
        new Imperial('Lord Knights of the Empire', 5, 'empire-knights'), 
    ],
    [
        new Chaos('Goblins on Grom', 2)
    ]
];

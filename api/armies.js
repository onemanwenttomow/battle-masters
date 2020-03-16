class Unit {
    constructor(name, combatValue, special) {
        this.name = name,
        this.combatValue = combatValue,
        this.special = special;
    }
}

class Imperial extends Unit {
    constructor(name, combatValue, special) {
        super();
        this.name = name,
        this.combatValue = combatValue,
        this.special = special;
        this.army = "Imperial";
    }    
}

class Chaos extends Unit {
    constructor(name, combatValue, special) {
        super();
        this.name = name,
        this.combatValue = combatValue,
        this.special = special;
        this.army = "Chaos";
    }    
}

module.exports.armies = [
    [
        new Imperial('The Mighty Canon', 2, 'canon'),
        new Imperial("Crossbowmen Melgar's", 3, 'crossbow'),
        new Imperial("Imperial Archers of Bogenhaffen", 3, 'archer'),
        new Imperial("Imperial Arches of Grunburg", 3, 'archer'),
        new Imperial("Men-At-Arms of Reikwald", 3), 
        new Imperial("Men-At-Arms of Altdorf", 3), 
        new Imperial("Men-At-Arms of Grunburg", 3), 
        new Imperial("Imperial Knights of Duke Blitzen's", 4), 
        new Imperial("Imperial Knights Prince Normand's"),
        new Imperial('Lord Knights of the Empire', 5), 
    ],
    [
        new Chaos('Goblins on Grom', 2)
    ]
];

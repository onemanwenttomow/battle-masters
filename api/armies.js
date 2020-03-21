class Unit {
    constructor(name, combatValue, id, img, special) {
        this.name = name,
        this.combatValue = combatValue,
        this.special = special, 
        this.id = id,
        this.img = img
    }
}

class Imperial extends Unit {
    constructor(name, combatValue, id, img, special) {
        super();
        this.name = name,
        this.combatValue = combatValue,
        this.special = special;
        this.army = "Imperial";
        this.id = id;
        this.img = img;
    }    
}

class Chaos extends Unit {
    constructor(name, combatValue, id, img, special) {
        super();
        this.name = name,
        this.combatValue = combatValue,
        this.special = special;
        this.army = "Chaos";
        this.id = id;
        this.img = img;
    }    
}

module.exports.armies = [
    [
        new Imperial('The Mighty Canon', 2, 'canon', '/imperial-4.png', 'canon'),
        new Imperial("Crossbowmen Melgar's", 3, 'melgar', '/imperial-2.png', 'crossbow'),
        new Imperial("Imperial Archers of Bogenhaffen", 3, 'bogenhaffen' , '/imperial-3.png', 'archer'),
        new Imperial("Imperial Archers of Grunburg", 3,  'grunberg-archers', '/imperial-3.png', 'archer'),
        new Imperial("Men-At-Arms of Reikwald", 3, 'reikwald', '/imperial-1.png'), 
        new Imperial("Men-At-Arms of Altdorf", 3, 'altdorf', '/imperial-1.png'), 
        new Imperial("Men-At-Arms of Grunburg", 3, 'grunburg-arms', '/imperial-4.png'), 
        new Imperial("Imperial Knights of Duke Blitzen's", 4, 'blitzens', '/imperial-5.png'), 
        new Imperial("Imperial Knights Prince Normand's", 4, 'normands', '/imperial-5.png'),
        new Imperial('Lord Knights of the Empire', 5, 'empire-knights', '/imperial-6.png'), 
    ],
    [
        new Chaos('Goblins on Grom', 2)
    ]
];

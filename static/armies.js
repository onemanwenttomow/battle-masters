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
        new Imperial('The Mighty Canon', 2, 'canon', '/imperial-4.png', 'canon'),
        new Imperial("Crossbowmen Melgar's", 3, 'melgar', '/imperial-2.png', 'crossbow'),
        new Imperial("Imperial Archers of Bogenhaffen", 3, 'bogenhaffen' , '/imperial-3.png', 'archer'),
        new Imperial("Imperial Archers of Grunburg", 3,  'grunberg-archers', '/imperial-3.png', 'archer'),
        new Imperial("Men-At-Arms of Reikwald", 3, 'reikwald', '/imperial-1.png'), 
        new Imperial("Men-At-Arms of Altdorf", 3, 'altdorf', '/imperial-1.png'), 
        new Imperial("Men-At-Arms of Grunburg", 3, 'grunburg-arms', '/imperial-1.png'), 
        new Imperial("Imperial Knights of Baron Delborne's", 4, 'delbornes', '/imperial-5.png'), 
        new Imperial("Imperial Knights of Duke Blitzen's", 4, 'blitzens', '/imperial-5.png'), 
        new Imperial("Imperial Knights Prince Normand's", 4, 'normands', '/imperial-5.png'),
        new Imperial('Lord Knights of the Empire', 5, 'empire-knights', '/imperial-6.png'), 
        new Chaos('Goblins of Grom', 2, 'grom', '/chaos-1.png'),
        new Chaos('Goblins of Uglub', 2, 'uglub', '/chaos-1.png'),
        new Chaos("Wolf Riders Black Fang's", 2, 'blackfangs', '/chaos-5.png', 'wolfrider'),
        new Chaos("Wolf Riders Bogrot's", 2, 'bogrots', '/chaos-5.png', 'wolfrider'),
        new Chaos("Chaos Archers Doomguard", 2, 'doomguard', '/chaos-3.png', 'archer'),
        new Chaos("Chaos Archers Fellmor's", 2, 'fellmoors', '/chaos-3.png', 'archer'),
        new Chaos("Orcs Gazkull's", 3, 'gazkulls', '/chaos-2.png'),
        new Chaos("Orcs Zogrod's", 3, 'zogrods', '/chaos-2.png'),
        new Chaos("Beastmen of Bale", 3, 'bale', '/chaos-8.png'),
        new Chaos("Beastmen of Flint", 3, 'flint', '/chaos-8.png'),
        new Chaos("Chaos Warriors Goreband's", 4, 'gorebands', '/chaos-4.png'),
        new Chaos("Chaos Warriors Finmar's", 4, 'finmars', '/chaos-4.png'),
        new Chaos("Champions of Chaos Gorefist's", 5, 'gorefists', '/chaos-7.png'),
        new Chaos("Ogre Champion of Grimorg", 4, 'grimorg', '/chaos-6.png', 'ogre')

];

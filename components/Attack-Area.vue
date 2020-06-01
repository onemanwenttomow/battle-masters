<template>
	<div class="battle-area" v-if="getUnitThatCanAttack[0] && getUnitUnderAttack[0]">
        <div class="battle-container">
       
            <div class="dice-container">
                <div class="attacker">
                    <img :src="getUnitThatCanAttack[0].img" alt="" class="unit-img">
                    <div class="damage-container">
                        <img src="/damage.png" alt="" v-for="d in getUnitThatCanAttack[0].damageReceived" :key="d">
                    </div>
                    <h2>{{getUnitThatCanAttack[0].name}}</h2>
                    <div class="total-die-container">
                        <div v-for="(die, i) in attackingDie" :key="i" class="die-container">
                            <img class="dice-face" src="/skull.png" alt="" :class="[dieRolled(die.rolled, 0, die.value) ? 'user-rolled' : 'not-rolled']">
                            <img class="dice-face" src="/skull.png" alt="" :class="[dieRolled(die.rolled, 1, die.value) ? 'user-rolled' : 'not-rolled']">
                            <img class="dice-face" src="/skull.png" alt="" :class="[dieRolled(die.rolled, 2, die.value) ? 'user-rolled' : 'not-rolled']">
                            <img class="dice-face" src="/shield.png" alt="" :class="[dieRolled(die.rolled, 3, die.value) ? 'user-rolled' : 'not-rolled']">
                            <img class="dice-face" src="/blank.png" alt="" :class="[dieRolled(die.rolled, 4, die.value) ? 'user-rolled' : 'not-rolled']">
                            <img class="dice-face" src="/blank.png" alt="" :class="[dieRolled(die.rolled, 5, die.value) ? 'user-rolled' : 'not-rolled']">
                            <div class="roll-button" :class="[die.rolled ? 'not-rolled' : '']" @click="rollDie('attackingDie', i)">🎲</div>
                        </div>
                    </div>
                </div>

                <h1>⚔️</h1>

                <div class="defender">
                    <img :src="getUnitUnderAttack[0].img" alt="" class="unit-img">
                    <div class="damage-container">
                        <img src="/damage.png" alt="" v-for="d in getUnitUnderAttack[0].damageReceived" :key="d">
                    </div>
                    <h2>{{getUnitUnderAttack[0].name}}</h2>
                    <div class="total-die-container">
                        <div v-for="(die, i) in defendingDie" :key="i" class="die-container">
                            <img class="dice-face" src="/skull.png" alt="" :class="[dieRolled(die.rolled, 0, die.value) ? 'user-rolled' : 'not-rolled']" >
                            <img class="dice-face" src="/skull.png" alt="" :class="[dieRolled(die.rolled, 1, die.value) ? 'user-rolled' : 'not-rolled']" >
                            <img class="dice-face" src="/skull.png" alt="" :class="[dieRolled(die.rolled, 2, die.value) ? 'user-rolled' : 'not-rolled']" >
                            <img class="dice-face" src="/shield.png" alt="" :class="[dieRolled(die.rolled, 3, die.value) ? 'user-rolled' : 'not-rolled']" >
                            <img class="dice-face" src="/blank.png" alt="" :class="[dieRolled(die.rolled, 4, die.value) ? 'user-rolled' : 'not-rolled']" >
                            <img class="dice-face" src="/blank.png" alt="" :class="[dieRolled(die.rolled, 5, die.value) ? 'user-rolled' : 'not-rolled']" >
                            <div class="roll-button" :class="[die.rolled ? 'not-rolled' : '']" @click="rollDie('defendingDie', i)">🎲</div>
                        </div>
                    </div>
                </div>
                <div class="damage-score">
                    <div v-if="damageDealt >= 0">
                        <h2>Damage Dealt </h2>
                        <h2><span>{{damageDealt}}</span></h2>
                    </div>
                    <div v-else>
                        <h2>Damage Dealt</h2>
                        <h2><span>0</span></h2>
                    </div>
                </div>
            </div>
        
            <div class="roll-button" v-if="allDieRolled" @click="endBattle">Turn finished! Click to continue</div>
            
        </div>
    </div>
       
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    computed: {
		...mapGetters([
        	'getUnitThatCanAttack', 'getUnitUnderAttack', 'getCurrentCard', 'getUserChosenArmy'
        ])
    },
    props: ['socket'],
    data() {
		return {
            attackingDie: [],
            defendingDie: [],
            damageDealt: 0,
            allDieRolled: false
        };
    },
    mounted: function() {
        const plusOneIncluded = this.getCurrentCard.ids.includes('plus1');
        let extraRoll = 0;
        plusOneIncluded && extraRoll++;
        for (let i = 0; i < this.getUnitThatCanAttack[0].combatValue + extraRoll; i++) {
            this.attackingDie.push({
                rolled: false,
                value: Math.floor(Math.random() * 5)
            });
        }

        for (let i = 0; i < this.getUnitUnderAttack[0].combatValue; i++) {
            this.defendingDie.push({
                rolled: false,
                value:  Math.floor(Math.random() * 5)
            });
        }

        const twoPlayerGame = sessionStorage.getItem('player');
        if (twoPlayerGame) {

            if (twoPlayerGame === 'player1') {
                this.socket.emit("attack area die setup", {
                    player: sessionStorage.getItem('player'),
                    roomId: sessionStorage.getItem('roomId'),
                    defendingDie: this.defendingDie,
                    attackingDie: this.attackingDie
                })
            } else {
                this.socket.on("attack area die setup", ({defendingDie, attackingDie}) => {
                    this.defendingDie = defendingDie;
                    this.attackingDie = attackingDie;
                });
            }
            this.socket.on('rollDie', ({die, i}) => {
                die === "defendingDie" ? 
                    this.defendingDie[i].rolled = true:
                    this.attackingDie[i].rolled = true;
                this.checkIfAllDieRolled();
                this.damageUpdate();
            });
        }

    },
    methods: {
        dieRolled: function(rolled, num, value) {
            return rolled && num === value;
        },
        checkIfAllDieRolled: function() {
            if (this.attackingDie.filter(die => !die.rolled).length + 
                this.defendingDie.filter(die => !die.rolled).length === 0) {
                this.allDieRolled = true;
            }
        },
        damageUpdate: function() {
            const totalDamage = this.attackingDie.filter(die => die.rolled && die.value <= 2).length;
            const totalDefense = this.defendingDie.filter(die => die.rolled && die.value === 3).length;
            this.damageDealt = totalDamage - totalDefense;
            if (this.damageDealt < 0) {
                this.damageDealt = 0;
            }
        },
        endBattle: function() {
            this.$store.commit('battleOver', {damageDealt: this.damageDealt});
            const twoPlayerGame = sessionStorage.getItem('player');
            if (twoPlayerGame) {
                this.socket.emit('battleOver', {
                    player: sessionStorage.getItem('player'),
                    roomId: sessionStorage.getItem('roomId'),
                    damageDealt: this.damageDealt
                });
            }
        },
        rollDie: function(die, i) {
            const twoPlayerGame = sessionStorage.getItem('player');
            if (twoPlayerGame) {
                const userChosenArmy = this.getUserChosenArmy;
                const defendingDie = die === "defendingDie";
                const attackingDie = die !== "defendingDie"
                if (defendingDie && this.getUnitUnderAttack[0].army !== userChosenArmy) {
                    return;
                }
                if (attackingDie && this.getUnitThatCanAttack[0].army !== userChosenArmy) {
                    return;
                }
            }
            die === "defendingDie" ? 
                this.defendingDie[i].rolled = true:
                this.attackingDie[i].rolled = true;
            if (twoPlayerGame) {
                this.socket.emit("rollDie", {
                    player: sessionStorage.getItem('player'),
                    roomId: sessionStorage.getItem('roomId'),
                    die, 
                    i
                });
            }
            this.checkIfAllDieRolled();
            this.damageUpdate();
        }
    }
};
</script>

<style>
/* https://colorhunt.co/palette/180404 */
/* 120136 */
/* 035aa6 */
/* 40bad5 */
/* fcbf1e */
.battle-area {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #120136;
    color: #120136;
    z-index: 500;
}

.battle-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}


.damage-container {
    position: absolute;
    top: 4vh;
    right: 7vw;
}

.damage-container img {
    width: 35px;
    height: 35px;
}

.defender, .attacker {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px;
    min-width: 32vw;
    min-height: 50vh;
    background-color: #40bad5;
    border-radius: 5px;
    border: solid 5px #fcbf1e;
}
.defender h2, .attacker h2{
    min-height: 8vh;
    text-align: center;
}

.damage-score {
    margin: 20px;
    background-color: #40bad5;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    text-align: center;
    border-radius: 5px;
    border: solid 5px #fcbf1e;
}

.damage-score span {
    font-size: 85px;
}

.damage-score h2 {
    margin: 20px;
}

.unit-img {
    margin: 20px;
    border: solid 5px #fcbf1e;
}

.dice-container {
    display: flex;
    justify-content: space-around;
    margin: 20px;
}

.total-die-container {
    margin: 20px;
}

.dice-container h1{
    align-self: center;
    font-size: 70px;
}

.dice-face {
    height: 50px;
}

.not-rolled {
    opacity: 0.2;
}

.user-rolled {
    opacity: 1;
    transition: opacity 0.3s;
}

.roll-button {
    background-color: #40bad5;
    display: inline-block;
    cursor: pointer;
    font-size: 30px;
    margin-left: 5px;
    padding: 5px;
}

.die-container {
    display: flex;
}

</style>

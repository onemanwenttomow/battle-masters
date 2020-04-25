<template>
	<div class="battle-area" v-if="getUnitThatCanAttack[0] && getUnitUnderAttack[0]">
        <h1>
            <img :src="getUnitThatCanAttack[0].img" alt=""> v <img :src="getUnitUnderAttack[0].img" alt="">
        </h1>
       
        <div class="dice-container">
            <div class="attacker">
                <h2>{{getUnitThatCanAttack[0].name}}</h2>
                <div v-for="(die, i) in attackingDie" :key="i" class="die-container">
                    <img class="dice-face" src="/skull.png" alt="" :class="[dieRolled(die.rolled, 0, die.value) ? 'user-rolled' : 'not-rolled']">
                    <img class="dice-face" src="/skull.png" alt="" :class="[dieRolled(die.rolled, 1, die.value) ? 'user-rolled' : 'not-rolled']">
                    <img class="dice-face" src="/skull.png" alt="" :class="[dieRolled(die.rolled, 2, die.value) ? 'user-rolled' : 'not-rolled']">
                    <img class="dice-face" src="/shield.png" alt="" :class="[dieRolled(die.rolled, 3, die.value) ? 'user-rolled' : 'not-rolled']">
                    <img class="dice-face" src="/blank.png" alt="" :class="[dieRolled(die.rolled, 4, die.value) ? 'user-rolled' : 'not-rolled']">
                    <img class="dice-face" src="/blank.png" alt="" :class="[dieRolled(die.rolled, 5, die.value) ? 'user-rolled' : 'not-rolled']">
                    <div class="roll-button" :class="[die.rolled ? 'not-rolled' : '']" @click="rollDie('attackingDie', i)">ROLL!</div>
                </div>
            </div>

            <div class="defender">
                <h2>{{getUnitUnderAttack[0].name}} Remaining Lives (before battle): {{getUnitUnderAttack[0].remainingLives}}</h2>
                <div v-for="(die, i) in defendingDie" :key="i" class="die-container">
                    <img class="dice-face" src="/skull.png" alt="" :class="[dieRolled(die.rolled, 0, die.value) ? 'user-rolled' : 'not-rolled']" >
                    <img class="dice-face" src="/skull.png" alt="" :class="[dieRolled(die.rolled, 1, die.value) ? 'user-rolled' : 'not-rolled']" >
                    <img class="dice-face" src="/skull.png" alt="" :class="[dieRolled(die.rolled, 2, die.value) ? 'user-rolled' : 'not-rolled']" >
                    <img class="dice-face" src="/shield.png" alt="" :class="[dieRolled(die.rolled, 3, die.value) ? 'user-rolled' : 'not-rolled']" >
                    <img class="dice-face" src="/blank.png" alt="" :class="[dieRolled(die.rolled, 4, die.value) ? 'user-rolled' : 'not-rolled']" >
                    <img class="dice-face" src="/blank.png" alt="" :class="[dieRolled(die.rolled, 5, die.value) ? 'user-rolled' : 'not-rolled']" >
                    <div class="roll-button" :class="[die.rolled ? 'not-rolled' : '']" @click="rollDie('defendingDie', i)">ROLL!</div>
                </div>
            </div>
        </div>
       
        <h2 v-if="damageDealt >= 0">Total Damage Dealt!: {{damageDealt}}</h2>
        <h2 v-else>Total Damage Dealt!: 0</h2>
        <div class="roll-button" v-if="allDieRolled" @click="endBattle">Turn finished! Click to continue</div>
        
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
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
        console.log('this.getUnitThatCanAttack: ',this.getUnitThatCanAttack);
        console.log('this.getUnitUnderAttack: ',this.getUnitUnderAttack);
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
        },
        endBattle: function() {
            this.$store.commit('battleOver', {damageDealt: this.damageDealt});
        },
        rollDie: function(die, i) {
            if (die === "defendingDie") {
                this.defendingDie = this.defendingDie.map((die, idx) => {
                    if (i === idx) {
                        return {
                            ...die, 
                            rolled: true
                        }
                    } else {
                        return {
                            ...die
                        }
                    }
                })
            } else {
                this.attackingDie = this.attackingDie.map((die, idx) => {
                    if (i === idx) {
                        return {
                            ...die, 
                            rolled: true
                        }
                    } else {
                        return {
                            ...die
                        }
                    }
                })
            }
            this.checkIfAllDieRolled();
            this.damageUpdate();
        }
    },
    computed: {
		...mapGetters([
        	'getUnitThatCanAttack', 'getUnitUnderAttack', 'getCurrentCard'
        ])
	},
	
};
</script>

<style>
.battle-area {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: brown;
    z-index: 500;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.defender, .attacker {
    margin: 20px;
}

.dice-container {
    display: flex;
    justify-content: space-around;
    margin: 20px;
}

.dice-face {
    height: 50px;
}

.not-rolled {
    opacity: 0.2;
}

.user-rolled {
    opacity: 1;
}

.roll-button {
    display: inline-block;
    cursor: pointer;
    font-size: 22px;
    margin-left: 5px;
    padding: 5px;
    background-color: white;
}

.die-container {
    display: flex;
}

</style>

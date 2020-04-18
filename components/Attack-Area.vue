<template>
	<div class="battle-area">
        <h1>{{getUnitThatCanAttack[0].name}} v {{getUnitUnderAttack[0].name}}</h1>
        
        <div class="attacker">
            <h2>{{getUnitThatCanAttack[0].name}}</h2>
            <div v-for="(die, i) in attackingDie" :key="i" :class="[die.rolled ? '' : 'not-rolled']">
                <img class="dice-face" src="/skull.png" alt="">
                <img class="dice-face" src="/skull.png" alt="">
                <img class="dice-face" src="/skull.png" alt="">
                <img class="dice-face" src="/shield.png" alt="">
                <img class="dice-face" src="/blank.png" alt="">
                <img class="dice-face" src="/blank.png" alt="">
            </div>
        </div>

        <div class="defender">
            <h2>{{getUnitUnderAttack[0].name}}</h2>
            <div v-for="(die, i) in defendingDie" :key="i" @click="rollDie('defendingDie', i)">
                <img class="dice-face" src="/skull.png" alt="" :class="[dieRolled(die.rolled, 0, die.value) ? 'user-rolled' : '']" >
                <img class="dice-face" src="/skull.png" alt="" :class="[dieRolled(die.rolled, 0, die.value) ? 'user-rolled' : '']" >
                <img class="dice-face" src="/skull.png" alt="" :class="[dieRolled(die.rolled, 0, die.value) ? 'user-rolled' : '']" >
                <img class="dice-face" src="/shield.png" alt="" :class="[dieRolled(die.rolled, 0, die.value) ? 'user-rolled' : '']" >
                <img class="dice-face" src="/blank.png" alt="" :class="[dieRolled(die.rolled, 0, die.value) ? 'user-rolled' : '']" >
                <img class="dice-face" src="/blank.png" alt="" :class="[dieRolled(die.rolled, 0, die.value) ? 'user-rolled' : '']" >
            </div>
        </div>
        
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    data() {
		return {
            attackingDie: [],
            defendingDie: []
        };
    },
    mounted: function() {
        for (let i = 0; i < this.getUnitThatCanAttack[0].combatValue; i++) {
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
        console.log('this.defendingDie: ',this.defendingDie);
    },
    methods: {
        dieRolled: function(rolled, num, value) {
            return rolled && num === value;
        },
        rollDie: function(die, i) {
            console.log('die: ',die);
            // dieToUpdate.map((die, idx) => {
            //     if (i === idx) {
            //         return {
            //             ...die, 
            //             rolled: true
            //         }
            //     } else {
            //         return {
            //             ...die
            //         }
            //     }
            // })
        }
    },
    computed: {
		...mapGetters([
        	'getUnitThatCanAttack', 'getUnitUnderAttack'
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
}

.dice-face {
    height: 50px;
}

.not-rolled {
    opacity: 0.5;
}

.user-rolled {
    opacity: 1;
}

</style>

<template>
    <div class="canon-misfire-container">
        <h2>Canon Misfire!</h2>
        <p>The canon has misfired! The remaining tiles have been shuffled, and you need to draw the first one. The following damage will result:</p>
        <ul>
            <li>Fly: 0 Damage</li>
            <li>Bounce: 1 Damage</li>
            <li>Explosion: Canon Destroyed!</li>
        </ul>
        <div 
            v-for="card in shuffledRemainingCanonCards" 
            :key="card.id"
            :id="card.id"
            class="flip-card"
            :class='[card.flipped ? "canon-card-flipped" : ""]'
        >
            <div class="flip-card-inner">
                <div class="flip-card-front canon-tile" @click.stop="flip(card)"></div>
                <div class="flip-card-back canon-tile" :style="{backgroundImage: `url(${card.img})`}"></div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    computed: {
		...mapGetters([
            'getCanonCards',
            'getCanonCardsOnBoard'
        ]),
        shuffledRemainingCanonCards: function() {
            console.log('this.getCanonCards: ',this.getCanonCards);
            console.log('this.getCanonCardsOnBoard.length: ',this.getCanonCardsOnBoard.length);
            if (this.getCanonCardsOnBoard.length === 1) {
                 return [this.getCanonCards[0]];
            } else {
                return [this.getCanonCards.filter(card => card.id !== "canon-explosion-1")[0]];
            }
        }
    },
    methods: {
        flip: function(card) {
            card.flipped = true;
            const fly = card.id.includes('fly');
            const bounce = card.id.includes('bounce');
            const explosion = card.id.includes('explosion');
            setTimeout(()=> {
                this.$emit('close');
            },2000)
            if (fly) { return; }
            let damageDealt;
            bounce ? damageDealt = 1 : damageDealt = 6;
            this.$store.commit('dealDamage', {id: 'canon', damageDealt});
        }
    }
	
};
</script>

<style>

.canon-misfire-container {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 500;
    background-color: cadetblue;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}



</style>

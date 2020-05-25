<template>
	<fragment>
		<div class="card-container">
			<div 
				v-for="(card, i) in shuffledPlayingCardsCopy" 
				:key="i"
				class="card" 
				:class="card.flipped ? 'flipcard' : ''"
				:style="card.flipped ? [{ zIndex: `-${i}`}] : ''"
			>
				<div class="side" :style="{ backgroundImage: `url(${cardBack})`}" @click="nextCard(card)"></div>
				<div class="side back" :style="{ backgroundImage: `url(${card.img})`}"></div>
			</div>
		</div>
	</fragment>
</template>

<script>
import { mapGetters } from 'vuex';


export default {
	data() {
		return {
			shuffledPlayingCards: [],
			shuffledPlayingCardsCopy: [],
			canPickNextCard: true
		};
	},
	computed: mapGetters([
		'checkIfUnitsInReach',
		'getPieceById'
    ]),
	props: ['getPlayingCards', 'cardBack', 'currentCard', 'cards'],
	mounted: function() {
		this.shuffleCards();
	},
	methods: {
		shuffleCards: function() {
			this.shuffledPlayingCards = this.shuffle(this.getPlayingCards.slice());
			this.shuffledPlayingCardsCopy = this.shuffledPlayingCards.slice().map(card => {
				return {
					...card, 
					flipped: false
				}
			});
		},
		shuffle: function(a) {
			var j, x, i;
			for (i = a.length - 1; i > 0; i--) {
				j = Math.floor(Math.random() * (i + 1));
				x = a[i];
				a[i] = a[j];
				a[j] = x;
			}
			return a;
        },
        nextCard: function(card) {
			if (!this.canPickNextCard) {
				return;
			}
			card.flipped = true;
			this.canPickNextCard = false;
			setTimeout(() => {
				this.canPickNextCard = true;
				const card = this.shuffledPlayingCards[this.shuffledPlayingCards.length -1];
				if (card.type && card.type === 'attack') {
					const unitsInReach = this.checkIfUnitsInReach('grimorg');
					const unit = this.getPieceById('grimorg');
					unitsInReach.length && this.$store.commit('canBeAttacked', {unit, unitsInReach}); 
				}
				this.shuffledPlayingCards.pop();
				this.$store.commit(this.currentCard, { card, numberOfOgreCardsLeft: this.shuffledPlayingCards.length });
				if (this.shuffledPlayingCards.length === 0 && this.cards !== "ogre") {
					this.shuffleCards();
				}
			}, 1000)
        }
	}
};
</script>

<style>

.playing-cards {
	height: 260px;
	width: 400px;
}

.pack-of-playing-cards {
	background-image: url('/card-back.png');
}


.flipcard {
    animation: flipcard 1s forwards;
}

.card-container {
	display: inline-block;
    cursor: pointer;
    height: 260px;
    perspective: 600;
    position: relative;
    width: 400px;
}

.card {
    height: 100%;
    position: absolute;
    transform-style: preserve-3d;
    transition: all 1s ease-in-out;
    width: 100%;
}

.card .side {
    backface-visibility: hidden;
    height: 100%;
    position: absolute;
    overflow: hidden;
    width: 100%;
}
.card .back {
    transform: rotateY(180deg);
}


@keyframes flipcard {
    0% {
        transform: translateX(0);
		z-index: 100;
    }
    50% {
        transform: translateX(400px);
		z-index: 100;
    }
    100% {
        transform: rotateY(180deg) translateX(-400px);
    }
}



</style>

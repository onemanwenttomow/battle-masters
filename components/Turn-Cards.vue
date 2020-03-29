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
				<div class="side pack-of-playing-cards" @click="nextCard(card)"></div>
				<div class="side back" :style="{ backgroundImage: `url(${card.img})`}"></div>
			</div>
		</div>
	</fragment>
</template>

<script>
export default {
	data() {
		return {
			shuffledPlayingCards: [],
			shuffledPlayingCardsCopy: []
		};
	},
	props: ["playingcards"],
	mounted: function() {
        console.log("playingcards: ", this.playingcards);
		this.shuffledPlayingCards = this.shuffle(this.playingcards.slice());
		this.shuffledPlayingCardsCopy = this.shuffledPlayingCards.slice().map(card => {
			return {
				...card, 
				flipped: false
			}
		});
	},
	methods: {
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
			console.log('this.shuffledPlayingCards[this.shuffledPlayingCard.length -1]: ',this.shuffledPlayingCards[this.shuffledPlayingCards.length -1]);
			card.flipped = true;
			setTimeout(() => {
				this.$emit('currentcard', this.shuffledPlayingCards[this.shuffledPlayingCards.length -1])
				this.shuffledPlayingCards.pop();
				console.log('this.playingcards.length: ',this.shuffledPlayingCards.length);
				if (this.shuffledPlayingCards.length === 0) {
					console.log("made it to re-shuffle")
					this.shuffledPlayingCards = this.shuffle(this.playingcards.slice());
					this.shuffledPlayingCardsCopy = this.shuffledPlayingCards.slice().map(card => {
						return {
							...card, 
							flipped: false
						}
					});
					console.log('this.shuffledPlayingCards: ',this.shuffledPlayingCards);
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
/* .card:hover {
    transform: rotateY(180deg);
} */
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

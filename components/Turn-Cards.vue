<template>
	<fragment>
		<div class="pack-of-playing-cards playing-cards"></div>
		<div 
			@click="nextCard" 
			:style="{ backgroundImage: `url(${shuffledPlayingCards[0] && shuffledPlayingCards[0].img})`}"
			class="playing-cards"
		></div>
	</fragment>
</template>

<script>
export default {
	data() {
		return {
            shuffledPlayingCards: []
		};
	},
	props: ["playingcards"],
	mounted: function() {
        console.log("playingcards: ", this.playingcards);
        this.shuffledPlayingCards = this.shuffle(this.playingcards.slice());
        console.log('this.shuffledPlayingCards: ',this.shuffledPlayingCards[0].img);
        this.$emit('currentcard', this.shuffledPlayingCards[0])
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
        nextCard: function() {
			this.shuffledPlayingCards.shift();
			if (this.shuffledPlayingCards.length === 0) {
				console.log("made it to re-shuffle")
				this.shuffledPlayingCards = this.shuffle(this.playingcards.slice());
				console.log('this.shuffledPlayingCards: ',this.shuffledPlayingCards);
			}
			console.log('this.playingcards.length: ',this.shuffledPlayingCards.length);
			this.$emit('currentcard', this.shuffledPlayingCards[0])
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

</style>

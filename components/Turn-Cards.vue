<template>
	<div @click="nextCard">{{shuffledPlayingCards[0]}}</div>
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
        console.log('this.shuffledPlayingCards: ',this.shuffledPlayingCards);
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
            console.log('this.playingcards.length: ',this.playingcards.length);
        }
	}
};
</script>

<style>
</style>

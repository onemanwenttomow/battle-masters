<template>
	<fragment>
		<div class="pack-of-playing-cards playing-cards"></div>
		<div class="wrap">
			<div class="side-a pack-of-playing-cards" @click="nextCard"></div>
			<div class="side-b" :class="flipped ? 'flipped' : ''" :style="{ backgroundImage: `url(${shuffledPlayingCards[0] && shuffledPlayingCards[0].img})`}"></div>
		</div>
		<!-- <div 
			@click="nextCard" 
			:style="{ backgroundImage: `url(${shuffledPlayingCards[0] && shuffledPlayingCards[0].img})`}"
			class="playing-cards"
		></div> -->
	</fragment>
</template>

<script>
export default {
	data() {
		return {
            shuffledPlayingCards: [],
			flipped: false
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
			this.flipped = true;
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


.wrap {
	position: relative;
	margin: 0 auto;
	width: 400px;
	height: 260px;
	cursor: pointer;
}
.wrap div {
	width: 100%;
	height: 100%;
	border-radius: 10px;
	background-position: 50% 50%;
	/* background-size: 250px; */
	background-repeat: no-repeat;
	box-shadow: inset 0 0 45px rgba(255,255,255,.3), 0 12px 20px -10px rgba(0,0,0,.4);
	color: #FFF;
	text-align: center;
	text-shadow: 0 1px rgba(0,0,0,.3);
	font: bold 3em sans-serif;
	line-height: 350px;
}

body {
	-webkit-perspective: 800px;
}

.wrap {
	transition: -webkit-transform 1s ease-in;
	-webkit-transform-style: preserve-3d;
}

.wrap div {
	position: absolute;
	-webkit-backface-visibility: hidden;
}

.side-a {
	z-index: 100;
}
.side-b {
	-webkit-transform: rotateY(-180deg);
}

.flipped {
	-webkit-transform: rotateY(180deg) translateX(-300px);
}

</style>

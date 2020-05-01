<template>
    <div>
        <!-- <div class="canon-decision" v-if="showDecision" @click="showDecision = false">
            <div>Move</div> or <div @click="$store.commit('finishMove', {id: 'canon'})">Attack</div>
        </div> -->

         <!-- v-if="canonAttack" -->
        <div class="canon-cards-container">
            <div 
                class="canon-tile canon-target" 
                id="canon-target" 
                draggable
                @dragstart="dragStart"
            ></div>
            <div 
                v-for="card in canonCards" 
                :key="card.id"
                class="flip-card"
                :class='[card.flipped ? "canon-card-flipped" : ""]'
                draggable
                @dragstart="dragStart"
            >
                <div class="flip-card-inner">
                    <div class="flip-card-front canon-tile" @click="card.flipped = true"></div>
                    <div class="flip-card-back canon-tile" :style="card.cardOnBoard && {backgroundImage: `url(/${card.card}.png)`}"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    data: function() {
        return {
            showDecision: true,
            canonCards: [
                'canon-fly', 
                'canon-fly', 
                'canon-fly', 
                'canon-fly', 
                'canon-explosion', 
                'canon-explosion', 
                'canon-bounce', 
                'canon-bounce', 
                'canon-bounce'
            ]
        }
    },
	computed: {
        ...mapGetters(['getPieceById']), 
        canonAttack: function() {
            return this.getPieceById('canon')[0].hasMoved
        }
    },
    mounted: function() {
        this.shuffleCards();
    },
    methods: {
        shuffleCards: function() {
            const shuffledCards = this.shuffle(this.canonCards.slice())
            this.canonCards = shuffledCards.map((card, i) => {
                return {
                    card, 
                    flipped: false,
                    id: i,
                    cardOnBoard: false
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
        dragStart: function(e) {
			const target = e.target;
			e.dataTransfer.setData("id", e.target.id);
			setTimeout(function() {
				target.style.opacity = 0.3;
			}, 0);
		},
		dragEnd: function(e, unit) {
			e.target.style.opacity = 1;
		},
    }
};
</script>

<style>

.canon-decision {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 500;
    background-color: cadetblue;
    display: flex;
    justify-content: center;
    align-items: center;
}

.canon-decision div {
    font-size: 100px;
    cursor: pointer;
}

.canon-cards-container {
    display: flex;
}

.canon-tile {
    height: 80px;
    width: 80px;
    border-radius: 50%;
    background-size: contain;
    transform-style: preserve-3d;
    transition: all 1s ease-in-out;
}

.canon-target {
    background-image: url('/canon-target.png');
}

.canon-fly {
    background-image: url('/canon-fly.png');
}

.canon-bounce {
    background-image: url('/canon-bounce.png');
}

.canon-explosion {
    background-image: url('/canon-explosion.png');
}


.flip-card {
    perspective: 1000px; /* Remove this if you don't want the 3D effect */
    height: 80px;
    width: 80px;
    margin: 0 10px;
}

.flip-card-inner {
    position: relative;
    transition: transform 0.8s;
    transform-style: preserve-3d;
    width: 100%;
    height: 100%;
}

.canon-card-flipped .flip-card-inner {
    transform: rotateY(180deg);  
}

.flip-card-front, .flip-card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    -webkit-backface-visibility: hidden; /* Safari */
    backface-visibility: hidden;
}

.flip-card-front {
    background-color: #64c7cc;
}

.flip-card-back {
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

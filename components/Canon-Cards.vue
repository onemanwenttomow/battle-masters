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
                :id="card.id"
                class="flip-card"
                :class='[card.flipped ? "canon-card-flipped" : ""]'
                :draggable="!getCanonCardsOnBoard.includes(card.id)"
                @dragstart.stop="dragStart"
            >
                <div class="flip-card-inner">
                    <div class="flip-card-front canon-tile" @click.stop="flip(card.id)"></div>
                    <div class="flip-card-back canon-tile" :style="getCanonCardsOnBoard.includes(card.id) && {backgroundImage: `url(${card.img})`}"></div>
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
            canonCards: []
        }
    },
	computed: {
        ...mapGetters(['getPieceById', 'getCanonCards', 'getCanonCardsOnBoard']), 
        canonAttack: function() {
            return this.getPieceById('canon')[0].hasMoved
        }
    },
    mounted: function() {
        this.$store.commit('shuffle', {cards: this.getCanonCards});
        this.canonCards = this.getCanonCards;
    },
    methods: {
        flip: function(id) {
            if (this.getCanonCardsOnBoard.includes(id)) {
                this.canonCards = this.canonCards.map(card => {
                    if (card.id === id) {
                        return {
                            ...card, 
                            flipped: true
                        }
                    } else {
                        return {
                            ...card
                        }
                    }
                })
            }
        },
        dragStart: function(e) {
			const target = e.target;
			e.dataTransfer.setData("id", e.target.id);
			setTimeout(function() {
				target.style.opacity = 0.3;
			}, 0);
		}
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
    background-color: goldenrod;
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

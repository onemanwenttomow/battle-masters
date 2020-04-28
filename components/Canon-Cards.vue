<template>
	<div class="canon-cards-container">
        <div 
            class="canon-tile canon-target" 
            id="canon-target" 
            @dragstart="dragStart"
            draggable
        ></div>
        <div 
            v-for="(card, i) in canonCards" 
            :key="i"
            class="flip-card"
        >
            <div class="flip-card-inner">
                <div class="flip-card-front canon-tile"  ></div>
			    <div class="flip-card-back canon-tile" :style="{ backgroundImage: `url(/${card}.png)`}"></div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    data: function() {
        return {
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
	computed: mapGetters([
        'selectedUnit'
    ]),
    mounted: function() {
        this.shuffleCards();
    },
    methods: {
        shuffleCards: function() {
			this.canonCards = this.shuffle(this.canonCards.slice());
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
}

/* This container is needed to position the front and back side */
.flip-card-inner {
  position: relative;
  transition: transform 0.8s;
  transform-style: preserve-3d;
    width: 100%;
  height: 100%;
}

/* Do an horizontal flip when you move the mouse over the flip box container */
.flip-card:hover .flip-card-inner {
  transform: rotateY(180deg);
  
}

/* Position the front and back side */
.flip-card-front, .flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden; /* Safari */
  backface-visibility: hidden;
}

/* Style the front side (fallback if image is missing) */
.flip-card-front {
  background-color: #bbb;
  color: black;
}

/* Style the back side */
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

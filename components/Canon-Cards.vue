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
            class="canon-tile"
            :class="card"
        >
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
    methods: {
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

</style>

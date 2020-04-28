<template>
	<div>
        <div 
            class="canon-tile canon-target" 
            id="canon-target" 
            @dragstart="dragStart"
            draggable
        ></div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
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

.canon-tile {
    height: 80px;
    width: 80px;
    border-radius: 50%;
    background-color: hotpink;
    background-image: url('/canon-target.png');
    background-size: contain;
}

</style>

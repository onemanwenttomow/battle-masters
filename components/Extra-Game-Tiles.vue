<template>
	<div class="">
		<div
			class="hexagon tower"
            id="tower"
			draggable
			@dragstart="dragStart"
		></div>
        <button @click="$store.commit('allExtraPiecesAddedToBoard')">Ready to start game</button>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	computed: {
		...mapGetters([])
	},
	methods: {
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

.tower {
    background-color: grey;
}


</style>
<template>
	<div class="">
		<div
			class="hexagon tower"
            id="tower"
			:draggable="isDraggable"
			@dragstart="dragStart"
		></div>
        <button v-if="!areExtraPiecesAddedToBoard" @click="handleClick">Ready to start game</button>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	computed: {
        ...mapGetters(['areExtraPiecesAddedToBoard'])
    },
    data: function() {
        return {
            isDraggable: true,
        }
    },
	methods: {
        handleClick: function() {
            this.$store.commit('allExtraPiecesAddedToBoard');
            this.isDraggable = false;
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

.tower {
    background-color: grey;
}


</style>
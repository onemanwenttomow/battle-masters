<template>
	<div class="">
		<div
			class="piece tower"
			draggable
			@dragstart="dragStart"
		></div>
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
			this.$store.commit('pieceUserDragging', {id: e.target.id});
		}
	
	}
};
</script>

<style>

</style>
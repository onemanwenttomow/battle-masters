<template>
	<div class="selected-unit" :class="[selectedUnit.army === 'Imperial' ? 'imperial-card' : 'chaos-card']">
        <h3>{{selectedUnit.name}}</h3>
		<img :src="selectedUnit.img" :alt="selectedUnit.name">
		<h4>Combat Value: {{selectedUnit.combatValue}}</h4>
		<h4>Damaged Sustained: {{selectedUnit.damageReceived}}/3</h4>
		<div v-if="selectedUnit.isSelected">
			<div 
				v-if="!selectedUnit.hasMoved" 
				@click="finishMove(selectedUnit.id)"
				class="skip"
			>Skip Move</div>
		</div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	computed: mapGetters([
        'selectedUnit', 'getCurrentCard', 'getPieceById', 'checkIfUnitsInReach', 'userChosenArmy'
	]),
	methods: {
		finishMove: function(id) {
			const userChosenArmy = this.getUserChosenArmy;
			const twoPlayerGame = sessionStorage.getItem('player');
			const unit = this.getPieceById(id);
			if (twoPlayerGame) {
				if (userChosenArmy !== unit.army) {
					return;
				}
			}
			this.$store.commit('finishMove', {id});
			const unitsInReach = this.checkIfUnitsInReach(id);
			unitsInReach.length && unit[0].id !== 'canon' ? 
				this.$store.commit('canBeAttacked', {unit, unitsInReach}) :
				this.$store.commit('finishTurn', {id})
		}
	}
};
</script>

<style>
.selected-unit {
	width: 200px;
	padding: 20px;
	text-align: center;
	color: whitesmoke;
}

.selected-unit img {
	height: 60px;
	width: 60px;
}

.imperial-card {
	background-color: royalblue;
}

.chaos-card {
	background-color: hotpink;
}

.skip {
	display: inline-block;
	padding: 5px;
	background-color: whitesmoke;
	cursor: pointer;
}

.chaos-card .skip{
	color: hotpink;
}


.imperial-card .skip{
	color: royalblue;
}


</style>

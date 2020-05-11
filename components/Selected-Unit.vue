<template>
	<div class="selected-unit" :class="[selectedUnit.army === 'Imperial' ? 'imperial-card' : 'chaos-card']">
        <h3>{{selectedUnit.name}}</h3>
		<img :src="selectedUnit.img" :alt="selectedUnit.name">
		<h4>Combat Value: {{selectedUnit.combatValue}}</h4>
		<h4>Damaged Sustained: {{3 - selectedUnit.remainingLives}}/3</h4>
		<div v-if="selectedUnit.isSelected">
			<div 
				v-if="!selectedUnit.hasMoved" 
				@click="$emit('unitFinishedMoving', selectedUnit)"
				class="skip"
			>Skip Move</div>
			<div v-else>Unit can still move</div>
		</div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	computed: mapGetters([
        'selectedUnit', 'getCurrentCard'
    ]),
};
</script>

<style>
.selected-unit {
	display: inline-block;
	width: 150px;
	padding: 20px;
	margin: 20px;
	text-align: center;
	color: whitesmoke;
	transform: translateX(400px);
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

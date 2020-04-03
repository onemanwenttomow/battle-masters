<template>
	<div class="selected-unit" :class="[unit.army === 'Imperial' ? 'imperial-card' : 'chaos-card']">
        <h3>{{unit.name}}</h3>
		<img :src="unit.img" :alt="unit.name">
		<h4>Combat Value: {{unit.combatValue}}</h4>
		<h4>Damaged Sustained: {{3 - unit.remainingLives}}/3</h4>
		<div v-if="unit.isSelected">
			<div 
				v-if="!unit.hasMoved" 
				@click="$emit('unitFinishedMoving', unit)"
				class="skip"
			>Skip Move</div>
			<div v-else>Unit can still move</div>
		</div>
		{{unit}}
    </div>
</template>

<script>
export default {
	data() {
		return {
			
		};
	},
	props: ["unit"],
	methods: {
		
	}
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

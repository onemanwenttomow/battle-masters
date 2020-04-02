<template>
	<div class="selected-unit" :class="[unit.army === 'Imperial' ? 'imperial-card' : 'chaos-card']">
        <h3>{{unit.name}}</h3>
		<img :src="unit.img" :alt="unit.name">
		<h4>Combat Value: {{unit.combatValue}}</h4>
		<h4>Damaged Sustained: {{3 - unit.remainingLives}}/3</h4>
		<h4>Can Moved?: {{unit.isSelected}}</h4>
    </div>
</template>

<script>
export default {
	data() {
		return {
			
		};
	},
	props: ["unit"],
	mounted: function() {
		
	},
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
}

.imperial-card {
	background-color: royalblue;
}

.chaos-card {
	background-color: hotpink;
}

</style>

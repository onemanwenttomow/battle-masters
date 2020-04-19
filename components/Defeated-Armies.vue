<template>
    <div class="defeated-units">
        <h2>Defetated Units!</h2>
        <div v-for="unit in getDefeatedUnits" :key="unit.id" :style="{ backgroundImage: `url(${unit.img})`}" class="defeated-piece"></div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    computed: {
		...mapGetters([
        	'getDefeatedUnits'
        ])
	},
	
};
</script>

<style>
.defeated-piece {
	position: relative;
	display: inline-block;
	width: 80px;
	height: 46.19px;
	background-color: #64c7cc;
	margin: 25px;
	background-repeat: no-repeat;
	background-position: center;
	background-size: contain;
	cursor: grabbing;
}

.defeated-piece:before,
.defeated-piece:after {
	content: "";
	position: absolute;
	width: 0;
	border-left: 40px solid transparent;
	border-right: 40px solid transparent;
}

.defeated-piece:before {
	bottom: 100%;
	border-bottom: 23.09px solid #64c7cc;
}

.defeated-piece:after {
	top: 100%;
	width: 0;
	border-top: 23.09px solid #64c7cc;
}

</style>

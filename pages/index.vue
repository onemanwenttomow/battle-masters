<template>
	<fragment>
		<h1>TURN</h1>
		<div class="outer-container">
			<div>
				<TurnCards v-if="allUnitsOnBoard" />
				<SelectedUnit 
					v-if="selectedUnit"
					@unitFinishedMoving="unitFinishedMoving"
				/>
				<ArmyCards 
					army="Imperial"
					@unitFinishedMoving="unitFinishedMoving"
					@enemiesInReach="enemiesInReach"
				/>		
			</div>
			<Board />
		</div>
		<ArmyCards
			army="Chaos"
			@unitFinishedMoving="unitFinishedMoving"
			@enemiesInReach="enemiesInReach"					
		/>
	</fragment>
</template>

<script>
import Logo from "~/components/Logo.vue";
import Board from "~/components/Board.vue";
import ArmyCards from "~/components/Army-Card.vue";
import TurnCards from "~/components/Turn-Cards.vue";
import SelectedUnit from "~/components/Selected-Unit.vue";
import { mapGetters } from 'vuex';


export default {
	components: {
		Logo,
		Board,
		ArmyCards,
		TurnCards,
		SelectedUnit
	},
	data() {
		return {
			setup: {},
			boardPositions: [],
			imperialArmy: [],
			chaosArmy: [],
			allPiecesOnBoard: false,
			chaosArmyAllOnBoard: false,
			imperialArmyAllOnBoard: false,
		};
	},
	computed: mapGetters([
        'allUnitsOnBoard', 'selectedUnit', 'checkIfUnitsInReach'
    ]),
	async asyncData({ $axios }) {
		const setup = await $axios.$get("/api/initial-board");
		return { setup };
	},
	mounted: function() {
		this.imperialArmy = this.setup.armies.map(this.unitSetup);
		this.chaosArmy = this.setup.armies.map(this.unitSetup);
	},
	methods: {
		unitSetup: function(unit) {
			return {
				...unit,
				onBoard: false,
				isSelected: false,
				hasMoved: false,
				hasAttacked: false,
				finishedMove: false,
				canBeAttacked: false,
				remainingLives: 3,
				boardPosition: []
			}
		},
		unitFinishedMoving: function(unitToUpdate) {
			console.log('unitToUpdate: ',unitToUpdate);
			this.imperialArmy = this.imperialArmy.map(unit => this.updateUnitHavingMoved(unit, unitToUpdate));
			this.chaosArmy = this.chaosArmy.map(unit => this.updateUnitHavingMoved(unit, unitToUpdate));
		},
		updateUnitHavingMoved: function(unit, unitToUpdate) {
			if (unit.id === unitToUpdate.id) {
				return {
					...unit, 
					isSelected: false,
					hasMoved: true
				}
			} else {
				return {
					...unit
				}
			}
		},
		finishMove: function(id) {
			if (!this.allUnitsOnBoard) {
				return;
			}
			// this.$store.commit('finishMove', {id});
			// this.imperialArmy = this.imperialArmy.map(unit => {
			// 	if (unit.id === id) {
			// 		return {
			// 			...unit, 
			// 			finishedMove: true
			// 		}
			// 	} else {
			// 		return {
			// 			...unit
			// 		}
			// 	}
			// })
		},
		enemiesInReach: function(inReach, id) {
			this.checkIfUnitsInReach(id)
			console.log('enemiesInReach in index: ',inReach, id);
			const unitToCheck = this.imperialArmy.filter(u => u.id === id) || this.chaosArmy.filter(u => u.id === id);
			console.log('unitToCheck: ',unitToCheck[0].hasMoved);
			if (inReach.length === 0) {
				this.finishMove(id);
			}
			this.imperialArmy = this.imperialArmy.map(unit => this.canBeAttacked(unit, inReach));
			this.chaosArmy = this.chaosArmy.map(unit => this.canBeAttacked(unit, inReach));
		},
		canBeAttacked: function(unit, inReach) {
			if (inReach.some(r => r.id == unit.id)) {
				return {
					...unit, 
					canBeAttacked: true,
				}
			} else {
				return {
					...unit,
					canBeAttacked: false,
				}
			}
		},
	}
};
</script>

<style>

.cards {
	background-color: white;
	display: block;
	width: 200px;
	min-height: 90px;
	border: 3px solid blue;
	padding: 15px;
	box-shadow: 5px -5px 0 -3px white, 5px -5px green, 10px -10px 0 -3px white,
		10px -10px yellow, 15px -15px 0 -3px white, 15px -15px orange,
		20px -20px 0 -3px white, 20px -20px red;
	transition: box-shadow 1s, top 1s, left 1s;
	position: relative;
	top: 0;
	left: 0;
	cursor: pointer;
}

</style>

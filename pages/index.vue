<template>
	<fragment>
		<h1>TURN</h1>
		<div class="outer-container">
			<div>
				<TurnCards 
					v-if="allPiecesOnBoard"
					:playingcards="setup.mainPlayingCards" 
					@currentcard="currentCard"
				/>
				<SelectedUnit 
					v-if="selectedUnit.name"
					:unit="selectedUnit"
				/>
				<ArmyCards 
					:armies="imperialArmy" 
					:allPiecesOnBoard="allPiecesOnBoard"
					@rowAndColumn="updateRowAndCol"
					@allOfOneArmyOnBoard="allOfOneArmyOnBoard"
					@selectedUnit="changeSelectedUnit"
					@unitFinishedMoving="unitFinishedMoving"
				/>
				
			</div>
			<Board 
				:board="setup.board" 
				:allPiecesOnBoard="allPiecesOnBoard"
				:rowAndColumn="rowAndColumn" 
				:boardPositions="boardPositions" 
				@newposition="updatePositions"
			/>
		</div>
		<ArmyCards 
			:armies="chaosArmy" 
			:allPiecesOnBoard="allPiecesOnBoard"
			@rowAndColumn="updateRowAndCol"
			@allOfOneArmyOnBoard="allOfOneArmyOnBoard"
			@selectedUnit="changeSelectedUnit"
			@unitFinishedMoving="unitFinishedMoving"
		/>
	</fragment>
</template>

<script>
import Logo from "~/components/Logo.vue";
import Board from "~/components/Board.vue";
import ArmyCards from "~/components/Army-Card.vue";
import TurnCards from "~/components/Turn-Cards.vue";
import SelectedUnit from "~/components/Selected-Unit.vue";

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
			rowAndColumn: {},
			boardPositions: [],
			imperialArmy: [],
			chaosArmy: [],
			allPiecesOnBoard: false,
			chaosArmyAllOnBoard: false,
			imperialArmyAllOnBoard: false,
			selectedUnit: {}
		};
	},
	async asyncData({ $axios }) {
		const setup = await $axios.$get("/api/initial-board");
		return { setup };
	},
	mounted: function() {
		this.imperialArmy = this.setup.armies[0].map(this.unitSetup);
		this.chaosArmy = this.setup.armies[1].map(this.unitSetup);
	},
	methods: {
		unitSetup: function(unit) {
			return {
				...unit,
				isSelected: false,
				hasMoved: false,
				hasAttacked: false,
				finishedMove: false,
				remainingLives: 3
			}
		},
		currentCard: function(card) {
			this.imperialArmy = this.imperialArmy.map(unit => {
				return {
					...unit,
					isSelected: card.ids.includes(unit.id)
				}
			})
			this.chaosArmy = this.chaosArmy.map(unit => {
				return {
					...unit,
					isSelected: card.ids.includes(unit.id)
				}
			})
		},
		updateRowAndCol: function(rowAndColumn) {
			this.rowAndColumn = rowAndColumn;
		},
		allOfOneArmyOnBoard: function(army) {
			army === "Imperial" ? this.imperialArmyAllOnBoard = true : this.chaosArmyAllOnBoard = true
			if (this.imperialArmyAllOnBoard && this.chaosArmyAllOnBoard) {
 				this.allPiecesOnBoard = true;
			}
		},
		updatePositions: function(positions) {
			this.boardPositions.push(positions[0]);
			this.boardPositions = this.boardPositions.filter(pos => {
				return pos.row != positions[1].row || pos.col != positions[1].col
			});
		
		}, 
		unitFinishedMoving: function(unitToUpdate) {
			console.log("unitFinishedMoving!")
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
		changeSelectedUnit: function(unit) {
			this.selectedUnit = this.imperialArmy.find(u => u.id === unit.id) || this.chaosArmy.find(u => u.id === unit.id)
		}
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

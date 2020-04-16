<template>
	<div class="army-container">
		<div
			v-for="unit in getArmy(army)"
			:key="unit.id"
			class="piece"
			:class="[unit.isSelected ? 'selected' : '', unit.canBeAttacked ? 'can-be-attacked' : '']"
			:id="unit.id"
			:draggable="checkIfDraggable(unit.isSelected, unit.finishedMove)"
			@dragstart="dragStart"
			@dragover.stop
			@dragend.prevent="dragEnd($event, unit)"
			@mousedown="showPossibleMoves($event, unit.isSelected, unit.hasMoved, unit.boardPosition, unit.id)"
			@mouseup="$emit('rowAndColumn', {row: null, column: null});"
			@click="selected(unit)"
			:style="{ backgroundImage: `url(${unit.img})`}"
		></div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	data() {
		return {
			units: []
		};
	},
	props: ["army"],
	computed: mapGetters([
        'getArmy', 'getOpposingArmy', 'allUnitsOnBoard'
    ]),
	methods: {
		dragStart: function(e) {
			const target = e.target;
			e.dataTransfer.setData("id", e.target.id);
			setTimeout(function() {
				target.style.opacity = 0.3;
			}, 0);
		},
		getRowandColumn: function(elem) {
			let column, row;
			const rowClass = Array.from(elem.classList).filter(str =>
				str.startsWith("row")
			);
			const fullRow = document.getElementsByClassName(rowClass);
			for (let i = 0; i < fullRow.length; i++) {
				if (fullRow[i] === elem) {
					column = i;
					break;
				}
			}
			if (rowClass.length) {
				row = rowClass[0].slice(3) - 1;
			}
			return {
				row,
				column
			};
		},
		checkIfDraggable: function(isSelected, finishedMove) {
			console.log('finishedMove: ',finishedMove);
			if (finishedMove) {
				return false;
			}
			if (!this.allUnitsOnBoard || isSelected) {
				return true;
			}

		},
		showPossibleMoves: function(e, isSelected, hasMoved, boardPosition, id) {
			console.log('boardPosition: ',boardPosition);
			if (!this.allUnitsOnBoard) {
				return;
			}
			let surroundingTiles;
			boardPosition[0] % 2 === 0 ? 
				surroundingTiles = [[-1, 1], [-1, 0], [0, -1], [0, 1], [1, 1], [1, 0]] :
				surroundingTiles = [[-1,-1], [-1, 0], [0, -1], [0, 1], [1, -1], [1, 0]]
			const calculatedSurroundingTiles = surroundingTiles.map(tile => {
				return [tile[0] + boardPosition[0].row, tile[1] + boardPosition[0].col]
			});
			this.calculateEnemiesInReach(calculatedSurroundingTiles, id);
			console.log('calculatedSurroundingTiles: ',calculatedSurroundingTiles);

			if (!isSelected) {
				return;
			}
			const rowAndColumn = this.getRowandColumn(e.target.parentNode);
			this.$store.commit('showPossibleMoves', {id, moves: calculatedSurroundingTiles});
		},
		calculateEnemiesInReach: function(calculatedSurroundingTiles, id) {
			const enemiesInReach = this.getOpposingArmy(this.army).filter(unit => {
				let matchingTiles = calculatedSurroundingTiles.filter(tile => {
					return tile[0] === unit.boardPosition[0] && tile[1] === unit.boardPosition[1]
				});
				if (matchingTiles.length) {
					return matchingTiles
				}
			});

			this.$emit("enemiesInReach", enemiesInReach, id);
		},
		dragEnd: function(e, unit) {
			e.target.style.opacity = 1;
		},
		selected: function(card) {
			this.$store.commit('userSelected', {id: card.id})
			this.$emit("selectedUnit", card);
		}
	}
};
</script>

<style>

.army {
	border: solid 2px green;
	margin: 10px;
	cursor: grabbing;
	background-color: bisque;
}

.hexagon .piece {
	margin: 50px;
}

.piece {
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

.piece:before,
.piece:after {
	content: "";
	position: absolute;
	width: 0;
	border-left: 40px solid transparent;
	border-right: 40px solid transparent;
}

.piece:before {
	bottom: 100%;
	border-bottom: 23.09px solid #64c7cc;
}

.piece:after {
	top: 100%;
	width: 0;
	border-top: 23.09px solid #64c7cc;
}

.highlighted {
	filter: brightness(1.5);
}

.selected {
	transform: scale(1);
	filter: brightness(1.5);
	animation: pulse 2s infinite;
}

.can-be-attacked {
	background-color: crimson;
}

@keyframes pulse {
	0% {
		transform: scale(0.9);
	}

	70% {
		transform: scale(1.1);
	}

	100% {
		transform: scale(0.9);
	}
}
</style>

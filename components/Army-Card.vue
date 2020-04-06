<template>
	<div class="army-container">
		<div
			v-for="unit in units"
			:key="unit.id"
			class="piece"
			:class="[unit.isSelected ? 'selected' : '', unit.canBeAttacked ? 'can-be-attacked' : '']"
			:id="unit.id"
			:draggable="checkIfDraggable(unit.isSelected)"
			@dragstart="dragStart"
			@dragover.stop
			@dragend.prevent="dragEnd($event, unit)"
			@mousedown="showPossibleMoves($event, unit.isSelected, unit.hasMoved, unit.boardPosition)"
			@mouseup="$emit('rowAndColumn', {row: null, column: null});"
			@click="selected(unit)"
			:style="{ backgroundImage: `url(${unit.img})`}"
		></div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			units: []
		};
	},
	props: ["armies", "allPiecesOnBoard", "opposingArmy"],
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
		checkIfDraggable: function(isSelected) {
			if (!this.allPiecesOnBoard || isSelected) {
				return true;
			}

		},
		showPossibleMoves: function(e, isSelected, hasMoved, boardPosition) {
			console.log('boardPosition in showPossibleMoves: ',boardPosition);
			let surroundingTiles;
			boardPosition[0] % 2 === 0 ? 
				surroundingTiles = [[-1, 1], [-1, 0], [0, -1], [0, 1], [1, 1], [1, 0]] :
				surroundingTiles = [[-1,-1], [-1, 0], [0, -1], [0, 1], [1, -1], [1, 0]]
			const calculatedSurroundingTiles = surroundingTiles.map(tile => {
				return [tile[0] + boardPosition[0], tile[1] + boardPosition[1]]
			});
			console.log('calculatedSurroundingTiles: ',calculatedSurroundingTiles);
			const enemiesInReach = this.opposingArmy.filter(unit => {
				let matchingTiles = calculatedSurroundingTiles.filter(tile => {
					return tile[0] === unit.boardPosition[0] && tile[1] === unit.boardPosition[1]
				});
				if (matchingTiles.length) {
					return matchingTiles
				}
			});

			console.log('enemiesInReach: ',enemiesInReach);
			this.$emit("enemiesInReach", enemiesInReach);

			if (!isSelected || hasMoved) {
				return;
			}
			const rowAndColumn = this.getRowandColumn(e.target.parentNode);
			this.$emit("rowAndColumn", rowAndColumn);

		},
		dragEnd: function(e, unit) {
			e.target.style.opacity = 1;
			unit.onBoard = true;
			const numberOfUnitsOnBoard = this.units.filter(unit => unit.onBoard);
			// check to see if all of an army are on the board
			if (numberOfUnitsOnBoard.length === this.units.length) {
				this.$emit("allOfOneArmyOnBoard", numberOfUnitsOnBoard[0].army);
			}
			// set that the piece has moved..
			if (this.allPiecesOnBoard) {
				this.$emit("unitFinishedMoving", unit);
				this.$emit("selectedUnit", unit);
			}
		},
		selected: function(card) {
			this.$emit("selectedUnit", card);
		}
	},
	watch: {
		armies: function() {
			this.units = this.armies.map(unit => {
				return {
					...unit, 
					onBoard: false
				}
			});
		},
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

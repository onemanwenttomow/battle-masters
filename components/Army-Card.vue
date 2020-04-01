<template>
	<div class="army-container">
		<div
			v-for="unit in units"
			:key="unit.id"
			class="piece"
			:class="[piecesThatCanMove.length && piecesThatCanMove.find(p => p.piece === unit.id) && !piecesThatCanMove.find(p => p.piece === unit.id).hasMoved && unitsToMove.includes(unit.id) ? 'selected' : '']"
			:id="unit.id"
			:draggable="checkIfDraggable(unit.id)"
			@dragstart="dragStart"
			@dragover.stop
			@dragend.prevent="dragEnd($event, unit)"
			@mousedown="showPossibleMoves($event, unit.id)"
			@click="selected(unit)"
			:style="{ backgroundImage: `url(${unit.img})`}"
		></div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			piecesThatCanMove: [],
			units: []
		};
	},
	props: ["armies", "boardPositions", "unitsToMove", "allPiecesOnBoard"],
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
		checkIfDraggable: function(id) {
			if (!this.allPiecesOnBoard || this.unitsToMove.includes(id)) {
				return true;
			}
		},
		showPossibleMoves: function(e, id) {
			if (!this.unitsToMove.includes(id)) {
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
			if (this.piecesThatCanMove.length && this.piecesThatCanMove.find(p => p.piece === unit.id)) {
				this.piecesThatCanMove.find(piece => piece.piece == unit.id).hasMoved = true;
			}
		},
		selected: function(card) {
			console.log("show extra info about", card, this.piecesThatCanMove);
			let selectedCard = this.piecesThatCanMove.find(unit => unit.piece === card.id);
			console.log('selectedCard: ',selectedCard);
			card = {
				card,
				hasMoved: selectedCard.hasMoved,
				hasAttacked: selectedCard.hasAttacked,
				finishedMove: selectedCard.finishedMove
			}
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
		unitsToMove: function() {
			let piecesThatCanMove = this.unitsToMove.map(piece => {
				return {
					piece: piece,
					hasMoved: false,
					hasAttacked: false,
					finishedMove: false
				}
			})
			this.piecesThatCanMove = piecesThatCanMove;
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

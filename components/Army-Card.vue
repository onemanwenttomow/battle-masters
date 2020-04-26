<template>
	<div class="army-container">
		<div
			v-for="unit in getArmy(army)"
			:key="unit.id"
			class="piece"
			:class="[checkIfSelected(unit) ? 'selected' : '', unit.canBeAttacked ? 'can-be-attacked' : '']"
			:id="unit.id"
			:draggable="checkIfDraggable(unit.isSelected, unit.finishedTurn)"
			@dragstart="dragStart"
			@dragover.stop
			@dragend.prevent="dragEnd($event, unit)"
			@mousedown="showPossibleMoves($event, unit.isSelected, unit.hasMoved, unit.boardPosition, unit.id)"
			@mouseup="$emit('rowAndColumn', {row: null, column: null});"
			@click="selected($event,unit)"
			:style="{ backgroundImage: `url(${unit.img})`}"
		></div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	props: ["army"],
	computed: mapGetters([
		'getArmy', 
		'getOpposingArmy', 
		'allUnitsOnBoard', 
		'getSurroundingTiles', 
		'getUnitThatCanAttack', 
		'getPieceById',
		'getCurrentOgreCard'
    ]),
	methods: {
		dragStart: function(e) {
			const target = e.target;
			e.dataTransfer.setData("id", e.target.id);
			setTimeout(function() {
				target.style.opacity = 0.3;
			}, 0);
		},
		checkIfSelected: function(unit) {
			const ogreCheck = true;
			if (unit.id === 'gromorg' && this.getCurrentOgreCard.type === 'none') {
				ogreCheck = false;
			}
			return unit.isSelected && !unit.finishedTurn && ogreCheck && !this.getCurrentOgreCard.cardUsed;
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
			if (finishedMove) {
				return false;
			}
			if (!this.allUnitsOnBoard || isSelected) {
				return true;
			}

		},
		showPossibleMoves: function(e, isSelected, hasMoved, boardPosition, id) {
			const piece = this.getPieceById(id)[0];
			console.log('piece.hasMoved: ',piece);
			if (!this.allUnitsOnBoard) {
				return;
			}
			if (id === 'grimorg' && this.ogreMoveAttackCheck(id,piece)) {
				return;
			}
			
			let calculatedSurroundingTiles = this.getSurroundingTiles(id);
			if (!isSelected) {
				return;
			}
			const rowAndColumn = this.getRowandColumn(e.target.parentNode);
			this.$store.commit('showPossibleMoves', {id, moves: calculatedSurroundingTiles});
		},
		ogreMoveAttackCheck: function(id, piece) {
			if (this.getCurrentOgreCard.type === 'none' || this.getCurrentOgreCard.type === 'attack') {
				console.log('NO OGRE CARD OR ATTACK CARD!');
				return true;
            }
			if (this.getCurrentOgreCard.type === 'move' && piece.hasMoved) {
				console.log('OGRE ALREADY MOVED!');
                return true;
            }
		},
		dragEnd: function(e, unit) {
			e.target.style.opacity = 1;
		},
		selected: function(e, card) {
			if (e.target.classList.contains('can-be-attacked')) {

				this.$store.commit('startAttack', {
					unitUnderAttack: this.getPieceById(card.id)
				});
				return;
			} 
			this.$store.commit('userSelected', {id: card.id})
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
	cursor: url('/crossed-swords.png'), auto;
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

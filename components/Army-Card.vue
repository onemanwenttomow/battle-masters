<template>
	<div class="army-container">
		<div
			v-for="unit in getArmy(army)"
			:key="unit.id"
			class="piece"
			:class="[
				checkIfSelected(unit) ? 'selected' : '', 
				unit.canBeAttacked ? 'can-be-attacked' : '',
				getUserChosenArmy === army ? '' : 'non-drag'
			]"
			:id="unit.id"
			:draggable="checkIfDraggable(unit.isSelected, unit.finishedTurn, army)"
			@dragstart="dragStart"
			@drop.prevent="drop($event)"
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
	computed: {
		...mapGetters([
			'getArmy', 
			'getOpposingArmy', 
			'allUnitsOnBoard', 
			'getSurroundingTiles', 
			'getUnitThatCanAttack', 
			'getPieceById',
			'getCurrentOgreCard',
			'getCurrentCard',
			'getUserChosenArmy'
		])
	},
	methods: {
		updateStyle: function(piece) {
			piece.style.position = "absolute";
			piece.style.top = -15 + "px";
			piece.style.zIndex = 10;
			piece.style.opacity = 0.5;
			piece.style.left = -10 + 'px';
		},
		checkIfCanonPieceCanBeDropped: function(piece, unit) {
			if (piece.id.indexOf('canon-fly') > -1 || piece.id.indexOf('canon-bounce') > -1 || piece.id.indexOf('canon-explosion') > -1) {
				return true;
			}
			if (piece.id.indexOf('canon-target') > -1 && unit.army === "Chaos") {
				return true;
			}
		},
		drop: function(e, row, col) {
			const piece = document.getElementById(e.dataTransfer.getData("id"));
			const unit = this.getPieceById(e.target.id)[0];
			if (!piece || piece.id.indexOf('canon-') === -1) {
				return;
			}
			this.updateStyle(piece);
			if (this.checkIfCanonPieceCanBeDropped(piece, unit)) {
				this.$store.commit('droppedCanonCardOnBoard', {id: piece.id, unitUnder: unit.id})
				e.target.appendChild(piece);
				return;
			}
		},
		dragStart: function(e) {
			const target = e.target;
			e.dataTransfer.setData("id", e.target.id);
			setTimeout(function() {
				target.style.opacity = 0.3;
			}, 0);
			this.$store.commit('pieceUserDragging', {id: e.target.id});
		},
		checkIfSelected: function(unit) {
			const ogreCheck = true;
			if (unit.id === 'gromorg' && this.getCurrentOgreCard.type === 'none') {
				ogreCheck = false;
			}
			return unit.isSelected && !unit.finishedTurn && ogreCheck && !this.getCurrentOgreCard.cardUsed;
		},
		checkIfDraggable: function(isSelected, finishedMove, army) {
			console.log('check if draggable: ',army, this.getUserChosenArmy !== army);
			if (this.getUserChosenArmy !== army) {

				return false;
			}
			if (finishedMove) {
				return false;
			}
			if (!this.allUnitsOnBoard || isSelected) {
				return true;
			}

		},
		showPossibleMoves: function(e, isSelected, hasMoved, boardPosition, id) {
			const piece = this.getPieceById(id)[0];
			if (!this.allUnitsOnBoard || hasMoved) {
				return;
			}
			if (id === 'grimorg' && this.ogreMoveAttackCheck(id,piece)) {
				return;
			}
			
			let calculatedSurroundingTiles = this.getSurroundingTiles(id);
			if (!isSelected) {
				return;
			}
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

.non-drag {
	user-drag: none; 
	user-select: none;
	-moz-user-select: none;
	-webkit-user-drag: none;
	-webkit-user-select: none;
	-ms-user-select: none;
}

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
	margin: 25px 10px;
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

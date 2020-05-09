<template>
	<div class="container">
		<div class="board">
			<fragment v-for="row in getBoard" v-bind:key="row.row">
				<div
					v-for="(hex, column) in row.type"
					class="hexagon"
                    v-bind:key="row.row + column"
					:class="[
                        hex, 
                        row.row, 
						checkIfOnCanonPath(row.row, column) ? 'canon-path': '',
                        hex!= 'river' && checkIfSelected(row.row, column) ? 'highlighted': '',
						hex!= 'river' && preGamePossibleMoves(row.row) ? 'highlighted': '',
                    ]"
					@dragover.prevent
					@drop.prevent="drop($event, row.row, column)"
				>
					<slot />
				</div>
			</fragment>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	computed: {
		...mapGetters([
			'getBoard', 
			'allUnitsOnBoard', 
			'getPossibleMoves', 
			'checkIfUnitsInReach', 
			'getPieceById',
			'getNumOfRemainingOgreCards',
			'getCanonPath',
			'getPieceUserDragging'
		])
	},
	methods: {
		checkIfOnCanonPath: function(row, col) {
			row = Number(row.slice(3)) -1;
			return this.getCanonPath.find(location => location.row === row && location.col === col) 
		},
		checkIfSelected: function(row, col) {
			row = Number(row.slice(3));
			return this.getPossibleMoves.find(move => move[0] === (row -1) && move[1] === col);
		},
		preGamePossibleMoves: function(row) {
			if (this.allUnitsOnBoard) {
				return false;
			}
			row = Number(row.slice(3)) - 1;
			let army = this.getPieceUserDragging.army;
			// 1
			if (army === 'Imperial' && row <= 5) {
				return true;
			}
			//10
			if (army === 'Chaos' && row >= 5) {
				return true;
			}
		},
		isCanonTargetOrUnit: function(piece, e) {
			if (piece.id.indexOf('canon-target') > -1 || e.target.classList.contains("piece") && piece.id.indexOf('canon-target') === -1) {
				piece.style.opacity = 0.8;
				return true;
			}
		},
		isCanonPiece: function(piece) {
			return piece.id.indexOf('canon-fly') > -1 || piece.id.indexOf('canon-bounce') > -1 || piece.id.indexOf('canon-explosion') > -1
		},
		addCanonPieceToBoard: function(piece, e) {
			piece.style.position = "absolute";
			piece.style.top = -10 + "px";
			piece.style.zIndex = 10;
			piece.style.opacity = 1;
			this.$store.commit('droppedCanonCardOnBoard', {id: piece.id})
			e.target.appendChild(piece);
			return true;
		},
		addUnitToBoard: function(piece, e, row, col) {
			piece.style.top = -45 + "px";
			piece.style.left = -40 + "px";
			piece.style.zIndex = 10;
			e.target.appendChild(piece);
			!isNaN(row) && this.$store.commit('updateUnitPosition', {
				id: piece.id, 
				positions: {row, col}
			})
		},
		finishOgreTurn: function(piece) {
			const canOgreStillMove = this.getNumOfRemainingOgreCards;
			this.$store.commit('finishTurn', {id: piece.id, canOgreStillMove});
			return true;
		},
		checkForUnitsInRange: function(piece) {
			const unit = this.getPieceById(piece.id);
			const unitsInReach = this.checkIfUnitsInReach(piece.id);
			unitsInReach.length && unit[0].id !== 'canon' ? 
				this.$store.commit('canBeAttacked', {unit, unitsInReach}) :
				this.$store.commit('finishTurn', {id: piece.id})
		},
		drop: function(e, row, col) {


			this.$store.commit('pieceUserDragging', {id: null});
			const piece = document.getElementById(e.dataTransfer.getData("id"));
			console.log('piece.id: ',piece.id);
			if (piece.id === 'tower' && !e.target.classList.contains("river") && !e.target.classList.contains("road")) {
				e.target.classList.add('tower');
				piece.remove();
			}
			if (!piece || this.isCanonTargetOrUnit(piece, e)) {
				return;
			}
	
            row = Number(row.slice(3) -1);
			const moveToHighlighted = e.target.classList.contains("highlighted");
		

			if (this.isCanonPiece(piece)) {
				if (!e.target.classList.contains("canon-path")) {
					return;
				}
				return this.addCanonPieceToBoard(piece, e)
			} 
			if (!e.target.classList.contains("river") && moveToHighlighted) {
				this.addUnitToBoard(piece, e, row, col)
			}

			piece.style.opacity = 1;
			this.$store.commit('showPossibleMoves', {id: "none", moves: "none"});
			
			if (!this.allUnitsOnBoard) {
				return;
			}
			if (piece.id === 'grimorg') {
				return this.finishOgreTurn(piece);
			}

			this.checkForUnitsInRange(piece);
			this.$store.commit('finishMove', {id: piece.id})
			
		}
    }
};
</script>

<style>
.container {
	display: flex;
	justify-content: center;
	align-items: center;
}

.board {
	display: grid;
	grid-template-columns: repeat(12, 100px);
	height: 1050px;
	width: 1200px;
}

.hexagon {
	position: relative;
	width: 99px;
	height: 57.16px;
	margin: 28.58px 0;
	border-left: solid 1px #333333;
	border-right: solid 1px #333333;
}

.hexagon:before,
.hexagon:after {
	content: "";
	position: absolute;
	z-index: 1;
	width: 70px;
	height: 70px;
	-webkit-transform: scaleY(0.5774) rotate(-45deg);
	-ms-transform: scaleY(0.5774) rotate(-45deg);
	transform: scaleY(0.5774) rotate(-45deg);
	background-color: inherit;
	left: 13.4982px;
}

.hexagon:before {
	top: -35.0018px;
	border-top: solid 1.4142px #333333;
	border-right: solid 1.4142px #333333;
}

.hexagon:after {
	bottom: -35.0018px;
	border-bottom: solid 1.4142px #333333;
	border-left: solid 1.4142px #333333;
}

.row2 {
	grid-row: 2/3;
	transform: translate(-50px, -30px);
}

.row3 {
	grid-row: 3/4;
	transform: translate(0, -60px);
}

.row4 {
	grid-row: 4/5;
	transform: translate(-50px, -90px);
}

.row5 {
	grid-row: 5/6;
	transform: translate(0, -120px);
}

.row6 {
	grid-row: 6/7;
	transform: translate(-50px, -150px);
}

.row7 {
	grid-row: 7/8;
	transform: translate(0, -180px);
}

.row8 {
	grid-row: 8/9;
	transform: translate(-50px, -210px);
}

.row9 {
	grid-row: 9/10;
	transform: translate(0, -240px);
}

.row10 {
	grid-row: 10/11;
	transform: translate(-50px, -270px);
}

.row11 {
	grid-row: 11/12;
	transform: translate(0, -300px);
}

.row12 {
	grid-row: 12/13;
	transform: translate(-50px, -330px);
}

.road {
	background-color: #8e5a46;
}

.field {
	background-color: #76a828;
}

.canon-path {
	background-color: rebeccapurple;
}

.river.canon-path {
	background-color: rebeccapurple;
}

/* .field:nth-child(4n) {
    filter: saturate(0.7);
}

.field:nth-child(7n) {
    filter: grayscale(0.4);
} */

.river {
	background-color: #5babd5;
}

@media screen and (min-width: 320px) and (max-width: 667px) {
}
</style>

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
                        hex!= 'river' && checkIfSelected(row.row, column) ? 'highlighted': '',
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
			'getNumOfRemainingOgreCards'
		]), 
	},
	methods: {
		checkIfSelected: function(row, col) {
			row = Number(row.slice(3));
			return this.getPossibleMoves.find(move => move[0] === (row -1) && move[1] === col);
		},
		drop: function(e, row, col) {
			const piece = document.getElementById(e.dataTransfer.getData("id"));
			if (!piece) {
				return;
			}

			if (piece.id.indexOf('canon-target') > -1 || Array.from(e.target.classList).includes("piece") && piece.id.indexOf('canon-target') === -1) {
				piece.style.opacity = 0.8;
				return;
			}
	
            row = Number(row.slice(3) -1);
			let moveToHighlighted = true;
			if (this.allUnitsOnBoard) {
				moveToHighlighted = Array.from(e.target.classList).includes("highlighted")
			}

			if (piece.id.indexOf('canon-fly') > -1 || piece.id.indexOf('canon-bounce') > -1 || piece.id.indexOf('canon-explosion') > -1) {
				piece.style.position = "absolute";
				piece.style.top = -10 + "px";
				piece.style.zIndex = 10;
				piece.style.opacity = 1;
				this.$store.commit('droppedCanonCardOnBoard', {id: piece.id})
				e.target.appendChild(piece);
				return;
			} else if (!Array.from(e.target.classList).includes("river") && moveToHighlighted) {
				piece.style.top = -45 + "px";
				piece.style.left = -40 + "px";
				piece.style.zIndex = 10;
				e.target.appendChild(piece);
				!isNaN(row) && this.$store.commit('updateUnitPosition', {
					id: piece.id, 
					positions: {row, col}
				})
			}

			piece.style.opacity = 1;
			
			this.$store.commit('showPossibleMoves', {id: "none", moves: "none"});
			if (!this.allUnitsOnBoard) {
				return;
			}
			if (piece.id === 'grimorg') {
				const canOgreStillMove = this.getNumOfRemainingOgreCards;
				this.$store.commit('finishTurn', {id: piece.id, canOgreStillMove});
				return;
			}
			const unit = this.getPieceById(piece.id);
			console.log('unit: ',unit);
			const unitsInReach = this.checkIfUnitsInReach(piece.id);
			unitsInReach.length && unit[0].id !== 'canon' ? 
				this.$store.commit('canBeAttacked', {unit, unitsInReach}) :
				this.$store.commit('finishTurn', {id: piece.id})

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

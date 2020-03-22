<template>
	<div class="container">
		<div class="board">
			<fragment v-for="row in board" v-bind:key="row.row">
				<div
					v-for="(hex, column) in row.type"
					class="hexagon"
                    v-bind:key="row.row + column"
					:class="[
                        hex, 
                        row.row, 
                        hex!= 'river' && selectedRow == Number(row.row.slice(3)) -1 && selectedColumn == column -1 ? 'highlighted': '',
                        hex!= 'river' && selectedRow == Number(row.row.slice(3)) -1 && selectedColumn == column +1 ? 'highlighted': '',
                        hex!= 'river' && selectedRow == Number(row.row.slice(3)) && selectedColumn == column ? 'highlighted': '',
                        hex!= 'river' && selectedRow == Number(row.row.slice(3)) && selectedColumn == column + oddRow ? 'highlighted': '',
                        hex!= 'river' && selectedRow == Number(row.row.slice(3)) -2 && selectedColumn == column  ? 'highlighted': '',
                        hex!= 'river' && selectedRow == Number(row.row.slice(3)) -2 && selectedColumn == column + oddRow ? 'highlighted': ''
                    ]"
					@click="testing(hex, row.row, column)"
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
export default {
	data() {
		return {
            selectedRow: null,
            selectedColumn: null
        };
	},
	props: ["board", "rowAndColumn", "boardPositions"],
	methods: {
		testing: function(squareType, row, index) {
			console.log("testing squareType, row, col: ", squareType, row.slice(3), index);
		},
		drop: function(e, row, col) {
			const piece = document.getElementById(e.dataTransfer.getData("id"));
            console.log("rowAndColumn in BOARD: ", Number(row.slice(3) -1) , col);
            row = Number(row.slice(3) -1);
            console.log('e.currentTarget: ',e.target);

			if (!Array.from(e.target.classList).includes("river")) {
				piece.style.top = -45 + "px";
				piece.style.left = -40 + "px";
				piece.style.zIndex = 10;
				e.target.appendChild(piece);
            }
            piece.style.opacity = 1;
            console.log("this.selectedRow: ", this.selectedRow, this.selectedColumn)
            !isNaN(row) && this.$emit("newposition", {row, col});
            this.selectedRow = null;
            this.selectedColumn = null;
		}
    },
    computed: {
        oddRow: function() {
            return this.selectedRow % 2 == 0 ? -1 : +1;
        }
    },
	watch: {
		rowAndColumn: function() {
            console.log("new row and column", this.rowAndColumn);
            this.selectedRow = this.rowAndColumn.row;
            this.selectedColumn = this.rowAndColumn.column;
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
	/* overflow: hidden; */
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

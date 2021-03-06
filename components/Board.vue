<template>
	<div class="boards-container">
		<div class="board" ref="boardsize" @scroll="handleScroll">
			<fragment v-for="row in getBoard" v-bind:key="row.row">
				<div
					v-for="(hex, column) in row.type"
					class="hexagon"
                    v-bind:key="row.row + column"
					:class="[
                        hex, 
                        row.row, 
						checkIfOnCanonPath(row.row, column) ? 'canon-path': '',
                        hex!= 'marsh' && hex!= 'river' && checkIfSelected(row.row, column) ? 'highlighted': '',
						hex!= 'marsh' && hex!= 'river' && preGamePossibleMoves(row.row) ? 'highlighted': '',
                    ]"
					@dragover.prevent
					@drop.prevent="drop($event, row.row, column)"
				>
					<slot />
				</div>
			</fragment>
		</div>

		<div class="board mini-map" ref="minimapsize" @click="moveMiniMap">
			<div 
				class="mini-map-location" 
				:style="{ 
					height: miniMapHeight,
					width: miniMapWidth,
					top: miniMapTop,
					left: miniMapLeft
				}"
				@mousedown="handleMouseDown"
				@mouseup="miniMapDragging = false"
			></div>
			<fragment v-for="row in getBoard" v-bind:key="row.row">
				<div
					v-for="(hex, column) in row.type"
					class="hexagon"
                    v-bind:key="row.row + column"
					:class="[
						checkIfImperialUnitOnBoard(row.row, column) ? 'imperial-on-board': '',
						checkIfChaosUnitOnBoard(row.row, column) ? 'chaos-on-board': '',
						checkIfUnitIsActive(row.row, column) ? 'mini-board-active': '',
                        hex, 
                        row.row, 
						checkIfOnCanonPath(row.row, column) ? 'canon-path': '',
                        hex!= 'marsh' && hex!= 'river' && checkIfSelected(row.row, column) ? 'highlighted': '',
						hex!= 'marsh' && hex!= 'river' && preGamePossibleMoves(row.row) ? 'highlighted': '',
                    ]"
					@dragover.prevent
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
			'getPieceUserDragging',
			'getArmyPositions',
			'getActiveUnitsPositions',
			'getUserChosenArmy',
			'getExtraTiles'
		])
	},
	data() {
		return {
			miniMapHeight: 0,
			miniMapWidth: 0,
			miniMapTop: "0px",
			miniMapLeft: "0px",
			miniMapDragging: false
        };
	},
	props: ['socket'],
	mounted: function() {
		this.miniMapHeight = this.$refs.boardsize.clientHeight + "px";
		this.miniMapWidth = this.$refs.boardsize.clientWidth + "px";

		this.socket.on('other player dropped tile', ({id, row, col}) => {
			const extraTiles1 = this.getExtraTiles.map(tile => tile.front.id);
			const extraTiles2 = this.getExtraTiles.map(tile => tile.back.id);
			const extraTiles = [...extraTiles1, ...extraTiles2];
			const elem = document.querySelectorAll(`.${row}`)[col];
			const piece = document.getElementById(id);
			if (extraTiles.includes(id)) {
				this.addExtraTileToBoard(piece, elem);
			} else {
				this.addUnitToBoard(piece, elem, row, col);
				this.socket.emit("updateUnitPosition", {
					id: piece.id, 
					player: sessionStorage.getItem('player'),
					roomId: sessionStorage.getItem('roomId'),
					positions: {row: Number(row.slice(3) -1), col}
				})
			}
		});
	},
	methods: {
		handleScroll(e) {
			this.miniMapTop = this.$refs.boardsize.scrollTop + "px";
			this.miniMapLeft = this.$refs.boardsize.scrollLeft + "px";
    	},
		handleMouseDown: function() {
			this.miniMapDragging = true;
		},
		moveMiniMap: function(e) {
			if (!this.miniMapDragging && e.type !== "click") {
				return;
			}
			let y = (e.pageY -this.$refs.minimapsize.getBoundingClientRect().top) * 5 - 300;
			let x = (e.pageX -this.$refs.minimapsize.getBoundingClientRect().left) * 5 - 400;
			const maxX = 440;
			const maxY = 550;
			const maxXscroll = this.$refs.boardsize.scrollWidth - this.$refs.boardsize.clientWidth;
			const maxYscroll = this.$refs.boardsize.scrollHeight - this.$refs.boardsize.clientHeight;
			const xScrollTo = (maxXscroll / 100) * (x / maxX) * 100;
			const yScrollTo = (maxYscroll / 100) * (y / maxY) * 100;
			if (e.type !=="click" && x < 0 || e.type !=="click" && y < 0) {
				this.miniMapDragging = false;
				return;
			}
			this.$refs.boardsize.scrollLeft = xScrollTo;
			this.$refs.boardsize.scrollTop = yScrollTo;
			
			this.miniMapTop = y + "px";
			this.miniMapLeft = x + "px";
		},
		checkIfUnitIsActive: function(row, col) {
			if (!this.allUnitsOnBoard || !this.getActiveUnitsPositions) {
				return;
			}
			row = Number(row.slice(3)) -1;
			return this.getActiveUnitsPositions.find(location => location && location.row === row && location && location.col === col) 
		},
		checkIfImperialUnitOnBoard: function(row, col) {
			row = Number(row.slice(3)) -1;
			return this.getArmyPositions('Imperial').find(location => location && location.row === row && location && location.col === col) 
		},
		checkIfChaosUnitOnBoard: function(row, col) {
			row = Number(row.slice(3)) -1;
			return this.getArmyPositions('Chaos').find(location => location && location.row === row && location && location.col === col) 
		},
		checkIfOnCanonPath: function(row, col) {
			if (!this.allUnitsOnBoard) {
				return;
			}
			row = Number(row.slice(3)) -1;
			return this.getCanonPath.find(location => location.row === row && location.col === col) 
		},
		checkIfSelected: function(row, col) {
			// add a check to see if class row4 index col child has class marsh.
			// if so return false...
			row = Number(row.slice(3));
			return this.getPossibleMoves.find(move => move.row === (row -1) && move.col === col);
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
		addUnitToBoard: function(piece, elem, row, col) {
			piece.style.top = -45 + "px";
			piece.style.left = -40 + "px";
			piece.style.zIndex = 10;
			elem.appendChild(piece);
			!isNaN(row) && this.$store.commit('updateUnitPosition', {
				id: piece.id, 
				positions: {row, col}
			})
		},
		addExtraTileToBoard: function(piece, elem) {
			piece.style.top = -105 + "px";
			piece.style.left = -10 + "px";
			piece.style.zIndex = 2;
			elem.appendChild(piece);
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

			unitsInReach.length && unit[0].id !== 'canon' ? 
				this.socket.emit('canBeAttacked', {
					player: sessionStorage.getItem('player'),
					roomId: sessionStorage.getItem('roomId'),
					unit, 
					unitsInReach
				}) :
				this.socket.emit('finishTurn', {
					player: sessionStorage.getItem('player'),
					roomId: sessionStorage.getItem('roomId'),
					id: piece.id
				})
		},
		drop: function(e, row, col) {
			this.$store.commit('pieceUserDragging', {id: null});
			const piece = document.getElementById(e.dataTransfer.getData("id"));
			const towerTile = piece.id.includes('tower');
			const marshTile = piece.id.includes('marsh');
			const fordTile = piece.id.includes('ford');
			const ditchTile = piece.id.includes('ditch');
			let extraTile = towerTile || marshTile || ditchTile;
			if (extraTile && !e.target.classList.contains("river") && !e.target.classList.contains("road")) {
				this.addExtraTileToBoard(piece, e.target);
			}
			if (fordTile && e.target.classList.contains("river") && !e.target.classList.contains("road") && !e.target.classList.contains("field")) {
				this.addExtraTileToBoard(piece, e.target);
			}
			this.socket.emit('tile drag end', {
				id: piece.id, 
				player: sessionStorage.getItem('player'),
				roomId: sessionStorage.getItem('roomId'),
				row, 
				col
			});
			if (!piece || this.isCanonTargetOrUnit(piece, e)) {
				return;
			}
	
            row = Number(row.slice(3) -1);
			const moveToHighlighted = e.target.classList.contains("highlighted");
			const tower = e.target.classList.contains("tower")
		

			if (this.isCanonPiece(piece)) {
				if (!e.target.classList.contains("canon-path")) {
					return;
				}
				return this.addCanonPieceToBoard(piece, e)
			} 
			if (!e.target.classList.contains("river") && moveToHighlighted || tower) {
				this.addUnitToBoard(piece, e.target, row, col)
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
			this.socket.emit('finishMove', {
				id: piece.id, 
				player: sessionStorage.getItem('player'),
				roomId: sessionStorage.getItem('roomId'),
			})
			this.$store.commit('finishMove', {id: piece.id})
			
		}
    }
};
</script>

<style>
.boards-container {
	display: flex;
	grid-row: 1/ -1;
	grid-column: 1/ 2;
}
.hexagon.imperial-on-board {
	background-color: navy;
}

.hexagon.chaos-on-board {
	background-color: hotpink;
}

.hexagon.mini-board-active {
	animation: active 2s infinite;
}

@keyframes active {
	0% {
		opacity: 0;
	}

	50% {
		opacity: 1
	}

	100% {
		opacity: 0
	}
}

.mini-map {
	position: relative;
}

.mini-map-location {
	position: absolute;
	background-color: hotpink;
	opacity: 0.5;
	z-index: 500;
	cursor:grabbing;
}
.board.mini-map {
	height: 1050px;
	width: 1200px;
	transform: translate(300px, -420px) scale(0.2);
	position: absolute;
	top: 0;
}


.board {
	display: grid;
	grid-template-columns: repeat(12, 100px);
	height: 100vh;
	width: 800px;
	overflow: scroll;
	/* height: 1050px; */
	box-sizing: content-box;
	border-right: 10px solid red;
	padding: 0 50px;
	-ms-overflow-style: none;  /* Internet Explorer 10+ */
    scrollbar-width: none;  /* Firefox */
}

.board::-webkit-scrollbar { 
    display: none;  /* Safari and Chrome */
}

.hexagon {
	box-sizing: content-box;
	user-select: none;
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

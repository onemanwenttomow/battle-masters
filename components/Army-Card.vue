<template>
	<div>
		<div
			class="piece"
			:id="card.id"
			v-for="card in armies[0]"
			:key="card.id"
			draggable="true"
			@dragstart="dragStart"
			@dragover.stop
			@dragend.prevent="dragEnd"
			@mousedown="showPossibleMoves"
			@mouseup="hidePossibleMoves"
			@click="selected"
			:style="{ backgroundImage: `url(${card.img})` }"
		></div>
	</div>
</template>

<script>
export default {
	data() {
		return {};
	},
	props: ["armies"],
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
		showPossibleMoves: function(e) {
			const rowAndColumn = this.getRowandColumn(e.target.parentNode);
			const row = rowAndColumn.row;
			const column = rowAndColumn.column;
			const possibleMoves = [];
			console.log("row: ", row % 2);
			let oddRow;
			row % 2 === 0 ? (oddRow = 1) : (oddRow = -1);
			console.log("oddRow: ", oddRow);
			possibleMoves.push(document.getElementsByClassName("row" + (row + 1))[column - 1]);
			possibleMoves.push(document.getElementsByClassName("row" + (row + 1))[column + 1]);
			possibleMoves.push(document.getElementsByClassName("row" + row)[column + oddRow]);
			possibleMoves.push(document.getElementsByClassName("row" + row)[column]);
			possibleMoves.push(document.getElementsByClassName("row" + (row + 2))[column + oddRow]);
			possibleMoves.push(document.getElementsByClassName("row" + (row + 2))[column]);
			// console.log('possibleMoves: ',possibleMoves);
			possibleMoves.map(elem => {
				if (elem) {
					elem.classList.add("highlighted");
				}
			});
			this.$emit("rowAndColumn", rowAndColumn);
		},
		hidePossibleMoves: function() {
			let hightlightsToRemove = document.getElementsByClassName("highlighted");
			console.log('possibleMoves in hide: ',hightlightsToRemove);
			for (var i = 0; i < hightlightsToRemove.length; i++) {
				console.log('posibleMoves[i]: ',hightlightsToRemove[i], i);
				hightlightsToRemove[i].classList.remove('highlighted');
			}

		},
		dragEnd: function(e) {
			e.target.style.opacity = 1;
		},
		selected: function(e) {
			console.log("selected...");
			e.target.classList.add("selected");
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

.piece {
	position: relative;
	width: 80px;
	height: 46.19px;
	background-color: #64c7cc;
	margin: 50px;
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

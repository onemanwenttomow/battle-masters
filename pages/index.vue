<template>
	<fragment>
		<h1>TURN</h1>
		<div class="outer-container">
			<div>
				<TurnCards 
					v-if="boardPositions.length == 25"
					:playingcards="setup.mainPlayingCards" 
					@currentcard="currentCard"
				/>
				<ArmyCards 
					:armies="imperialArmy" 
					:boardPositions="boardPositions"
					:unitsToMove="unitsToMove" 
					:allPiecesOnBoard="allPiecesOnBoard"
					@rowAndColumn="updateRowAndCol" 
				/>
				
			</div>
			<Board 
				:board="setup.board" 
				:allPiecesOnBoard="allPiecesOnBoard"
				:rowAndColumn="rowAndColumn" 
				:boardPositions="boardPositions" 
				@newposition="updatePositions"
			/>
		</div>
		<ArmyCards 
			:armies="chaosArmy" 
			:boardPositions="boardPositions"
			:unitsToMove="unitsToMove" 
			:allPiecesOnBoard="allPiecesOnBoard"
			@rowAndColumn="updateRowAndCol" 
		/>
	</fragment>
</template>

<script>
import Logo from "~/components/Logo.vue";
import Board from "~/components/Board.vue";
import ArmyCards from "~/components/Army-Card.vue";
import TurnCards from "~/components/Turn-Cards.vue";

export default {
	components: {
		Logo,
		Board,
		ArmyCards,
		TurnCards
	},
	data() {
		return {
			setup: {},
			rowAndColumn: {},
			boardPositions: [],
			unitsToMove: [],
			imperialArmy: [],
			chaosArmy: [],
			allPiecesOnBoard: false
		};
	},
	async asyncData({ $axios }) {
		const setup = await $axios.$get("/api/initial-board");
		return { setup };
	},
	mounted: function() {
		console.log("index mounted", this.setup);
		this.imperialArmy = this.setup.armies[0];
		this.chaosArmy = this.setup.armies[1];
		console.log('this.imperialArmy: ',this.imperialArmy);

	},
	methods: {
		selectCard: function() {
			this.setup.armies[0].shift();
		},
		currentCard: function(card) {
			console.log("card: ", card);
			this.unitsToMove = card.ids;
		},
		updateRowAndCol: function(rowAndColumn) {
			this.rowAndColumn = rowAndColumn;
		},
		updatePositions: function(positions) {
			this.boardPositions.push(positions[0]);
			this.boardPositions = this.boardPositions.filter(pos => {
				return pos.row != positions[1].row || pos.col != positions[1].col
			});
			console.log('boardPositions: ',this.boardPositions);
			if(this.boardPositions.length == 25) {
 				this.allPiecesOnBoard = true;
			}
		}
	}
};
</script>

<style>
.outer-container {

}

.pink {
	background-color: hotpink;
}

.cards {
	background-color: white;
	display: block;
	width: 200px;
	min-height: 90px;
	border: 3px solid blue;
	padding: 15px;
	/* margin: calc(50vh - 30px) auto 0 auto; */
	box-shadow: 5px -5px 0 -3px white, 5px -5px green, 10px -10px 0 -3px white,
		10px -10px yellow, 15px -15px 0 -3px white, 15px -15px orange,
		20px -20px 0 -3px white, 20px -20px red;
	transition: box-shadow 1s, top 1s, left 1s;
	position: relative;
	top: 0;
	left: 0;
	cursor: pointer;
}

/* .card:hover {
  top: -20px;
  left: 20px;
  box-shadow: 0 0 0 -3px white, 0 0 0 0 green,
      0 0 0 -3px white, 0 0 0 0 yellow,
      0 0 0 -3px white, 0 0 0 0 orange,
      0 0 0 -3px  white, 0 0 0 0 red;
} */
</style>

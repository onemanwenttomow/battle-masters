<template>
	<div v-if="gameHasStarted">
		<!-- v-if="canonTurn" -->
		<CanonCards  />
		<AttackArea v-if="getAttackModeStatus" />
		<TurnCards 
			v-if="ogreTurn" 
			:getPlayingCards="getOgreCards" 
			cardBack="/ogre-back.png"
			currentCard="currentOgreCard"
			cards="ogre"
		/>
		<div class="outer-container">
			<div>
				<TurnCards 
					v-if="allUnitsOnBoard" 
					:getPlayingCards="getPlayingCards" 
					cardBack="/card-back.png"
					currentCard="currentCard"
					cards="playing"
				/>
				<SelectedUnit v-if="selectedUnit" />
				<ArmyCards army="Imperial" />		
			</div>
			<Board />
		</div>
		<ArmyCards army="Chaos" />
		<DefeatedUnits />
	</div>
</template>

<script>
import Logo from "~/components/Logo.vue";
import Board from "~/components/Board.vue";
import ArmyCards from "~/components/Army-Card.vue";
import TurnCards from "~/components/Turn-Cards.vue";
import CanonCards from "~/components/Canon-Cards.vue";
import SelectedUnit from "~/components/Selected-Unit.vue";
import AttackArea from "~/components/Attack-Area.vue";
import DefeatedUnits from "~/components/Defeated-Armies.vue";

import { mapGetters } from 'vuex';


export default {
	components: {
		Logo,
		Board,
		ArmyCards,
		TurnCards,
		SelectedUnit, 
		AttackArea, 
		DefeatedUnits,
		CanonCards
	},
	mounted: function() {
		!this.gameHasStarted && this.$router.push('/welcome');
	},
	computed: {
		...mapGetters([
			'allUnitsOnBoard', 
			'selectedUnit', 
			'getAttackModeStatus', 
			'gameHasStarted', 
			'getPlayingCards',
			'getOgreCards',
			'getCurrentCard'
		]),
		ogreTurn: function() {
			return this.allUnitsOnBoard && this.getCurrentCard.ids && this.getCurrentCard.ids.includes('grimorg');
		}, 
		canonTurn: function() {
			return this.allUnitsOnBoard && this.getCurrentCard.ids && this.getCurrentCard.ids.includes('canon');
		}
	}
};
</script>

<style>

.cards {
	background-color: white;
	display: block;
	width: 200px;
	min-height: 90px;
	border: 3px solid blue;
	padding: 15px;
	box-shadow: 5px -5px 0 -3px white, 5px -5px green, 10px -10px 0 -3px white,
		10px -10px yellow, 15px -15px 0 -3px white, 15px -15px orange,
		20px -20px 0 -3px white, 20px -20px red;
	transition: box-shadow 1s, top 1s, left 1s;
	position: relative;
	top: 0;
	left: 0;
	cursor: pointer;
}

</style>

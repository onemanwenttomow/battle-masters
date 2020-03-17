<template>
  <div class="outer-container">
      <ArmyCards :armies="setup.armies"/>
      <Board :board="setup.board">
      </Board>
  </div>
</template>

<script>
import Logo from "~/components/Logo.vue";
import Board from "~/components/Board.vue";
import ArmyCards from "~/components/Army-Card.vue";



export default {
  components: {
    Logo,
    Board,
    ArmyCards
  }, 
  data() {
    return {
      setup: {}
    }
  },
  async asyncData ({ $axios }) {
    const setup = await $axios.$get('/api/initial-board');
    // console.log('setup: ',setup);
    return { setup }
  },
  mounted: function() {
    console.log("index mounted")
  },
  methods: {
    selectCard: function() {
      console.log("selcted!", this.setup.armies[0].length)
      this.setup.armies[0].shift();
    }
  }
};
</script>

<style>
.outer-container {
  display: grid;
  grid-template-columns: 150px 9fr;
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
  box-shadow: 5px -5px 0 -3px white, 5px -5px green,
        10px -10px 0 -3px white, 10px -10px yellow, 
        15px -15px 0 -3px white, 15px -15px orange, 
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

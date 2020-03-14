<template>
    <div class="container">
        <div class="board">
            <fragment v-for="row in board">
                <div v-for="hex in row" class="hexagon" :class="hex"></div>

            </fragment>
        </div>
    </div>
</template>

<script>
export default {
   data() {
    return {
    }
  },
  props: ['board'],
  mounted: function() {
    console.log("board mounted!", this.board);
  }
}
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
    width: 1200px;
    overflow: hidden;
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


.road {
    background-color: #8e5a46;
}

.field {
    background-color: #76a828;
}

.river {
    background-color: #5babd5;
}

@media screen and (min-width: 320px) and (max-width: 667px) {

}
</style>
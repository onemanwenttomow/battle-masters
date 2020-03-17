<template>
    <div>
        <div 
            class="piece" 
            v-for="card in armies[0]"
            draggable="true"
            @dragstart="dragStart"
            @dragover.prevent
        ></div>
    </div>
</template>

<script>
export default {
   data() {
    return {
    }
  },
  props: ['armies'],
  mounted: function() {
    console.log("army card mounted!");
  },
  methods: {
    dragStart: function(e) {
        const target = e.target;
        console.log("drag start!", e)
        setTimeout(function(){
            target.style.display = "none";
        }, 0)
    }
  }
}
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
  background-color: #64C7CC;
  margin: 50px;
  background-image: url("/tile.png");

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
  border-bottom: 23.09px solid #64C7CC;
}

.piece:after {
  top: 100%;
  width: 0;
  border-top: 23.09px solid #64C7CC;
}

</style>
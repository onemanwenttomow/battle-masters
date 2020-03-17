<template>
    <div>
        <div 
            class="piece"
            :id="card.id"
            v-for="card in armies[0]"
            draggable="true"
            @dragstart="dragStart"
            @dragover.stop
            @dragend.prevent="dragEnd"
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
        e.dataTransfer.setData('id', e.target.id)
        console.log("drag start!", e, e.target.id)
        setTimeout(function(){
            target.style.opacity = 0.3;
        }, 0)
    },
    dragEnd: function(e) {
      console.log("drag end: ", e);
      e.target.style.opacity = 1;
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
  background-repeat: no-repeat;
  background-position: center;
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
  border-bottom: 23.09px solid #64C7CC;
}

.piece:after {
  top: 100%;
  width: 0;
  border-top: 23.09px solid #64C7CC;
}

</style>
<template>
    <div class="" v-if="!areExtraPiecesAddedToBoard">
        <div class="extra-cards-container">
            <div
                v-for="card in extraTiles"
                :key="card.id"
                :id="card.flipped ? card.back.id : card.front.id"
                class="extra-tile-flip-card"
                :class="[card.flipped ? 'extra-tile-flipped' : '']"
                :draggable="isDraggable"
                @dragstart.stop="dragStart"
            >
                <div class="flip-card-inner ">
                    <div
                        class="flip-card-front hexagon"
                        :class="card.front.type"
                        @click.stop="flip(card)"
                    ></div>
                    <div
                        class="flip-card-back hexagon"
                        :class="card.back.type"
                        @click.stop="flip(card)"
                    ></div>
                </div>
            </div>
        </div>
        <button @click="handleClick">
            Ready to start game
        </button>
    </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    computed: {
        ...mapGetters(["areExtraPiecesAddedToBoard", "getExtraTiles"])
    },
    data: function() {
        return {
            extraTiles: [],
            isDraggable: true
        };
    },
    mounted: function() {
        console.log("this.getExtraTiles: ", this.getExtraTiles);
        this.extraTiles = this.getExtraTiles;
    },
    methods: {
        flip: function(card) {
            card.flipped = !card.flipped;
            console.log("this.extraTiles: ", this.extraTiles);
        },
        handleClick: function() {
            this.$store.commit("allExtraPiecesAddedToBoard");
            this.isDraggable = false;
        },
        dragStart: function(e) {
            const target = e.target;
            e.dataTransfer.setData("id", e.target.id);
            setTimeout(function() {
                target.style.opacity = 0.3;
            }, 0);
        }
    }
};
</script>

<style>
.extra-cards-container {
    display: flex;
}

.extra-tile-flip-card {
    perspective: 1000px; /* Remove this if you don't want the 3D effect */
    width: 99px;
    height: 57.16px;
    margin: 75px 10px;
    position: relative;
}

.extra-tile-flipped .flip-card-inner {
    transform: rotateY(180deg);
}

.tower {
    background-color: grey;
}

.ditch {
    background-color: orange;
}

.ford {
    background-color: #8e5a46;
}

.marsh {
    background-color: seagreen;
}
</style>

<template>
    <div>
        <div class="welcome-container">
            <img src="/bm-logo.PNG" alt="battle masters logo" />
            <div class="nes-container is-rounded start-container inline">
                <img src="/main-image.PNG" alt="battle masters cover" />
                <div class="start-button-container">
                    <nuxt-link to="/">
                        <button class="nes-btn" @click="startGame">Play on 1 Machine</button>
                    </nuxt-link>
                    <button class="nes-btn" @click="$router.push(generateGameCode)">Play on 2 Machines</button>
                </div>
            </div>
           
        </div>
    </div>
</template>

<script>
export default {
    mounted: function() {
        console.log("check if room is free...");
        this.socket = this.$nuxtSocket({
			name: 'local',
			reconnection: true
        })
        this.socket.emit('check if room exists', {roomId: '', player: ''});
        this.socket.on('room', rooms => {
            rooms = Object.keys(rooms);
            console.log('rooms: ',rooms);
            if (rooms.length)  {
                let latestRoom = Number(rooms[rooms.length -1].slice(4))
                console.log('latestRoom: ',latestRoom);
                latestRoom++
                this.roomCode = "room" + latestRoom;
            }
        })

    },
    data: function() {
        return {
            roomCode: 'room1'
        }
    },
    computed: {
        generateGameCode() {
            return '/2p/' + this.roomCode;
            // return  "/2p/" + Math.random().toString(36).substring(2, 5).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();
        }
    },
    methods: {
        startGame: function() {
            this.$store.commit("startGame", {army: ''});
        }
    }
};
</script>

<style>

.start-button-container {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    margin: 2vw;
}
.welcome-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.start-container {
    display: flex;
}

.welcome-container img:first-child {
    width: 40vw;
}

.nes-container img:nth-child(1) {
    width: 30vw;
}
</style>

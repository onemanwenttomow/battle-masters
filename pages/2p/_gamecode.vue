<template>
    <div>
        <h1>Welcome to a 2 player, 2 computer game. First of all share the url below with the other player</h1>
        <h3 v-if="showCodeToCopy" @click="copySign" :class="[userCopied? 'user-copied' : '']">{{gameCode}}</h3>
        <h1>You are: {{player}} </h1>
    </div>
</template>

<script>
export default {
    mounted: function() {
        this.socket = this.$nuxtSocket({
			name: 'local',
			reconnection: true
		})
        console.log('this.$route: ',this.$route);
        this.socket.emit('check if room exists', {roomId: this.$route.params.gamecode});
        this.socket.on('room', rooms => {
            console.log('rooms: ',rooms);
            console.log('localStorage.getItem(): ',localStorage.getItem('player'));
            if (rooms[this.$route.params.gamecode]) {
                if (rooms[this.$route.params.gamecode].player2) {
                    this.showCodeToCopy = false
                    localStorage.setItem('player', 'player2')
                } else {
                    localStorage.setItem('player', 'player1')
                }
            } else {
                localStorage.removeItem('player')
            }
        })
    },
    computed: {
        gameCode: function() {
            return this.$route.params.gamecode;
        }
    },
    data: function() {
        return {
            userCopied: false,
            showCodeToCopy: true, 
            player: ''
        }
    },
    methods: {
        copySign() {
            navigator.clipboard.writeText(location.href);
            this.userCopied = true;
            this.socket.emit('new room', {roomId: this.$route.params.gamecode});
        }, 
        getPlayer: function() {
            // console.log('localStorage.getItem();: ',localStorage.getItem('player'));
            this.player = localStorage.getItem('player')
        }
    }
};
</script>

<style>

.user-copied {
    background-color: green;
}

</style>

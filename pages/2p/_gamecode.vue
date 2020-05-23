<template>
    <div>
        <h1 v-if="showCodeToCopy">Welcome to a 2 player, 2 computer game. First of all share the url below with the other player</h1>
        <h3 v-if="showCodeToCopy" @click="copySign" :class="[userCopied? 'user-copied' : '']">{{gameCode}}</h3>
        <h1>You are: {{player}} </h1>
        <transition name="fade">
            <div v-if="showCodeToCopy && userCopied">
                <p>Waiting for player 2 to join...</p>
                <Spinner />
            </div>
        </transition>
        <transition name="fade">
            <h3 v-if="!showCodeToCopy">
                Pick either 
                <span @click="togglePlayerChoice('imperialArmy')" :class="imperialArmy">Imperial</span> or 
                <span @click="togglePlayerChoice('chaosArmy')" :class="chaosArmy">Chaos</span>
            </h3>
        </transition>
    </div>
</template>




<script>
import Spinner from "~/components/Spinner.vue";

export default {
    components: {
		Spinner
	},
	
    mounted: function() {
        this.socket = this.$nuxtSocket({
			name: 'local',
			reconnection: true
		})
        console.log('this.$route: ',this.$route);

        this.socket.on('army chosen', ({imperialArmy, chaosArmy, player}) => {
            this.imperialArmy= imperialArmy;
            this.chaosArmy = chaosArmy;
        });

        this.socket.on('player2 joined', () => {
            console.log("player 2 joined!!!")
            this.showCodeToCopy = false;
        })

        this.player = localStorage.getItem('player')
        this.socket.emit('check if room exists', {roomId: this.$route.params.gamecode, player:localStorage.getItem('player')});
        this.socket.on('room', rooms => {
            console.log('rooms: ',rooms);
            console.log('localStorage.getItem(): ',localStorage.getItem('player'));
            console.log('this.player: ',this.player);
            if (rooms[this.$route.params.gamecode]) {
                if (rooms[this.$route.params.gamecode].player2) {
                    this.showCodeToCopy = false
                    localStorage.setItem('player', 'player2')
                    this.player = 'player2'
                } else {
                    localStorage.setItem('player', 'player1')
                    this.player = 'player1'
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
            player: '',
            imperialArmy: '',
            chaosArmy: '',
        }
    },
    methods: {
        togglePlayerChoice(army) {
            console.log('this.player: ',this.player);
            if (this.player === 'player1' && this[army] === 'player2') {
                return;
            }
            if (this.player === 'player2' && this[army] === 'player1') {
                return;
            }
            army === 'imperialArmy' ? 
                this.chaosArmy = '':
                this.imperialArmy = '';
            

            console.log('army: ',army);
            this[army] === this.player ? this[army] = '' : this[army] = this.player;
            console.log('this[army]: ',this[army]);
            this.socket.emit('chosen army', {
                imperialArmy: this.imperialArmy, 
                chaosArmy: this.chaosArmy,
                player: this.player,
                roomId: this.$route.params.gamecode
            });
            
        },
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

.player1 {
    background-color: hotpink;
}

.player2 {
    background-color: navy;
}

.user-copied {
    background-color: green;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

</style>

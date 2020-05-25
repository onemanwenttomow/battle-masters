<template>
    <div class="centered-container">
        <div class="nes-container is-centered with-title inline">
            <h1 class="title">Welcome to a 2 player, 2 computer game</h1>
            <h2 class="title-50" v-if="showCodeToCopy">First of all share the url below with the other player</h2>
            
            <div v-if="showCodeToCopy">
                <div class="nes-container is-dark inline">
                    <code :class="[userCopied? 'user-copied' : '']">{{gameCode}}</code>
                </div>

                <div class="btn-container">
                    <div class="nes-balloon from-left code-copied-balloon" :class="[userCopied? '' : 'hide']">
                        Code copied
                    </div>
                    <button @click="copySign" class="nes-btn copycode">Copy code</button>
                </div>
            </div>
            <h1>You are:</h1>
            <div class="nes-badge">
                <span :class="player">{{player}}</span>
            </div>
            <transition name="fade">
                <div v-if="showWaiting">
                    <p>Waiting for player 2 to join...</p>
                    <Spinner />
                </div>
            </transition>
            <transition name="fade">
                <div v-if="!showCodeToCopy" class="army-choice-container">
                    <h3>Pick either </h3>
                    <button @click="togglePlayerChoice('imperialArmy')" class="nes-btn" :class="imperialArmy">Imperial</button> or 
                    <button @click="togglePlayerChoice('chaosArmy')" class="nes-btn" :class="chaosArmy">Chaos</button>
                </div>
            </transition>
            <div>
                <nuxt-link to="/">
                        <button class="nes-btn" @click="startGame" :disabled="!imperialArmy || !chaosArmy">Start Game</button>
                </nuxt-link>

            </div>
        </div>

    </div>
    
</template>




<script>
import Spinner from "~/components/Spinner.vue";

export default {
    components: {
		Spinner
    },
     data: function() {
        return {
            userCopied: false,
            showCodeToCopy: true, 
            showWaiting: false,
            player: '',
            imperialArmy: '',
            chaosArmy: '',
        }
    },
    mounted: function() {
        this.socket = this.$nuxtSocket({
			name: 'heroku',
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
            this.showWaiting = false;
        })

        this.player = localStorage.getItem('player')
        this.socket.emit('check if room exists', {roomId: this.$route.params.gamecode, player:localStorage.getItem('player')});
        this.socket.on('room', rooms => {
            console.log('rooms: ',rooms);
            console.log('localStorage.getItem(): ',localStorage.getItem('player'));
            console.log('this.player: ',this.player);
            console.log("*********", rooms[this.$route.params.gamecode])
            if (rooms[this.$route.params.gamecode]) {
                if (rooms[this.$route.params.gamecode].player2) {
                    this.showCodeToCopy = false;
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
    methods: {
        startGame: function() {
            this.$store.commit("startGame");
        },
        togglePlayerChoice(army) {
            console.log('this.player: ',this.player);
            if (this.player === 'player1' && this[army] === 'player2') {
                return;
            }
            if (this.player === 'player2' && this[army] === 'player1') {
                return;
            }
            
            if (army === 'imperialArmy' && this.chaosArmy === this.player) {
                this.chaosArmy = '';
            }

            if (army === 'chaosArmy' && this.imperialArmy === this.player) {
                this.imperialArmy = '';
            }

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
            this.showWaiting = true;
            setTimeout(() => {
                this.userCopied = false;
            }, 1000)
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

.army-choice-container {
    margin-bottom: 0.5rem;
}

.title-50 {
    width: 50vw;
}

.inline {
    display: inline-block;
}

.centered-container {
    padding: 0 2rem;
    margin: 2rem 2rem;
    display: flex;
    justify-content: center;
}

.nes-badge .player1 {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    color: #fff;
    text-align: center;
    background-color: #209cee;
    box-shadow: 0 0.5em #209cee, 0 -0.5em #209cee, 0.5em 0 #209cee, -0.5em 0 #209cee;
}

.nes-badge .player2 {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    color: #fff;
    text-align: center;
    box-shadow: 0 0.5em #92cc41, 0 -0.5em #92cc41, 0.5em 0 #92cc41, -0.5em 0 #92cc41;
}

.player1, .player1:hover {
    background-color: #209cee;
}

.player2, .player2:hover {
    background-color: #92cc41;
}

.hide {
    display: none;
}

.btn-container {
    position: relative;
}

.user-copied {
    background-color: green;
}

.code-copied-balloon {
    position: absolute;
    top: -86px;
    right: 72px;
}

button:disabled {
    color: #212529;
    cursor: not-allowed;
    background-color: #d3d3d3;
    box-shadow: inset -4px -4px #adafbc;
    opacity: .6;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

</style>

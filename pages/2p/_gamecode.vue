<template>
    <div>
        <h1>Welcome to a 2 player, 2 computer game. First of all share the url below with the other player</h1>
        <h3 @click="copySign" :class="[userCopied? 'user-copied' : '']">{{gameCode}}</h3>
    </div>
</template>

<script>
export default {
    mounted: function() {
        console.log('this.$route: ',this.$route);
    },
    computed: {
        gameCode: function() {
            return this.$route.params.gamecode;
        }
    },
    data: function() {
        return {
            userCopied: false
        }
    },
    methods: {
        copySign() {
            navigator.clipboard.writeText(location.href);
            this.userCopied = true;
        }
    }
};
</script>

<style>

.user-copied {
    background-color: green;
}

</style>

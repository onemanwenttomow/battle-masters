<template>
    <div>
        <nuxt-link to="/" >
            <div class="welcome-container" @click="startGame">
                <img src="/bm-logo.PNG" alt="battle masters logo">
                <img src="/main-image.PNG" alt="battle masters cover"> 
            </div>
        </nuxt-link>
        
    </div>
</template>

<script>

export default {
	methods: {
        startGame: function() {
            this.$store.commit('startGame');
        }
    }
};
</script>

<style>

.welcome-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.welcome-container img:first-child{
    width: 50vw;
}

.welcome-container img:last-child{
    width: 30vw;
}


</style>

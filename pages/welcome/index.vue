<template>
    <a href="/">
        <div class="welcome-container">
            <img src="/bm-logo.PNG" alt="battle masters logo">
            <img src="/main-image.PNG" alt="battle masters cover"> 
        </div>
    </a>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	computed: mapGetters([
        
    ]),
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

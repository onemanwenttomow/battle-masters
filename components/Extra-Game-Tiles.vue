<template>
	<div >
        <h1>Extra Tiles!</h1>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	computed: mapGetters([
        'selectedUnit', 'getCurrentCard'
    ]),
};
</script>

<style>

</style>

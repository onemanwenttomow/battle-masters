import Vuex from "vuex";
import axios from "axios";

const createStore = () => {
  return new Vuex.Store({
    state: {
        armies: []
    },
    mutations: {
        setupArmies(state, {armies}) {
            state.armies = armies;
        }
    },
    actions: {
        async nuxtServerInit({ commit, dispatch }) {
            await dispatch('storeDispatchFunc')
        },
        async storeDispatchFunc({ commit }) {
            const { data } = await this.$axios.get('/api/initial-board')
            console.log("data", data)
            commit('setupArmies', data)
        },
    },
    getters: {}
  });
};

export default createStore;

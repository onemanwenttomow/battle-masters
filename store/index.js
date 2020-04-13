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
        // async nuxtServerInit(vuexContext, Context) {
        //     let data = await axios.get("/api/initial-board");
        //     console.log('data in actions: ',data);
        // }
    },
    getters: {}
  });
};

export default createStore;

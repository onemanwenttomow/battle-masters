import Vuex from "vuex";

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
    actions: {},
    getters: {}
  });
};

export default createStore;

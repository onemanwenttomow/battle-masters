import Vuex from "vuex";

const createStore = () => {
  return new Vuex.Store({
    state: {
        armies: []
    },
    mutations: {
        setupArmies(state, armies) {
            state.armies = armies;
        }
    },
    actions: {
        async nuxtServerInit({ commit, dispatch }) {
            await dispatch('storeDispatchFunc')
        },
        async storeDispatchFunc({ commit }) {
            const { data } = await this.$axios.get('/api/initial-board');
            const armies = data.armies.map(unit => {
                return {
                    ...unit,
                    onBoard: false,
                    isSelected: false,
                    hasMoved: false,
                    hasAttacked: false,
                    finishedMove: false,
                    canBeAttacked: false,
                    remainingLives: 3,
                    boardPosition: []
                }
            })
            commit('setupArmies', armies);
        },
    },
    getters: {
        getArmy: (state) => (army) => {
            return state.armies.filter(unit => unit.army === army);
        }, 
        getOpposingArmy: (state) => (army) => {
            return state.armies.filter(unit => unit.army !== army);
        },
        allUnitsOnBoard: (state) => {
            return state.armies.filter(unit => unit.onBoard).length === state.armies.length;
        }
    }
  });
};

export default createStore;

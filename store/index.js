import Vuex from "vuex";

const createStore = () => {
  return new Vuex.Store({
    state: {
        armies: [], 
        mainPlayingCards: [],
        board: []
    },
    mutations: {
        userSelected(state, {id}) {
            state.armies = state.armies.map(unit => {
                return {
                    ...unit,
                    userSelected: unit.id === id
                }  
            })
        },
        setupAllPieces(state, { armies, mainPlayingCards, board}) {
            state.armies = armies;
            state.mainPlayingCards = mainPlayingCards;
            state.board = board;
        },
        updateUnitPosition(state, payload) {
            state.armies = state.armies.map(unit => {
                if (unit.id === payload.id) {
                    return {
                        ...unit,
                        onBoard: true,
                        boardPosition: [payload.positions]
                    }
                } else {
                    return unit
                }
            })
        }
    },
    actions: {
        async nuxtServerInit({ dispatch }) {
            await dispatch('storeDispatchFunc')
        },
        async storeDispatchFunc({ commit }) {
            const { data } = await this.$axios.get('/api/initial-board');
            const mainPlayingCards = data.mainPlayingCards;
            const board = data.board;
            const armies = data.armies.map(unit => {
                return {
                    ...unit,
                    onBoard: false,
                    isSelected: false,
                    userSelected: false,
                    hasMoved: false,
                    hasAttacked: false,
                    finishedMove: false,
                    canBeAttacked: false,
                    remainingLives: 3,
                    boardPosition: []
                }
            })
            commit('setupAllPieces', {armies, mainPlayingCards, board});
        },
    },
    getters: {
        getArmy: (state) => (army) => {
            return state.armies.filter(unit => unit.army === army);
        }, 
        getPlayingCards: (state) => {
            return state.mainPlayingCards;
        },
        getBoard: (state) => {
            return state.board;
        },
        getOpposingArmy: (state) => (army) => {
            return state.armies.filter(unit => unit.army !== army);
        },
        getPieceById: (state) => (id) => {
            return state.armies.filter(unit => unit.id === id);
        },
        allUnitsOnBoard: (state) => {
            return state.armies.filter(unit => unit.onBoard).length === state.armies.length;
        },
        selectedUnit: (state) => {
            return state.armies.find(unit => unit.userSelected);
        }
    }
  });
};

export default createStore;

import Vuex from "vuex";

const createStore = () => {
  return new Vuex.Store({
    state: {
        armies: [], 
        mainPlayingCards: [],
        board: []
    },
    mutations: {
        currentCard(state, {card}) {
            state.armies = state.armies.map(unit => {
                return {
					...unit,
                    isSelected: card.ids.includes(unit.id),
                    finishedTurn: false,
                    hasMoved: false
				}
            })
        },
        finishMove(state, {id}) {
            state.armies = state.armies.map(unit => {
                if (unit.id === id) {
                    return {
                        ...unit,
                        hasMoved: true
                    }
                } else {
                    return {
                        ...unit
                    }
                }
                
            })
        },
        finishTurn(state, {id}) {
            state.armies = state.armies.map(unit => {
                return {
					...unit,
                    finishedTurn: unit.id === id
				}
            })
        },
        userSelected(state, {id}) {
            state.armies = state.armies.map(unit => {
                return {
                    ...unit,
                    userSelected: unit.id === id
                }  
            })
        },
        showPossibleMoves(state, {id, moves}) {
            state.armies = state.armies.map(unit => {
                if (unit.id === id) {
                    return {
                        ...unit,
                        showPossibleMoves: moves
                    }  
                } else {
                    return {
                        ...unit,
                        showPossibleMoves: []
                    }
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
                    showPossibleMoves: [],
                    hasMoved: false,
                    hasAttacked: false,
                    finishedTurn: false,
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
        },
        getPossibleMoves: (state) => {
            if (!state.armies.find(unit => unit.showPossibleMoves.length)) {
                return []
            } else {
                return state.armies.filter(unit => unit.showPossibleMoves.length)[0].showPossibleMoves;
            }
        },
        checkIfUnitsInReach: (state, {getPieceById, getOpposingArmy}) => (id) => {
            console.log('id: ',id, getPieceById);
            console.log('getters: ', getPieceById(id).army);
            const unitToCheck = getPieceById(id);
            const army = unitToCheck[0].army;
            console.log('army: ',army);
            const opposingArmy = getOpposingArmy(army);
            console.log('opposingArmy: ',opposingArmy);
            console.log('unitToCheck: ',unitToCheck);
            console.log('unitToCheck.showPossibleMoves: ',unitToCheck[0].showPossibleMoves);

            const enemiesInReach = opposingArmy.filter(unit => {
				let matchingTiles = unitToCheck[0].showPossibleMoves.filter(tile => {
					return tile[0].row === unit.boardPosition[0].row && tile[0].col === unit.boardPosition[0].col
				});
				if (matchingTiles.length) {
					return matchingTiles
				}
            });
            console.log('enemiesInReach: ',enemiesInReach);
            return enemiesInReach;
        }
    }
  });
};

export default createStore;

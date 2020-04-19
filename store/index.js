import Vuex from "vuex";

const createStore = () => {
  return new Vuex.Store({
    state: {
        armies: [], 
        mainPlayingCards: [],
        board: [], 
        unitThatCanAttack: {},
        unitUnderAttack: {},
        attackModeOpen: false
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
        battleOver(state, {damageDealt}) {
            state.attackModeOpen = false;
            state.armies = state.armies.map(unit => {
                if (unit.id === state.unitUnderAttack[0].id) {
                    return {
                        ...unit, 
                        remainingLives:unit.remainingLives - damageDealt
                    }
                } else {
                    return {
                        ...unit
                    }
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
        canBeAttacked(state, {unit, unitsInReach}) {
            state.armies = state.armies.map(unit => {
				return {
					...unit, 
					canBeAttacked: unitsInReach.some(u => u.id == unit.id),
                }
            });
            state.unitThatCanAttack = unit;
        },
        startAttack(state, {unitUnderAttack}) {
            state.unitUnderAttack = unitUnderAttack;
            state.attackModeOpen = true;
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
        getAttackModeStatus: (state) => {
            return state.attackModeOpen;
        },
        getPieceById: (state) => (id) => {
            return state.armies.filter(unit => unit.id === id);
        },
        getUnitThatCanAttack: (state) => {
            return state.unitThatCanAttack;
        },
        getUnitUnderAttack: (state) => {
            return state.unitUnderAttack;
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
        getSurroundingTiles: (state, {getPieceById}) => (id) => {
            const unitToCheck = getPieceById(id)[0].boardPosition[0];
            let surroundingTiles;
			unitToCheck.row % 2 === 0 ? 
				surroundingTiles = [[-1, 1], [-1, 0], [0, -1], [0, 1], [1, 1], [1, 0]] :
				surroundingTiles = [[-1,-1], [-1, 0], [0, -1], [0, 1], [1, -1], [1, 0]]
			const calculatedSurroundingTiles = surroundingTiles.map(tile => {
				return [tile[0] + unitToCheck.row, tile[1] + unitToCheck.col]
            });
            return calculatedSurroundingTiles;
        },
        checkIfUnitsInReach: (state, {getPieceById, getOpposingArmy, getSurroundingTiles}) => (id) => {
            const unitToCheck = getPieceById(id);
            const army = unitToCheck[0].army;
            const opposingArmy = getOpposingArmy(army);
            const surroundingTiles = getSurroundingTiles(id);
            const enemiesInReach = opposingArmy.filter(unit => {
				let matchingTiles = surroundingTiles.filter(tile => {
					return tile[0] === unit.boardPosition[0].row && tile[1] === unit.boardPosition[0].col
				});
				if (matchingTiles.length) {
					return matchingTiles
				}
            });
            return enemiesInReach;
        }
    }
  });
};

export default createStore;

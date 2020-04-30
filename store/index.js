import Vuex from "vuex";

const createStore = () => {
  return new Vuex.Store({
    state: {
        gameStarted: false,
        armies: [], 
        mainPlayingCards: [],
        ogrePlayingCards: [],
        board: [], 
        unitThatCanAttack: {},
        unitUnderAttack: {},
        attackModeOpen: false, 
        currentCard: {},
        currentOgreCard: {
            type: 'none',
            img: 'none',
            cardUsed: false
        },
        numberOfOgreCardsLeft: 6
    },
    mutations: {
        startGame(state) {
            state.gameStarted = true;
        },
        currentCard(state, {card}) {
            state.currentCard = card;
            state.armies = state.armies.map(unit => {
                return {
					...unit,
                    isSelected: card.ids.includes(unit.id),
                    finishedTurn: false,
                    hasMoved: false
				}
            })
        },
        currentOgreCard(state, {card, numberOfOgreCardsLeft}) {
            state.armies = state.armies.map(unit => {
                if (unit.id === 'grimorg') {
                    return {
                        ...unit,
                        hasMoved: false
                    }
                } else {
                    return {
                        ...unit
                    }
                }  
            })
            state.numberOfOgreCardsLeft = numberOfOgreCardsLeft;
            state.currentOgreCard = card;
        },
        finishMove(state, {id}) {
            if (id === 'grimorg') {
                state.currentOgreCard.cardUsed = true;
            } else {
                state.armies = state.armies.map(unit => {
                    if (unit.id === id) {
                        return {
                            ...unit,
                            hasMoved: true, 
                            showPossibleMoves: []
                        }
                    } else {
                        return {
                            ...unit
                        }
                    }  
                })
            }
            
        },
        finishTurn(state, {id, canOgreStillMove}) {
            state.armies = state.armies.map(unit => {
                if (unit.id === id) {
                    return {
                        ...unit,
                        finishedTurn: true
                    }
                } else {
                    return {
                        ...unit,
                        canBeAttacked: false
                    }
                }
            });
            if (canOgreStillMove) {
                state.armies = state.armies.map(unit => {
                    return {
                        ...unit,
                        hasMoved: true, 
                        finishedTurn: false
                    }
                })
            }
        },
        battleOver(state, {damageDealt}) {
            if (state.unitUnderAttack[0].id === 'grimorg') {
                for (let i = 0; i < damageDealt; i++) {
                    const randomCard = Math.floor(Math.random() * state.ogrePlayingCards.length);
                    state.ogrePlayingCards.splice(randomCard, 1);
                }
            }
            state.attackModeOpen = false;
            state.armies = state.armies.map(unit => {
                if (unit.id === state.unitUnderAttack[0].id) {
                    return {
                        ...unit, 
                        remainingLives:unit.remainingLives - damageDealt,
                        canBeAttacked: false
                    }
                } else if (unit.id === state.unitThatCanAttack[0].id) {
                    return {
                        ...unit, 
                        hasMoved: true,
                        hasAttacked: true,
                        finishedTurn: unit.id === 'grimorg'? false: true,
                        showPossibleMoves: []
                    }
                } else {
                    return {
                        ...unit, 
                        canBeAttacked: false
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
                if (unit.id === id && !unit.finishedTurn) {
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
        setupAllPieces(state, { armies, mainPlayingCards, board, ogrePlayingCards}) {
            state.armies = armies;
            state.mainPlayingCards = mainPlayingCards;
            state.board = board;
            state.ogrePlayingCards = ogrePlayingCards;
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
            const ogrePlayingCards= data.ogrePlayingCards;
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
                    remainingLives: unit.special === 'ogre' ? ogrePlayingCards.length : 3,
                    boardPosition: []
                }
            })
            commit('setupAllPieces', {armies, mainPlayingCards, board, ogrePlayingCards});
        },
    },
    getters: {
        gameHasStarted: (state) => {
            return state.gameStarted;
        },
        getArmy: (state) => (army) => {
            return state.armies.filter(unit => unit.army === army && unit.remainingLives > 0);
        },
        getDefeatedUnits: (state) => {
            return state.armies.filter(unit => unit.remainingLives <= 0);
        }, 
        getPlayingCards: (state) => {
            return state.mainPlayingCards;
        },
        getOgreCards: (state) =>  {
            return state.ogrePlayingCards;
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
        getCurrentCard: (state) => {
            return state.currentCard;
        },
        getCurrentOgreCard: (state) => {
            return state.currentOgreCard;
        },
        getNumOfRemainingOgreCards: (state) => {
            return state.numberOfOgreCardsLeft;
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
        getSurroundingTiles: (state, {getPieceById, getCurrentCard}) => (id, checkingFor) => {
            const unitToCheck = getPieceById(id)[0];
            const unitRow = unitToCheck.boardPosition[0].row;
            const unitCol = unitToCheck.boardPosition[0].col;
            const currentCard = getCurrentCard.ids || [];
            const unitIsArcher = unitToCheck.special === 'archer' || unitToCheck.special === 'crossbow';
            const checkDoubleTiles = unitIsArcher && checkingFor === "attacking";
            if (checkDoubleTiles || currentCard.includes('movetwice') && checkingFor !== "attacking") {
                unitRow % 2 === 0 ? 
                    surroundingTiles = [
                        [-2, -1], [-2, 0], [-2, 1],
                        [-1,-1], [-1, 0], [-1, 1], [-1, 2], 
                        [0, -2], [0, -1], [0, 1], [0, 2], 
                        [1,-1], [1, 0], [1, 1], [1, 2], 
                        [2, -1], [2, 0], [2, 1]
                    ] :
                    surroundingTiles = [
                        [-2, -1], [-2, 0], [-2, 1],
                        [-1,-2], [-1,-1], [-1, 0], [-1, 1], 
                        [0,-2], [0, -1], [0, 1], [0, 2], 
                        [1, -2], [1, -1], [1, 0], [1, 1],
                        [2, -1], [2, 0], [2, 1]
                    ]
            } else {
                unitRow % 2 === 0 ? 
                    surroundingTiles = [
                        [-1, 1], [-1, 0], 
                        [0, -1], [0, 1], 
                        [1, 1], [1, 0]
                    ] :
                    surroundingTiles = [
                        [-1,-1], [-1, 0], 
                        [0, -1], [0, 1], 
                        [1, -1], [1, 0]
                    ]
            }
            let surroundingTiles;
			const calculatedSurroundingTiles = surroundingTiles.map(tile => {
				return [tile[0] + unitRow, tile[1] + unitCol]
            });
            return calculatedSurroundingTiles;
        },
        checkIfUnitsInReach: (state, {getPieceById, getOpposingArmy, getSurroundingTiles}) => (id) => {
            const unitToCheck = getPieceById(id);
            const army = unitToCheck[0].army;
            const opposingArmy = getOpposingArmy(army);
            const surroundingTiles = getSurroundingTiles(id, 'attacking');
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

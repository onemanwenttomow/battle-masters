import Vuex from "vuex";
import {Hex, OffsetCoord} from '../api/hex-helpers';

const createStore = () => {
  return new Vuex.Store({
    state: {
        gameStarted: false,
        armies: [], 
        mainPlayingCards: [],
        ogrePlayingCards: [],
        canonPlayingCards: [],
        canonCardsOnBoard: [],
        canonPath: [],
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
        pieceUserDragging: {},
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
        pieceUserDragging(state, {id}) {
            console.log('id: ',id);
            if (id) {
                state.pieceUserDragging = state.armies.filter(unit => unit.id === id)[0];
            } else {
                state.pieceUserDragging = {}
            }
        },
        droppedCanonCardOnBoard(state, payload) {
            if (payload.id === "canon-target") {
                const canon = state.armies.filter(unit => unit.id === "canon")[0].boardPosition[0];
                const unitUnderTarget = state.armies.filter(unit => unit.id === payload.unitUnder)[0].boardPosition[0];
                let oddOrEven;
                canon.row % 2 === 0 ? oddOrEven = -1 : oddOrEven = 1;
                let unitUnderOddOrEven;
                unitUnderTarget.row % 2 === 0 ? unitUnderOddOrEven = -1 : unitUnderOddOrEven = 1;
                const canonCube =  new OffsetCoord.roffsetToCube(oddOrEven, {col: canon.col, row: canon.row});
                const unitUnderTargetCube =  new OffsetCoord.roffsetToCube(unitUnderOddOrEven, {col: unitUnderTarget.col, row: unitUnderTarget.row});
                const cubePath = canonCube.linedraw(unitUnderTargetCube);
                const offSetPath = cubePath.map(c => new OffsetCoord.roffsetFromCube(1, c));
                offSetPath.pop();
                offSetPath.shift();
                state.canonPath = offSetPath;
                const filteredCards = state.canonCardsOnBoard.filter(card => card.id != "canon-target");
                console.log('filterdCards: ',filteredCards);
                state.canonCardsOnBoard = filteredCards;
            }
            state.canonCardsOnBoard.push(payload);
            
        },
        resetCanon(state) {
            state.canonCardsOnBoard = [];
            state.canonPath = [];
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
        dealDamage(state, {id, damageDealt}) {
            console.log('id, damageDealt: ',id, damageDealt);
            state.armies = state.armies.map(unit => {
                if (unit.id === id) {
                    return {
                        ...unit,
                        remainingLives:unit.remainingLives - damageDealt,
                    }
                } else {
                    return unit
                }
            });
            
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
        setupAllPieces(state, { armies, mainPlayingCards, board, ogrePlayingCards, canonPlayingCards}) {
            state.armies = armies;
            state.mainPlayingCards = mainPlayingCards;
            state.board = board;
            state.ogrePlayingCards = ogrePlayingCards;
            state.canonPlayingCards = canonPlayingCards;
        },
        shuffle(state, {cards}) {
            var j, x, i;
			for (i = cards.length - 1; i > 0; i--) {
				j = Math.floor(Math.random() * (i + 1));
				x = cards[i];
				cards[i] = cards[j];
				cards[j] = x;
            }
            state.canonPlayingCards = cards;
        },
        updateUnitPosition(state, payload) {
            console.log("payload.postitions: ", payload.positions);
            let oddOrEven;
            payload.positions.row % 2 === 0 ? oddOrEven = -1 : oddOrEven = 1;
            const cube = new OffsetCoord.roffsetToCube(oddOrEven, {col: payload.positions.col, row: payload.positions.row});
            const cube2 = new OffsetCoord.roffsetToCube(oddOrEven, {col: 2, row: 2});
            // console.log('cube2: ',cube2);
            console.log('cube: ',cube.linedraw(cube2));
            const cubePath = cube.linedraw(cube2);
            const offSetPath = cubePath.map(c => new OffsetCoord.roffsetFromCube(oddOrEven, c));
            offSetPath.pop();
            offSetPath.shift();
            console.log('path: ',cubePath);
            console.log('offSetPath: ',offSetPath);
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
            const canonPlayingCards= data.canonPlayingCards;
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
            commit('setupAllPieces', {armies, mainPlayingCards, board, ogrePlayingCards, canonPlayingCards});
        },
    },
    getters: {
        gameHasStarted: (state) => {
            return state.gameStarted;
        },
        getArmy: (state) => (army) => {
            return state.armies.filter(unit => unit.army === army && unit.remainingLives > 0);
        },
        getPieceUserDragging: (state) => {
            return state.pieceUserDragging;
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
        getCanonCards: (state) =>  {
            return state.canonPlayingCards;
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
        getCanonCardsOnBoard: (state) => {
            return state.canonCardsOnBoard;
        },
        getCanonPath: (state) => {
            return state.canonPath;
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

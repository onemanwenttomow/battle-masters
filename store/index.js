import Vuex from "vuex";
import { Hex, OffsetCoord } from "~/static/hex-helpers.js";

const createStore = () => {
    return new Vuex.Store({
        state: {
            gameStarted: false,
            extraPiecesAddedToBoard: false,
            armies: [],
            mainPlayingCards: [],
            ogrePlayingCards: [],
            canonPlayingCards: [],
            canonCardsOnBoard: [],
            extraTiles: [],
            canonPath: [],
            board: [],
            boardPositionsAsCubes: [],
            unitThatCanAttack:  {},
            unitUnderAttack: {},
            attackModeOpen: false,
            currentCard: {},
            currentOgreCard: {
                type: "none",
                img: "none",
                cardUsed: false
            },
            pieceUserDragging: {},
            numberOfOgreCardsLeft: 6
        },
        mutations: {
            startGame(state) {
                state.gameStarted = true;
            },
            currentCard(state, { card }) {
                state.currentCard = card;
                state.armies = state.armies.map(unit => {
                    return {
                        ...unit,
                        isSelected: card.ids.includes(unit.id),
                        finishedTurn: false,
                        hasMoved: false
                    };
                });
            },
            pieceUserDragging(state, { id }) {
                console.log("id: ", id);
                if (id) {
                    state.pieceUserDragging = state.armies.filter(
                        unit => unit.id === id
                    )[0];
                } else {
                    state.pieceUserDragging = {};
                }
            },
            allExtraPiecesAddedToBoard(state) {
                state.extraPiecesAddedToBoard = true;
            },
            droppedCanonCardOnBoard(state, payload) {
                if (payload.id === "canon-target") {
                    const canon = state.armies.filter(
                        unit => unit.id === "canon"
                    )[0].boardPosition[0];
                    const unitUnderTarget = state.armies.filter(
                        unit => unit.id === payload.unitUnder
                    )[0].boardPosition[0];
                    let oddOrEven;
                    canon.row % 2 === 0 ? (oddOrEven = -1) : (oddOrEven = 1);
                    let unitUnderOddOrEven;
                    unitUnderTarget.row % 2 === 0
                        ? (unitUnderOddOrEven = -1)
                        : (unitUnderOddOrEven = 1);
                    const canonCube = new OffsetCoord.roffsetToCube(oddOrEven, {
                        col: canon.col,
                        row: canon.row
                    });
                    const unitUnderTargetCube = new OffsetCoord.roffsetToCube(
                        unitUnderOddOrEven,
                        { col: unitUnderTarget.col, row: unitUnderTarget.row }
                    );
                    const cubePath = canonCube.linedraw(unitUnderTargetCube);
                    const offSetPath = cubePath.map(
                        c => new OffsetCoord.roffsetFromCube(1, c)
                    );
                    offSetPath.pop();
                    offSetPath.shift();
                    state.canonPath = offSetPath;
                    const filteredCards = state.canonCardsOnBoard.filter(
                        card => card.id != "canon-target"
                    );
                    state.canonCardsOnBoard = filteredCards;
                }
                state.canonCardsOnBoard.push(payload);
            },
            resetCanon(state) {
                state.canonCardsOnBoard = [];
                state.canonPath = [];
            },
            currentOgreCard(state, { card, numberOfOgreCardsLeft }) {
                state.armies = state.armies.map(unit => {
                    if (unit.id === "grimorg") {
                        return {
                            ...unit,
                            hasMoved: false
                        };
                    } else {
                        return {
                            ...unit
                        };
                    }
                });
                state.numberOfOgreCardsLeft = numberOfOgreCardsLeft;
                state.currentOgreCard = card;
            },
            finishMove(state, { id }) {
                if (id === "grimorg") {
                    state.currentOgreCard.cardUsed = true;
                } else {
                    state.armies = state.armies.map(unit => {
                        if (unit.id === id) {
                            return {
                                ...unit,
                                hasMoved: true,
                                showPossibleMoves: []
                            };
                        } else {
                            return {
                                ...unit
                            };
                        }
                    });
                }
            },
            finishTurn(state, { id, canOgreStillMove }) {
                state.armies = state.armies.map(unit => {
                    if (unit.id === id) {
                        return {
                            ...unit,
                            finishedTurn: true
                        };
                    } else {
                        return {
                            ...unit,
                            canBeAttacked: false
                        };
                    }
                });
                if (canOgreStillMove) {
                    state.armies = state.armies.map(unit => {
                        return {
                            ...unit,
                            hasMoved: true,
                            finishedTurn: false
                        };
                    });
                }
            },
            dealDamage(state, { id, damageDealt }) {
                console.log("id, damageDealt: ", id, damageDealt);
                state.armies = state.armies.map(unit => {
                    if (unit.id === id) {
                        return {
                            ...unit,
                            remainingLives: unit.remainingLives - damageDealt
                        };
                    } else {
                        return unit;
                    }
                });
            },
            battleOver(state, { damageDealt }) {
                if (state.unitUnderAttack[0].id === "grimorg") {
                    for (let i = 0; i < damageDealt; i++) {
                        const randomCard = Math.floor(
                            Math.random() * state.ogrePlayingCards.length
                        );
                        state.ogrePlayingCards.splice(randomCard, 1);
                    }
                }
                state.attackModeOpen = false;
                state.armies = state.armies.map(unit => {
                    if (unit.id === state.unitUnderAttack[0].id) {
                        return {
                            ...unit,
                            remainingLives: unit.remainingLives - damageDealt,
                            canBeAttacked: false
                        };
                    } else if (unit.id === state.unitThatCanAttack[0].id) {
                        return {
                            ...unit,
                            hasMoved: true,
                            hasAttacked: true,
                            finishedTurn: unit.id === "grimorg" ? false : true,
                            showPossibleMoves: []
                        };
                    } else {
                        return {
                            ...unit,
                            canBeAttacked: false
                        };
                    }
                });
            },
            userSelected(state, { id }) {
                state.armies = state.armies.map(unit => {
                    return {
                        ...unit,
                        userSelected: unit.id === id
                    };
                });
            },
            showPossibleMoves(state, { id, moves }) {
                state.armies = state.armies.map(unit => {
                    if (unit.id === id && !unit.finishedTurn) {
                        return {
                            ...unit,
                            showPossibleMoves: moves
                        };
                    } else {
                        return {
                            ...unit,
                            showPossibleMoves: []
                        };
                    }
                });
            },
            canBeAttacked(state, { unit, unitsInReach }) {
                state.armies = state.armies.map(unit => {
                    return {
                        ...unit,
                        canBeAttacked: unitsInReach.some(u => u.id == unit.id)
                    };
                });
                state.unitThatCanAttack = unit;
            },
            startAttack(state, { unitUnderAttack }) {
                state.unitUnderAttack = unitUnderAttack;
                state.attackModeOpen = true;
            },
            setupAllPieces(
                state,
                {
                    armies,
                    mainPlayingCards,
                    board,
                    ogrePlayingCards,
                    canonPlayingCards,
                    extraTiles
                }
            ) {
                let boardPositionsAsCubes = board.map((tile, row) => {
                    return tile.type.map((tileCol, col) => {
                        let oddOrEven;
                        row % 2 === 0
                            ? (oddOrEven = -1)
                            : (oddOrEven = 1);
                        let cube = OffsetCoord.roffsetToCube(oddOrEven, {
                            col,
                            row
                        });
                        return cube;
                    })
                })
                boardPositionsAsCubes = [].concat(...boardPositionsAsCubes);
                state.boardPositionsAsCubes = boardPositionsAsCubes;
                state.armies = armies;
                state.mainPlayingCards = mainPlayingCards;
                state.board = board;
                state.ogrePlayingCards = ogrePlayingCards;
                state.canonPlayingCards = canonPlayingCards;
                state.extraTiles = extraTiles;
            },
            shuffle(state, { cards }) {
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
                let oddOrEven;
                payload.positions.row % 2 === 0
                    ? (oddOrEven = -1)
                    : (oddOrEven = 1);
                const cube = new OffsetCoord.roffsetToCube(oddOrEven, {
                    col: payload.positions.col,
                    row: payload.positions.row
                });
                state.armies = state.armies.map(unit => {
                    if (unit.id === payload.id) {
                        return {
                            ...unit,
                            onBoard: true,
                            boardPosition: [payload.positions],
                            boardCubePosition: cube
                        };
                    } else {
                        return unit;
                    }
                });
            }
        },
        actions: {
            async nuxtServerInit({ dispatch }) {
                await dispatch("storeDispatchFunc");
            },
            async storeDispatchFunc({ commit }) {
                const board = require("~/static/board.json");
                let { armies } = require("~/static/armies.js");
                const mainPlayingCards = require("~/static/main-playing-cards.json");
                const ogrePlayingCards = require("~/static/ogre-playing-cards.json");
                const canonPlayingCards = require("~/static/canon-playing-cards.json");
                const extraTiles = require("~/static/extra-tiles.json");

                armies = armies.map(unit => {
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
                        remainingLives:
                            unit.special === "ogre"
                                ? ogrePlayingCards.length
                                : 3,
                        boardPosition: [],
                        boardCubePosition: {}
                    };
                });
                commit("setupAllPieces", {
                    armies,
                    mainPlayingCards,
                    board,
                    ogrePlayingCards,
                    canonPlayingCards,
                    extraTiles
                });
            }
        },
        getters: {
            gameHasStarted: state => {
                return state.gameStarted;
            },
            areExtraPiecesAddedToBoard: state => {
                return state.extraPiecesAddedToBoard;
            },
            getArmy: state => army => {
                return state.armies.filter(
                    unit => unit.army === army && unit.remainingLives > 0
                );
            },
            getPieceUserDragging: state => {
                return state.pieceUserDragging;
            },
            getDefeatedUnits: state => {
                return state.armies.filter(unit => unit.remainingLives <= 0);
            },
            getArmyPositions: state => army =>  {
                return state.armies.filter(unit => unit.army === army && unit.remainingLives > 0).map(unit => unit.boardPosition[0]);
            },
            getActiveUnitsPositions: state =>  {
                return state.armies.filter(unit => unit.isSelected && !unit.finishedTurn).map(u => u.boardPosition[0]);
            },
            getPlayingCards: state => {
                return state.mainPlayingCards;
            },
            getExtraTiles: state => {
                return state.extraTiles;
            },
            getOgreCards: state => {
                return state.ogrePlayingCards;
            },
            getCanonCards: state => {
                return state.canonPlayingCards;
            },
            getBoard: state => {
                return state.board;
            },
            getOpposingArmy: state => army => {
                return state.armies.filter(unit => unit.army !== army);
            },
            getAttackModeStatus: state => {
                return state.attackModeOpen;
            },
            getPieceById: state => id => {
                return state.armies.filter(unit => unit.id === id);
            },
            getCurrentCard: state => {
                return state.currentCard;
            },
            getCurrentOgreCard: state => {
                return state.currentOgreCard;
            },
            getCanonCardsOnBoard: state => {
                return state.canonCardsOnBoard;
            },
            getCanonPath: state => {
                return state.canonPath;
            },
            getNumOfRemainingOgreCards: state => {
                return state.numberOfOgreCardsLeft;
            },
            getUnitThatCanAttack: state => {
                return state.unitThatCanAttack;
            },
            getUnitUnderAttack: state => {
                return state.unitUnderAttack;
            },
            allUnitsOnBoard: state => {
                return state.armies.every(unit => unit.onBoard);
            },
            selectedUnit: state => {
                return state.armies.find(unit => unit.userSelected);
            },
            getPossibleMoves: state => {
                if (!state.armies.find(unit => unit.showPossibleMoves.length)) {
                    return [];
                } else {
                    return state.armies.filter(
                        unit => unit.showPossibleMoves.length
                    )[0].showPossibleMoves;
                }
            },
            getSurroundingTiles: (state, { getPieceById, getCurrentCard }) => (id) => {
                const unitToCheck = getPieceById(id)[0];
                const currentCard = getCurrentCard.ids || [];
                let distanceToCheck;
                currentCard.includes("movetwice") ? distanceToCheck = 2 : distanceToCheck = 1;
                const surroundingCubes = state.boardPositionsAsCubes.filter(tile => {
                    let hex = new Hex(tile.q, tile.r, tile.s);
                    return (
                        hex.distance(
                            unitToCheck.boardCubePosition
                        ) <= distanceToCheck
                    );
                });
                const surroundingTiles = surroundingCubes.map(
                    c => new OffsetCoord.roffsetFromCube(1, c)
                );
                return surroundingTiles;
            },
            checkIfUnitsInReach: (
                state,
                { getPieceById, getOpposingArmy }
            ) => id => {
                const unitToCheck = getPieceById(id)[0];
                const army = unitToCheck.army;
                const opposingArmy = getOpposingArmy(army);
                let range = 1;
                if (unitToCheck.special === "archer") {
                    range = 2;
                }
                if (unitToCheck.special === "crossbow") {
                    range = 3;
                }
                const enemiesInReach = opposingArmy.filter(unit => {
                    return (
                        unit.boardCubePosition.distance(
                            unitToCheck.boardCubePosition
                        ) <= range
                    );
                });
                return enemiesInReach;
            }
        }
    });
};

export default createStore;

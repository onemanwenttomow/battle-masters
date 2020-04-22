const express = require("express");
const app = (exports.app = express());
const { board } = require('./board');
const { armies } = require('./armies');
const { mainPlayingCards } = require('./main-playing-cards');
const { ogrePlayingCards } = require('./ogre-playing-cards');

app.get("/initial-board", (req, res) => {
    // console.log("made it to api", mainPlayingCards);
    res.json(
        {
            board,
            armies, 
            mainPlayingCards, 
            ogrePlayingCards
        }
    );
});

module.exports = {
    path: "/api",
    handler: app
};

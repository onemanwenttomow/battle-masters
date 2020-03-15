const express = require("express");
const app = (exports.app = express());
const { board } = require('./board');
const { armies } = require('./armies');

app.get("/initial-board", (req, res) => {
    console.log("made it to api");
    res.json(
        {
            board,
            armies
        }
    );
});

module.exports = {
    path: "/api",
    handler: app
};
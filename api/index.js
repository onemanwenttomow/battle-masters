const express = require("express");
const app = (exports.app = express());

app.get("/initial-board", (req, res) => {
    console.log("made it to api");
    res.json([
        ['field', 'road', 'field', 'field', 'field', 'road', 'field', 'field', 'field', 'road', 'field', 'field'],
        [],
        []]);
});

module.exports = {
    path: "/api",
    handler: app
};
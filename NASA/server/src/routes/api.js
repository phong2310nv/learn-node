const express = require("express");

const launchesRouter = require("./launches/launch.router");
const planetsRouter = require("./planets/planet.router");

const api = express.Router();
api.use("/planets", planetsRouter);
api.use("/launches", launchesRouter);
module.exports = api;

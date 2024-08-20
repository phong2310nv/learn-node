const express = require("express");
const { httpGetAllLaunches, httpAddNewLaunch } = require("./launch.controller");
const launchesRouter = express.Router();
launchesRouter.get("/", httpGetAllLaunches);
launchesRouter.post("/", httpAddNewLaunch);
module.exports = launchesRouter;

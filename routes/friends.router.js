const express = require("express");
const friendsController = require("../controllers/friends.controller");
const friendRouter = express.Router();
friendRouter.use((req, res, next) => {
  console.log(req.ip);
  next();
});
friendRouter.get("/", friendsController.getFriends);
friendRouter.get("/:id", friendsController.getFriend);
friendRouter.post("/", friendsController.addFriend);
module.exports = friendRouter;

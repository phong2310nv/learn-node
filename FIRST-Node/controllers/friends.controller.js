const friends = require("../models/friends.model");

function getFriends(req, res) {
  res.json(friends);
}
function getFriend(req, res) {
  const id = req.params.id;
  const friend = friends.find((f) => f.id == id);
  if (friend) {
    res.json(friend);
  } else {
    res.status(404).json({
      err: "Not found friend",
    });
  }
}
function addFriend(req, res) {
  if (!req.body.name) {
    return res.status(400).json({
      error: "Missing friend name",
    });
  }
  const newFriend = {
    name: req.body.name,
    id: friends.length,
  };
  friends.push(newFriend);
  res.json(newFriend);
}
module.exports = {
  getFriends,
  getFriend,
  addFriend,
};

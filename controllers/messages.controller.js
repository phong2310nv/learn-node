const path = require("path");

function getMessages(req, res) {
  res.sendFile(path.join(__dirname, "..", "public", "images", "packaging.jpg"));
  // res.send(`
  //         <ul>
  //         <li>First</li>
  //         <li>Second</li>
  //         </ul>
  //       `);
}
function postMessage(req, res) {
  console.log("Updating messages");
}
module.exports = {
  getMessages,
  postMessage,
};

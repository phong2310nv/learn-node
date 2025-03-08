const crypto = require("crypto");
const express = require("express");
const app = express();
const start = Date.now();
function doWork(duration) {
  const start = Date.now();
  while (Date.now() - start < duration) {
    // do nothing
  }
}
app.get("/", (req, res) => {
  crypto.pbkdf2("a", "b", 100000, 512, "sha512", () => {
    console.log(`Hash: ${Date.now() - start}`);
    res.send("Hello World!");
  });
});
app.get("/slow", (req, res) => {
  doWork(5000);
  res.send("I am slow as hell");
});
app.get("/fast", (req, res) => {
  console.log("fast");
  res.send("I am fast");
});
app.listen(4000, () => {
  console.log("Server is running on http://localhost:4000");
});

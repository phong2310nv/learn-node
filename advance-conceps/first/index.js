const cluster = require("cluster");
const crypto = require("crypto");
const express = require("express");
console.log(cluster.isPrimary);

if (cluster.isPrimary) {
  console.log("I am the primary process");
  cluster.fork();
} else {
  console.log("I am a worker");
  
  const app = express();
  //   function doWork(duration) {
  //     const start = Date.now();
  //     while (Date.now() - start < duration) {
  //       // do nothing
  //     }
  //   }

  app.get("/", (req, res) => {
    crypto.pbkdf2("a", "b", 100000, 512, "sha512", () => {
      console.log(`${i}: ${Date.now() - start}`);
      res.send("Hello World!");
    });
  });
  app.get("/fast", (req, res) => {
    res.send("I am fast");
  });
  app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
  });
}

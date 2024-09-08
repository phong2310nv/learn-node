const express = require("express");

const app = express();
function delay(duration) {
  const stateTime = Date.now();
  console.log(`Checking ${process.pid}`);

  while (Date.now() - stateTime < duration) {}
}
app.get("/", (req, res) => {
  res.send(`Performance example ${process.pid}`);
});
app.get("/time", (req, res) => {
  delay(2000);
  res.send(`Ding ding ding !  ${process.pid}`);
});
app.listen(3000);
// return
// if (cluster.isPrimary) {
//   console.log("Master has been started");
//   // Get the number of available CPU cores
//   const numCPUs = os.cpus().length;
//   console.log(numCPUs, "numCPUs");

//   console.log(`Master ${process.pid} is running`);

//   // Fork a worker process for each CPU core
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }

//   // Listen for workers that exit, and replace them with a new one
//   cluster.on("exit", (worker, code, signal) => {
//     console.log(`Worker ${worker.process.pid} died. Restarting...`);
//     cluster.fork();
//   });
// } else {

//   const app = express();
//   app.get("/", (req, res) => {
//     res.send(`Performance example ${process.pid}`);
//   });
//   app.get("/time", (req, res) => {
//     delay(5000);
//     res.send(`Ding ding ding !  ${process.pid}`);
//   });
//   app.listen(3000);

//   console.log(`Worker ${process.pid} started`);
// }

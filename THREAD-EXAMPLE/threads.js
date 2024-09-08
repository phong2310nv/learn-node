const { isMainThread, Worker, workerData } = require("worker_threads");
if (isMainThread) {
  console.log(`Main Thread! Process ID ${process.pid}`);
  new Worker(__filename, { workerData: "A" });
  new Worker(__filename, { workerData: "B" });
} else {
  console.log(`Worker! Process ID ${process.pid}`);
  for (let i = 0; i < 500000; i++) {
    let x = "";
    for (let j = 0; j < 500; j++) {
      x += i;
    }
    if (i % 1000 === 0) {
      console.log(`${workerData}: ${i}`);
    }
  }
}

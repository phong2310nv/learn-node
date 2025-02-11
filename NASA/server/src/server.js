const http = require("http");
const app = require("./app");
require("dotenv").config();
const PORT = process.env.PORT || 8000;

const server = http.createServer(app);
const { loadPlanetsData } = require("./models/planet.model");
const { mongoConnect } = require("./services/mongo");
const { loadLaunchData } = require("./models/launches.model");

async function startServer() {
  await mongoConnect();
  await loadPlanetsData();
  await loadLaunchData();
  server.listen(PORT, () => {
    console.log(`Listing on port ${PORT}`);
    console.log(`Test ENV: ${process.env.TEST_ENV}`);
  });
}
startServer();

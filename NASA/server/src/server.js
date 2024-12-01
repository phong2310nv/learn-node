const http = require("http");
const app = require("./app");
const PORT = process.env.PORT || 8000;

const server = http.createServer(app);
const { loadPlanetsData } = require("./models/planet.model");
const { mongoConnect } = require("./services/mongo");

async function startServer() {
  await mongoConnect();
  await loadPlanetsData();
  server.listen(PORT, () => {
    console.log(`Listing on port ${PORT}`);
  });
}
startServer();

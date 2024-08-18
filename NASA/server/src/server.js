const http = require("http");
const app = require("./app");
const PORT = process.env.PORT || 8000;
const server = http.createServer(app);
const { loadPlanetsData } = require("./models/planet.model");
async function startServer() {
  await loadPlanetsData();
  server.listen(PORT, () => {
    console.log(`Listing on port ${PORT}`);
  });
}
startServer();

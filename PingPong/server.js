const http = require("http");
const apiServer = require("./api");
const io = require("socket.io");
const socket = require("./socket");
const httpServer = http.createServer(apiServer);

const socketServer = io(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
socket.listen(socketServer);

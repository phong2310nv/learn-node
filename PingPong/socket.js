let playerCount = 0;

function listen(io) {
  const pongNamespace = io.of("/pong");
  pongNamespace.on("connection", (socket) => {
    let room;
    console.log(`Player connected: ${socket.id}`);
    socket.on("ready", () => {
      room = `room-${Math.floor(playerCount / 2)}`;
      socket.join(room);
      playerCount++;
      console.log(`Player ${socket.id} is ready in room ${room}`);
      if (playerCount % 2 === 0) {
        pongNamespace.in(room).emit("startGame", socket.id);
      }
    });
    socket.on("paddleMove", (paddleData) => {
      console.log(`paddleMove :${room}`);

      socket.to(room).emit("paddleMove", paddleData);
    });
    socket.on("ballMove", (ballData) => {
      console.log(`ballMove :${room}`);
      socket.to(room).emit("ballMove", ballData);
    });
    socket.on("disconnect", () => {
      console.log(`Player disconnected: ${socket.id}`);
      socket.leave(room);
    });
  });
}
module.exports = {
  listen,
};

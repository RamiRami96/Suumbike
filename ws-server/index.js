const express = require("express");
const http = require("http");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join", (roomId) => {
    const { rooms } = io.sockets.adapter;
    const room = rooms.get(roomId);

    if (room === undefined) {
      socket.join(roomId);
      socket.emit("created");
    } else if (room.size === 1) {
      socket.join(roomId);
      socket.emit("joined");
    } else {
      socket.emit("full");
    }
    console.log(rooms);
  });

  socket.on("ready", (roomId) => {
    socket.broadcast.to(roomId).emit("ready");
  });

  socket.on("ice-candidate", (candidate, roomId) => {
    console.log(candidate);
    socket.broadcast.to(roomId).emit("ice-candidate", candidate);
  });

  socket.on("offer", (offer, roomId) => {
    socket.broadcast.to(roomId).emit("offer", offer);
  });

  socket.on("answer", (answer, roomId) => {
    socket.broadcast.to(roomId).emit("answer", answer);
  });

  socket.on("leave", (roomId) => {
    socket.leave(roomId);
    socket.broadcast.to(roomId).emit("leave");
  });
});

server.listen(8000, () => {
  console.log("Server listening on port 8000");
});

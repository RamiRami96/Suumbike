//TODO:rewrite this to next.js api

const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let users = {};

io.on("connection", (socket) => {
  users = {};

  if (!users[socket.id]) {
    users[socket.id] = socket.id;
  }
  socket.emit("userID", socket.id);

  io.sockets.emit("allUsers", users);
  socket.on("disconnect", () => {
    delete users[socket.id];
  });

  socket.on("connectUser", (data) => {
    io.to(data.userToCall).emit("init", {
      signal: data.signalData,
      from: data.from,
    });
  });

  socket.on("acceptConnection", (data) => {
    io.to(data.to).emit("connectionAccepted", data.signal);
  });
});

server.listen(8000, () => console.log("server is running on port 8000"));

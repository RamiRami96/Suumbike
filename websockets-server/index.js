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

let ids = {};

io.on("connection", (socket) => {
  ids = {};

  if (!ids[socket.id]) {
    ids[socket.id] = socket.id;
  }
  socket.emit("socketID", socket.id);

  io.sockets.emit("allIds", Object.keys(ids).length < 3 ? ids : null);

  socket.on("disconnect", () => {
    delete ids[socket.id];
  });

  socket.on("connectUser", (data) => {
    io.to(data.to).emit("init", {
      signal: data.signalData,
      from: data.from,
    });
  });

  socket.on("acceptConnection", (data) => {
    io.to(data.to).emit("connectionAccepted", data.signal);
  });

  socket.on("checkControls", (data) => {
    io.emit("checkControls", data);
  });
});

server.listen(8000, () => console.log("server is running on port 8000"));

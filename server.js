const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Configurer Twig
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "twig");

// Route principale
app.get("/", (req, res) => {
  res.render("index");
});

// Socket.IO
io.on("connection", (socket) => {
  console.log("Un utilisateur connecté");

  socket.on("chat message", (data) => {
    io.emit("chat message", data);
  });
});

server.listen(3000, () => {
  console.log("Serveur lancé sur http://localhost:3000");
});

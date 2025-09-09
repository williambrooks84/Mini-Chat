require('dotenv').config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const { PrismaClient } = require("./generated/prisma");
const prisma = new PrismaClient();

// Configurer Twig
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "twig");

// Route principale
app.get("/", (_, res) => {
  res.render("index");
});

// Socket.IO

io.on("connection", async (socket) => {
  console.log("Un utilisateur connecté");

  // Récupérer l'historique des messages et l'envoyer au client
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: 'asc' }
    });
    socket.emit("chat history", messages);
  } catch (error) {
    console.error("Erreur lors de la récupération des messages:", error);
  }
  // Déconnexion de l'utilisateur
  socket.on("disconnect", () => {
    console.log("Un utilisateur déconnecté");
  });
  socket.on("chat message", async (data) => {
    try {
      // Enregistrer le message dans la base de données
      await prisma.message.create({
        data: {
          pseudo: data.pseudo || data.username || "Anonyme",
          content: data.content || data.message || "",
        },
      });
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du message:", error);
    }
    io.emit("chat message", data);
  });
});

server.listen(3000, () => {
  console.log("Serveur lancé sur http://localhost:3000");
});

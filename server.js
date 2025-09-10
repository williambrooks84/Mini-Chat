import {createServer} from 'http';
import { PrismaClient } from "./generated/prisma/index.js";
import { Server } from "socket.io";
import app from './app.js';

import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

const httpServer = createServer(app);
const io = new Server(httpServer);

//Echo pour tests
io.on('connection', async (socket) => {
  socket.on('message', (msg) => {
    socket.emit('message', msg);
  });
});


//Socket IO
io.on('connection', async (socket) => {
  console.log('Un utilisateur connecté');

  try{
    const lastMessages = await prisma.message.findMany({
      orderBy: { createdAt: 'asc' },
      take: 50,
    });
    socket.emit('chat history', lastMessages);
  } catch (error) {
    console.error('Erreur lors de la récupération des messages :', error);
  }

  socket.on('chat message', async (data) => {
    try {
      await prisma.message.create({
        data: {
          pseudo: data.pseudo,
          content: data.message,
        },
      });
    } catch (err) {
      console.error('Erreur sauvegarde message:', err);
    } 
    io.emit('chat message', data);
  });
  socket.on('disconnect', () => {
    console.log('Utilisateur déconnecté');
  });
});

//Démarrage serveur

httpServer.listen(3000, () => {
  console.log("Serveur lancé sur http://localhost:3000");
});

export { httpServer, io };
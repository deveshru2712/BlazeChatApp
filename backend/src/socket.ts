import express from "express";
import http from "http";
import { Server } from "socket.io";

import env from "./utils/validateEnv";
import prismaClient from "./utils/prismaClient";

export const app = express();

export const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: env.CLIENT_URL,
    credentials: true,
  },
  // get use the online user
  pingInterval: 25000,
  pingTimeout: 20000,
});

export const activeSockets = new Map<string, string>();

export const activeUsers = new Map<string, number>();

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });

  // saving the user
  socket.on("register-user", async (userId: string) => {
    // prevent double registration for same socket
    if (activeSockets.has(socket.id)) return;

    activeSockets.set(socket.id, userId);

    const previousCount = activeUsers.get(userId) ?? 0;
    activeUsers.set(userId, previousCount + 1);

    // emit online event only if user was offline
    if (previousCount === 0) {
      io.emit("user-online", userId);
    }

    try {
      const conversations = await prismaClient.conversation.findMany({
        where: {
          participants: {
            some: { userId },
          },
        },
        select: { id: true },
      });

      // join all conversation rooms
      conversations.forEach((conversation) => {
        socket.join(conversation.id);
      });
    } catch (error) {
      console.error("Error registering user:", error);
    }
  });

  // online user list
  socket.on("request-online-users", () => {
    socket.emit("online-users", Array.from(activeUsers.keys()));
  });

  //user-typing
  socket.on("user-typing", (data: { conversationId: string }) => {
    socket.to(data.conversationId).emit("user-typing-server", true);
  });

  socket.on("user-stop-typing", (data: { conversationId: string }) => {
    socket.to(data.conversationId).emit("user-stop-typing-server", false);
  });

  // disconnect
  socket.on("disconnect", () => {
    const userId = activeSockets.get(socket.id);
    if (!userId) return;

    const count = activeUsers.get(userId);

    if (count === 1) {
      activeUsers.delete(userId);
      io.emit("user-offline", userId);
    } else if (count && count > 1) {
      activeUsers.set(userId, count - 1);
    }

    activeSockets.delete(socket.id);

    console.log("Socket disconnected:", socket.id);
  });
});

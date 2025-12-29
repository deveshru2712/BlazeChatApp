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
  pingInterval: 25000,
  pingTimeout: 20000,
});

// socketId -> userId
export const activeSockets = new Map<string, string>();

// userId -> number of active connections
export const activeUsers = new Map<string, number>();

// auth middleware
io.use((socket, next) => {
  const userId = socket.handshake.auth?.userId;
  if (!userId || typeof userId !== "string") {
    return next(new Error("Unauthorized socket connection"));
  }

  socket.data.userId = userId;
  next();
});

io.on("connection", async (socket) => {
  const userId: string = socket.data.userId;

  // TODO:remove this log
  console.log("Socket connected:", socket.id, "User:", userId);

  // prevent double registration
  if (!activeSockets.has(socket.id)) {
    activeSockets.set(socket.id, userId);

    const previousCount = activeUsers.get(userId) ?? 0;
    activeUsers.set(userId, previousCount + 1);

    // emit online only if user was offline
    if (previousCount === 0) {
      io.emit("user-online", userId);
    }
  }

  try {
    const conversations = await prismaClient.conversation.findMany({
      where: {
        participants: {
          some: {
            userId,
          },
        },
      },
      select: {
        id: true,
      },
    });

    // join all conversation rooms
    conversations.forEach((conversation) => {
      socket.join(conversation.id);
    });
  } catch (error) {
    console.error("Error loading conversations:", error);
  }

  // Online users list
  socket.on("request-online-users", () => {
    socket.emit("online-users", Array.from(activeUsers.keys()));
  });

  // Typing status

  socket.on("user-typing", ({ conversationId }) => {
    socket.to(conversationId).emit("user-typing-server", true);
  });

  socket.on("user-stop-typing", ({ conversationId }) => {
    socket.to(conversationId).emit("user-stop-typing-server", false);
  });

  // Disconnect
  socket.on("disconnect", () => {
    const storedUserId = activeSockets.get(socket.id);
    if (!storedUserId) return;

    const count = activeUsers.get(storedUserId);

    if (count === 1) {
      activeUsers.delete(storedUserId);
      io.emit("user-offline", storedUserId);
    } else if (count && count > 1) {
      activeUsers.set(storedUserId, count - 1);
    }

    activeSockets.delete(socket.id);
    console.log("Socket disconnected:", socket.id);
  });

  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });
});

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
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});

export const activeSockets = new Map<string, string>();
export const activeUsers = new Set<string>();

io.on("connection", async (socket) => {
  socket.on("error", (error) => {
    console.error("Socket error for", socket.id, ":", error);
  });

  socket.on("register-user", async (userId: string) => {
    activeSockets.set(socket.id, userId);
    activeUsers.add(userId);

    try {
      const conversations = await prismaClient.conversation.findMany({
        where: { participants: { some: { id: userId } } },
        select: { id: true },
      });

      conversations.forEach((c) => socket.join(c.id));
    } catch (error) {
      console.error("Error registering user:", error);
    }
  });

  socket.on("heartbeat", () => {});

  socket.on("send-message", () => {});

  socket.on("request-online-users", () => {
    socket.emit("online-users", Array.from(activeUsers));
  });

  socket.on(
    "user-typing",
    (data: { userId: string; conversationId: string }) => {
      socket.to(data.conversationId).emit("user-typing-server", true);
    }
  );

  socket.on(
    "user-stop-typing",
    (data: { userId: string; conversationId: string }) => {
      socket.to(data.conversationId).emit("user-stop-typing-server", false);
    }
  );

  socket.on("disconnect", () => {
    const userId = activeSockets.get(socket.id);
    if (userId) {
      activeUsers.delete(userId);
    }
    activeSockets.delete(socket.id);
  });
});

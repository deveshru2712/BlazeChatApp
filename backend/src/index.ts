import "dotenv/config";
import express from "express";
import cors from "cors";
import createHttpError from "http-errors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import authRouter from "./routes/auth.router";
import messageRouter from "./routes/message.router";
import userRouter from "./routes/user.router";

import env from "./utils/validateEnv";

import { app, server } from "./socket";
import { errorHandler } from "./utils/errorHandler";

app.use(morgan("dev"));
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("running successfully");
});

app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);
app.use("/api/user", userRouter);

app.use((req, res, next) => {
  next(createHttpError(404, `Page not found:${req.url}`));
});

app.use(errorHandler);

server.listen(env.PORT, async () => {
  console.log("Server is running on the port:", env.PORT);
});

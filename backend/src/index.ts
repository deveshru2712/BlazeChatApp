import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import { z } from "zod";
import cors from "cors";
import createHttpError, { isHttpError } from "http-errors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import authRouter from "./routes/auth.router";
import messageRouter from "./routes/message.router";
import userRouter from "./routes/user.router";

import env from "./utils/validateEnv";

import { app, server } from "./socket";

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
  next(createHttpError(404, "Page not found"));
});

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  let errorMessage = "Something went wrong";
  let statusCode = 500;
  let stack: string | undefined;

  // handling zod errors
  if (error instanceof z.ZodError) {
    const errors = error.errors.map((issue) => ({
      field: issue.path.join(".") || "request",
      message: issue.message,
    }));

    console.log(errors);

    res
      .status(400)
      .json({ success: false, message: "Validation error", errors });
    return;
  }

  // handling http errors
  if (isHttpError(error)) {
    if ("status" in error && typeof error.status === "number") {
      statusCode = error.status;
    }
    errorMessage = error.message;
    stack = env.NODE_ENV === "development" ? error.stack : undefined;
    console.log(error);
  }

  res.status(statusCode).json({
    success: false,
    message: errorMessage,
    stack,
  });
  return;
});

server.listen(env.PORT, async () => {
  console.log("Server is running on the port:", env.PORT);
});

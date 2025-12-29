import type { ErrorRequestHandler } from "express";
import { isHttpError } from "http-errors";
import { z } from "zod";

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  let statusCode = 500;
  let message = "Something went wrong";

  if (error instanceof z.ZodError) {
    const flattened = error.flatten();

    res.status(400).json({
      success: false,
      message: "Validation error",
      errors: flattened.fieldErrors,
      formErrors: flattened.formErrors,
    });
    return;
  }

  if (isHttpError(error)) {
    statusCode = error.status ?? 500;
    message = error.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack:
      process.env.NODE_ENV === "development"
        ? (error as Error)?.stack
        : undefined,
  });
};

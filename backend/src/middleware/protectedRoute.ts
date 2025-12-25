import { RequestHandler } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import env from "../utils/validateEnv";

const ProtectedRoute: RequestHandler = async (req, res, next) => {
  try {
    const cookie = req.cookies.blazeToken;
    if (!cookie) {
      throw createHttpError(401, "No cookie");
    }

    const decode = jwt.verify(cookie, env.JWT_KEY) as {
      userId: string;
      username: string;
      email: string;
    };

    if (!decode) {
      throw createHttpError(401, "Invalid cookie");
    }

    req.user = decode;
    next();
  } catch (error) {
    next(error);
  }
};

export default ProtectedRoute;

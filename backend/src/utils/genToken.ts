import jwt from "jsonwebtoken";
import env from "./validateEnv";
import { CookieOptions } from "express";

const genToken = (userId: string, userName: string, email: string) => {
  if (!userId || typeof userId !== "string") {
    return {
      success: false,
      message: "Invalid userId",
    };
  }

  const token = jwt.sign({ userId, userName }, env.JWT_KEY, {
    expiresIn: "7d",
  });

  const cookieOption: CookieOptions = {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "none" : "lax",
  };

  return {
    success: true,
    token,
    cookieOption,
  };
};

export default genToken;

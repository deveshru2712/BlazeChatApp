import { RequestHandler } from "express";
import { SignInType, SignUpType } from "../utils/schema/AuthSchema";
import createHttpError from "http-errors";
import prismaClient from "../utils/prismaClient";
import bcrypt from "bcryptjs";
import genToken from "../utils/genToken";

export const signUp: RequestHandler<
  unknown,
  unknown,
  SignUpType,
  unknown
> = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      throw createHttpError(400, "Invalid inputs");
    }

    const existingUser = await prismaClient.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw createHttpError(400, "Email already in user");
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await prismaClient.user.create({
      data: { email, username, password: hashPassword },
    });

    if (!newUser) {
      throw createHttpError(400, "Unable to create account");
    }

    const session = genToken(newUser.id, username, email);

    if (!session.success) {
      res.status(400).json({
        message: session.message,
        action: "Login",
      });
      return;
    }

    res.cookie("blazeToken", session.token, { ...session.cookieOption });
    res.status(201).json({
      newUser: { ...newUser, password: undefined },
      message: "Account created successfully",
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const signIn: RequestHandler<
  unknown,
  unknown,
  SignInType,
  unknown
> = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      throw createHttpError(400, "Invalid input");
    }

    const user = await prismaClient.user.findUnique({
      where: { email },
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
      },
    });
    if (!user) {
      throw createHttpError(404, "User not found");
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      throw createHttpError(401, "Invalid credentials");
    }

    const session = genToken(user.id, user.username, user.email);

    if (!session.success) {
      res.status(500).json({
        message: session.message,
      });
      return;
    }

    res.cookie("blazeToken", session.token, { ...session.cookieOption });
    res.status(200).json({
      user: { ...user, password: undefined },
      message: "Logged in successfully",
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const logOut: RequestHandler = (req, res, next) => {
  try {
    res.cookie("blazeToken", "", {
      expires: new Date(0),
      httpOnly: true,
      sameSite: "strict",
    });
    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const verify: RequestHandler = async (req, res, next) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (error) {
    next(error);
  }
};

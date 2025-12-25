import { RequestHandler } from "express";
import prismaClient from "../utils/prismaClient";
import bcrypt from "bcryptjs";
import { updateBodyType } from "../utils/schema/updateSchema";
import createHttpError from "http-errors";

export const searchUser: RequestHandler<
  unknown,
  unknown,
  unknown,
  { username: string }
> = async (req, res, next) => {
  const { username } = req.query;
  const currentUser = req.user.userId;
  try {
    if (!username || !username.trim()) {
      res
        .status(400)
        .json({ success: false, message: "Please provide a username" });
      return;
    }

    const users = await prismaClient.user.findMany({
      where: {
        username: {
          contains: username.trim(),
          mode: "insensitive",
        },
        NOT: { id: currentUser },
      },
      select: {
        id: true,
        username: true,
        email: true,
        profilePicture: true,
        conversations: {
          where: {
            participants: {
              some: {
                id: currentUser,
              },
            },
          },
          select: {
            id: true,
            messages: {
              orderBy: {
                createdAt: "desc",
              },
              take: 1,
              select: {
                id: true,
                content: true,
                createdAt: true,
                senderId: true,
              },
            },
          },
        },
      },
    });

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser: RequestHandler<
  unknown,
  unknown,
  updateBodyType,
  { userId: string }
> = async (req, res, next) => {
  const { userId } = req.query;
  if (!userId) {
    res.status(400).json({
      success: false,
      message: "Invalid userId",
    });
    return;
  }

  try {
    const { username, password, email, profilePicture } = req.body;

    const user = await prismaClient.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        username: true,
        password: true,
        profilePicture: true,
      },
    });

    if (!user) {
      throw createHttpError(400, "Unable to find the user");
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      throw createHttpError(401, "Invalid credentials");
    }

    const updateData: Partial<{
      username: string;
      email: string;
      profilePicture: string;
    }> = {};

    if (username && username != user.username) {
      updateData.username = username.trim();
    }
    if (email && email != user.email) {
      updateData.email = email.trim();
    }
    if (profilePicture && profilePicture != user.profilePicture) {
      updateData.profilePicture = profilePicture.trim();
    }

    if (Object.keys(updateData).length === 0) {
      res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
      return;
    }

    const updateUser = await prismaClient.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        profilePicture: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updateUser,
    });
  } catch (error) {
    next(error);
  }
};

export const getPrevMessage: RequestHandler<
  unknown,
  unknown,
  unknown,
  { userId: string }
> = async (req, res, next) => {
  const { userId } = req.query;

  try {
    if (!userId) {
      res.status(400).json([]);
      return;
    }

    const user = await prismaClient.user.findFirst({
      where: { id: userId },
      include: {
        conversations: {
          include: {
            participants: true,
            messages: {
              orderBy: { createdAt: "asc" },
              include: {
                sender: true,
                receiver: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      res.json([]);
      return;
    }

    res.json(user.conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

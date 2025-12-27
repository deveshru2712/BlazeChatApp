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
        profilePicture: true,

        conversationParticipants: {
          where: {
            conversation: {
              type: "DIRECT",
              participants: {
                some: {
                  userId: currentUser,
                },
              },
            },
          },
          select: {
            conversation: {
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
  { receiverId: string }
> = async (req, res, next) => {
  const { receiverId } = req.query;
  const senderId = req.user.userId;

  try {
    if (!receiverId) {
      res.status(400).json([]);
      return;
    }

    const conversation = await prismaClient.conversation.findFirst({
      where: {
        type: "DIRECT",
        directKey: [senderId, receiverId].sort().join("_"),
      },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!conversation) {
      res.json([]);
      return;
    }

    res.json(conversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

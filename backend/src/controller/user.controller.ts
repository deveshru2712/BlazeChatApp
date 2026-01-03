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
  try {
    const { username } = req.query;
    const currentUserId = req.user?.userId;

    if (!currentUserId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    if (!username || !username.trim()) {
      res.status(400).json({
        success: false,
        message: "Please provide a username",
      });
      return;
    }

    const users = await prismaClient.user.findMany({
      where: {
        username: {
          startsWith: username.trim(),
          mode: "insensitive",
        },
        NOT: { id: currentUserId },
      },
      take: 20,
      select: {
        id: true,
        username: true,
        profilePicture: true,
      },
    });

    if (users.length === 0) {
      res.json({ success: true, users: [] });
      return;
    }

    const userIds = users.map((u) => u.id);

    const conversations = await prismaClient.conversation.findMany({
      where: {
        type: "DIRECT",
        participants: {
          some: { userId: currentUserId },
        },
        AND: {
          participants: {
            some: { userId: { in: userIds } },
          },
        },
      },
      select: {
        id: true,
        participants: {
          select: { userId: true },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            id: true,
            content: true,
            senderId: true,
            createdAt: true,
          },
        },
      },
    });

    const conversationMap = new Map<string, (typeof conversations)[0]>();

    for (const conv of conversations) {
      const otherUser = conv.participants.find(
        (p) => p.userId !== currentUserId
      );
      if (otherUser) {
        conversationMap.set(otherUser.userId, conv);
      }
    }

    const result = users.map((user) => {
      const conversation = conversationMap.get(user.id);

      return {
        id: user.id,
        username: user.username,
        profilePicture: user.profilePicture,
        conversation: conversation
          ? {
              id: conversation.id,
              lastMessage: conversation.messages[0] ?? null,
            }
          : null,
      };
    });

    res.json({ success: true, users: result });
    return;
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

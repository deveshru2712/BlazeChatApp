import { RequestHandler } from "express";
import prismaClient from "../utils/prismaClient";
import { io } from "../socket";

export const getDirectMessage: RequestHandler<
  { receiverId: string },
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  const senderId = req.user.userId;
  const receiverId = req.params.receiverId;

  try {
    if (!receiverId) {
      res.status(400).json({
        success: false,
        message: "Please provide a valid receiver id",
      });
      return;
    }

    const conversation = await prismaClient.conversation.findFirst({
      where: {
        type: "DIRECT",
        AND: [
          {
            participants: {
              some: { userId: senderId },
            },
          },
          {
            participants: {
              some: { userId: receiverId },
            },
          },
        ],
      },
      include: {
        messages: true,
      },
    });

    if (!conversation) {
      res.status(200).json({
        success: true,
        message: "no message",
        data: [],
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "successfully retrieved message",
      result: conversation.messages,
    });
  } catch (error) {
    next(error);
  }
};

export const sendDirectMessage: RequestHandler<
  { receiverId: string },
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  const senderId = req.user.userId;
  const receiverId = req.params.receiverId;
  const { content } = req.body as { content: string };

  try {
    if (!receiverId) {
      res.status(400).json({
        success: false,
        message: "Please provide a valid reciver id",
      });
      return;
    }

    if (receiverId == senderId) {
      res.status(400).json({
        success: false,
        message: "You can not send message to yourself",
      });
    }

    const receiverExists = await prismaClient.user.findUnique({
      where: { id: receiverId },
    });

    if (!receiverExists) {
      res.status(404).json({
        success: false,
        message: "Receiver not found",
      });
      return;
    }

    const transaction = await prismaClient.$transaction(async (tx) => {
      // creating a direct key
      const directKey = [senderId, receiverId].sort().join("_");

      let conversation = await tx.conversation.findUnique({
        where: { directKey },
      });

      if (!conversation) {
        conversation = await tx.conversation.create({
          data: {
            type: "DIRECT",
            directKey,
            participants: {
              create: [{ userId: senderId }, { userId: receiverId }],
            },
          },
        });
      }

      const newMessage = await tx.message.create({
        data: {
          content,
          conversationId: conversation.id,
          senderId,
        },
      });

      return { newMessage, conversation };
    });

    res.status(201).json({
      success: true,
      message: transaction.newMessage,
      conversationId: transaction.conversation,
    });

    const messageData = {
      id: transaction.newMessage.id,
      content: transaction.newMessage.content,
      senderId: transaction.newMessage.senderId,
      createdAt: transaction.newMessage.createdAt,
    };

    // frontend will listen for this event
    io.to(transaction.conversation.id).emit("receive-message", messageData);
  } catch (error) {
    next(error);
  }
};

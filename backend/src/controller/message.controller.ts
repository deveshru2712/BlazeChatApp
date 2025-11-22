import { RequestHandler } from "express";
import { MessageType } from "../utils/schema/messageSchema";
import prismaClient from "../utils/prismaClient";
import { io } from "../socket";
import { activeSockets } from "../socket";

export const getMessage: RequestHandler<
  { receiverId: string },
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  const senderId = req.user.id;
  const receiverId = req.params.receiverId;

  try {
    if (!receiverId) {
      res.status(400).json({
        success: false,
        message: "Please provide a valid userid",
      });
      return;
    }

    const conversation = await prismaClient.conversation.findFirst({
      where: {
        participants: { every: { id: { in: [senderId, receiverId] } } },
      },
      select: { messages: { orderBy: { createdAt: "asc" } } },
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

export const sendMessage: RequestHandler<
  { receiverId: string },
  unknown,
  MessageType,
  unknown
> = async (req, res, next) => {
  const senderId = req.user.id;
  const receiverId = req.params.receiverId;
  const { message: content } = req.body;

  try {
    if (!receiverId) {
      res.status(400).json({
        success: false,
        message: "Please provide a valid userid",
      });
      return;
    }

    const receiverExists = await prismaClient.user.findUnique({
      where: { id: receiverId },
      select: { id: true },
    });

    if (!receiverExists) {
      res.status(404).json({
        success: false,
        message: "Receiver not found",
      });
      return;
    }

    const transaction = await prismaClient.$transaction(async (tx) => {
      let conversation = await tx.conversation.findFirst({
        where: {
          AND: [
            { participants: { some: { id: senderId } } },
            { participants: { some: { id: receiverId } } },
            {
              participants: { none: { id: { notIn: [senderId, receiverId] } } },
            },
          ],
        },
        include: { participants: { select: { id: true } } },
      });

      if (!conversation) {
        conversation = await tx.conversation.create({
          data: {
            participants: {
              connect: [{ id: senderId }, { id: receiverId }],
            },
          },
          include: { participants: { select: { id: true } } },
        });
      }

      const newMessage = await tx.message.create({
        data: {
          content: content.trim(),
          conversationId: conversation.id,
          senderId,
          receiverId,
        },
        include: {
          sender: {
            select: {
              id: true,
              email: true,
              username: true,
            },
          },
        },
      });

      return { message: newMessage, conversation };
    });

    res.status(201).json({
      success: true,
      message: transaction.message,
      conversationId: transaction.conversation,
    });

    const senderSocketId = [...activeSockets.entries()].find(
      ([, uid]) => uid === senderId
    )?.[0];

    const receiverSocketId = [...activeSockets.entries()].find(
      ([, uid]) => uid === receiverId
    )?.[0];

    if (senderSocketId) {
      io.to(senderSocketId).socketsJoin(transaction.conversation.id);
    }

    if (receiverSocketId) {
      io.to(receiverSocketId).socketsJoin(transaction.conversation.id);
    }

    const messageData = {
      id: transaction.message.id,
      content: transaction.message.content,
      senderId: transaction.message.senderId,
      receiverId: transaction.message.receiverId,
      createdAt: transaction.message.createdAt,
    };

    io.to(transaction.conversation.id).emit("receive-message", messageData);
  } catch (error) {
    next(error);
  }
};

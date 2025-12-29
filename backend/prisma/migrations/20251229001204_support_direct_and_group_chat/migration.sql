/*
  Warnings:

  - You are about to drop the column `receiverId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the `_UserConversations` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[directKey]` on the table `Conversation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ConversationType" AS ENUM ('DIRECT', 'GROUP');

-- CreateEnum
CREATE TYPE "ParticipantRole" AS ENUM ('MEMBER', 'ADMIN');

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_senderId_fkey";

-- DropForeignKey
ALTER TABLE "_UserConversations" DROP CONSTRAINT "_UserConversations_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserConversations" DROP CONSTRAINT "_UserConversations_B_fkey";

-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "directKey" TEXT,
ADD COLUMN     "type" "ConversationType" NOT NULL;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "receiverId",
DROP COLUMN "updatedAt";

-- DropTable
DROP TABLE "_UserConversations";

-- CreateTable
CREATE TABLE "ConversationParticipant" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "ParticipantRole" NOT NULL DEFAULT 'MEMBER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConversationParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ConversationParticipant_userId_idx" ON "ConversationParticipant"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ConversationParticipant_conversationId_userId_key" ON "ConversationParticipant"("conversationId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_directKey_key" ON "Conversation"("directKey");

-- CreateIndex
CREATE INDEX "Message_conversationId_idx" ON "Message"("conversationId");

-- CreateIndex
CREATE INDEX "Message_senderId_idx" ON "Message"("senderId");

-- AddForeignKey
ALTER TABLE "ConversationParticipant" ADD CONSTRAINT "ConversationParticipant_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationParticipant" ADD CONSTRAINT "ConversationParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

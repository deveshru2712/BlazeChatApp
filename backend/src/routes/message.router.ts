import express from "express";
import ProtectedRoute from "../middleware/protectedRoute";
import * as messageController from "../controller/message.controller";

const router = express.Router();

// direct route
router.get(
  "/direct/:receiverId",
  ProtectedRoute,
  messageController.getDirectMessage
);

router.post(
  "/direct/:receiverId",
  ProtectedRoute,
  messageController.sendDirectMessage
);

// group route

export default router;

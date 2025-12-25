import express from "express";
import ProtectedRoute from "../middleware/protectedRoute";
import * as messageController from "../controller/message.controller";
import inputValidator from "../middleware/inputValidator";

const router = express.Router();

router.get("/:receiverId", ProtectedRoute, messageController.getMessage);

router.post("/:receiverId", ProtectedRoute, messageController.sendMessage);

export default router;

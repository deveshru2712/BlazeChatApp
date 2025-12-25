import express from "express";
import * as userController from "../controller/user.controller";
import ProtectedRoute from "../middleware/protectedRoute";
import inputValidator from "../middleware/inputValidator";
import { updateSchema } from "../utils/schema/updateSchema";
const router = express.Router();

router.get("/", ProtectedRoute, userController.searchUser);
router.post(
  "/update",
  inputValidator(updateSchema),
  ProtectedRoute,
  userController.updateUser
);

router.get("/user/conversation", ProtectedRoute, userController.getPrevMessage);

export default router;

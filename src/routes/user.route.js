import { Router } from "express";
import { authenticateJWT } from "../middleware/auth.middleware.js";
import {
  getUsers,
  searchUsers,
  getFriends,
  unfriend,
} from "../controllers/user.controller.js";
const router = Router();

router.route("/search/:searchParams").get(searchUsers); // Search users
router.route("/friends").get(authenticateJWT, getFriends); // Get friend list
router.route("/:userId").get(authenticateJWT,getUsers); // Get user
router.route("/friends/:targetId").delete(authenticateJWT, unfriend); // Unfriend

export default router;

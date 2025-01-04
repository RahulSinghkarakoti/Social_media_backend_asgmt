import { Router } from "express";
import { authenticateJWT } from "../middleware/auth.middleware.js";
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendRequests,
} from "../controllers/friends.controller.js";
const router = Router();

router.route("/requests/:userId").post(authenticateJWT, sendFriendRequest);
router.route("/requests").get(authenticateJWT, getFriendRequests);
router.route("/requests/accept/:requestId").put(authenticateJWT, acceptFriendRequest);
router
  .route("/requests/delete/:requestId")
  .delete(authenticateJWT, rejectFriendRequest);


export default router;

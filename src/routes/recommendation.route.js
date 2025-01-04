import { Router } from "express";
import { authenticateJWT } from "../middleware/auth.middleware.js";
import { recommendFriends, recommendByInterests } from "../controllers/recommendation.controller.js";
const router = Router();


router.route('/recommendfriends/:userId').get(authenticateJWT, recommendFriends); //id of friend or any user to recommned mutual friends
router.route('/interests').get(authenticateJWT, recommendByInterests);

 export default router; 
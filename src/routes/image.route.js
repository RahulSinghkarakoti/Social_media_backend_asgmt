import e, { Router } from "express";
import { authenticateJWT } from "../middleware/auth.middleware.js";
import uploadMiddleware  from "../middleware/upload.middleware.js";
import { handleImageUploade } from "../controllers/upload.controller.js";
 
const router=Router()

router.route('/upload').post(authenticateJWT,uploadMiddleware.fields([
    {name: 'image', maxCount: 10}
]),handleImageUploade);

export default router;
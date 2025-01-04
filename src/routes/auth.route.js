 
import  {Router} from 'express';
import {signup,login,getProfile,refreshAccessToken} from '../controllers/auth.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';
const router =  Router();

router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/me').get(authenticateJWT, getProfile);
router.route('/refresh-token').post(refreshAccessToken)

export default router;

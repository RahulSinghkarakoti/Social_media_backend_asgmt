import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken"

export const authenticateJWT = asyncHandler(async(req, res , next) => {
   console.log("in middleware")
   console.log(`Middleware triggered on path: ${req.originalUrl}`);
   try {
     const token=req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "");
     if(!token)   throw new ApiError(401,"unauthorized");

 
     const decodedToken= jwt.verify(token ,process.env.JWT_SECRET);
    const user=await User.findById(decodedToken._id).select('-password -refreshToken');
    if(!user)  throw new ApiError(401,"Invalid accesstoken ");
    req.user=user;
    next();
   } catch (error) {
      console.error("JWT Authentication Error:", error.message);
      return res.status(401).json({ message: error.message });
   }
})
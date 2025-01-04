import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken"

export const authenticateJWT = asyncHandler(async(req, _ , next) => {
   console.log("in middleware")
   try {
     const token=req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "");
     if(!token)   throw new ApiError(401,"unauthorized");

 
    const decodedToken= jwt.verify(token ,process.env.JWT_SECRET);
    const user=await User.findById(decodedToken._id).select('-password -refreshToken');
    if(!user)  throw new ApiError(401,"Invalid accesstoken ");
    req.user=user;
    next();
   } catch (error) {
      throw new ApiError(401,"Invalid accesstoken");

   }
})
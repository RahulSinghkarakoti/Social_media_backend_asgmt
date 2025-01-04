import Recommendation from "../models/recommendation.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import Friend from "../models/friend.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

const recommendFriends=asyncHandler(async(req,res)=>{
    console.log("in recommend function")
    //userId is the id of friends whose friends will be suggested to us.
    const {userId}=req.params;
    const user=await User.findById(userId);
    if(!user) throw new ApiError(404,"User not found");

    //get all the friends of target userId 
    const friends=await Friend.find({userId1:user._id});
    // get mutual friends
    const friendsIds=friends.map(friend=>friend.userId2);
    //get the names of mutual friend
    const mutualFriends=await User.find({_id:{$in:friendsIds}}).select("_id username");
    
    

    return res.status(200).json(new ApiResponse(200,"Friends recommended successfully",mutualFriends));

    
     
})

const recommendByInterests=asyncHandler(async(req,res)=>{
   
})

export {recommendFriends,recommendByInterests}


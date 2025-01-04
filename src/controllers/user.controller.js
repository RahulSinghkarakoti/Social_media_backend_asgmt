import mongoose from "mongoose";
import Friend from "../models/friend.model.js";
import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { MongoOIDCError } from "mongodb";

const getUsers = asyncHandler(async (req, res) => {//get the user info  like name, friends, email
  console.log("getUser funtion");
  //to do 
  //get user info
  //count the no. of doc in friend model with userId1 = searched userId
  //return user info + friendcount

  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    if (!user) return new ApiError(404, "User not found");
  
    const friendsCount = await Friend.countDocuments({ userId1: userId });
  
    return res.status(200).json(
      new ApiResponse(200, "user fetched successfully", {
        friendsCount,
        user,
      })
    );
  
    
  } catch (error) {
    
  } throw new ApiError(
    500,
    error.message || "Internal server error || getUsers route",
    error
  );
});

const searchUsers = asyncHandler(async (req, res) => {
  //to do
  //get search parms
  //serch in User model for similar names
  //return all matched names
    const { searchParams } = req.params;

  try {
    const result = await User.find({
      username: {
        $regex: searchParams,
        $options: "i",
      },
    }).select("username ");
  
    return res.status(200).json(new ApiResponse(200, "search success", result));
  } catch (error) {
    throw new ApiError(
        500,
        error.message || "Internal server error || searchUsers route",
        error
      );
  }
});

const getFriends = asyncHandler(async (req, res) => {

    //todo 
    //get current user id
    //fetch the friends of user with name and id
    //return fetched info
    const { _id } = req.user;
  try {
    const user = await User.findById(_id);
    if (!user) new ApiError(400, "user not found");
  
    const friends = await Friend.aggregate([
      {
        $match: {
          $or: [{ userId1: _id }, { userId2: _id }],
        },
      },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "userId2",
          as: "friend",
        },
      },
      {
        $project: {
          friends: {
            _id: 1,
            username: 1,
          },
        },
      },
    ]);
  
    return res
      .status(200)
      .json(new ApiResponse(200, "friends fetch success", friends));
  } catch (error) {
    throw new ApiError(
        500,
        error.message || "Internal server error || getFriends route",
        error
      );
  }
});

const unfriend = asyncHandler(async (req, res) => {

    //to do
    //get target user from param
    //delete instence from friend model where me and target are friend
    //return delted instence

  const { targetId } = req.params;
  const { _id } = req.user;
 try {
     const targetUser=await User.find(targetId)
     if (!targetUser) new ApiError(400, "user not found");
   
     const deleteFriend = await Friend.findByIdAndDelete({
       $and: [{ userId1: _id }, { userId2: targetId }],
     });
     if (!deleteFriend) new ApiError(500, "failed to unfried");
   
     return res
       .status(200)
       .json(new ApiResponse(200, "friends deletion success", deleteFriend));
 } catch (error) {
    throw new ApiError(
        500,
        error.message || "Internal server error || unfriend route",
        error
      );
 }
});

export { getUsers, searchUsers, getFriends, unfriend };

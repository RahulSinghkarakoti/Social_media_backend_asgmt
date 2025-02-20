import mongoose from "mongoose";
import Friend from "../models/friend.model.js";
import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { MongoOIDCError } from "mongodb";
import Image from "../models/image.model.js";

const getUsers = asyncHandler(async (req, res) => {
  //get the user info  like name, friends, email,images
  console.log("getUser funtion");
  //to do
  //get user info
  //count the no. of doc in friend model with userId1 = searched userId
  //return user info + friendcount

  const { userId } = req.params;
  // console.log(userId);
  const user = await User.findById(userId).select("-password -refreshToken");
  if (!user) return new ApiError(404, "User not found");
  // console.log(user);
  const friendsCount = await Friend.countDocuments({ userId1: userId });
  // console.log(friendsCount);
  const isExistingFriend = await Friend.exists({
    userId1: req.user._id,
    userId2: userId,
  });
  // console.log(isExistingFriend)
  return res.status(200).json(
    new ApiResponse(200, "user fetched successfully", {
      friendsCount,
      user,
      isExistingFriend: !!isExistingFriend,
    })
  );
});

const searchUsers = asyncHandler(async (req, res) => {
  //to do
  //get search parms
  //serch in User model for similar names
  //return all matched names
  console.log("searchUsers");

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
  console.log("getFriends");
  const { _id } = req.user;
  try {
    const user = await User.findById(_id);
    if (!user) throw new ApiError(400, "user not found");

    const friends = await Friend.aggregate([
      {
        $match: {
          userId1: new mongoose.Types.ObjectId(_id),
          // $or: [
          //   { userId2: new mongoose.Types.ObjectId(_id) }
          // ]
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId2",
          foreignField: "_id",
          as: "user2",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId1",
          foreignField: "_id",
          as: "user1",
        },
      },
      {
        $project: {
          friend: {
            $cond: {
              if: { $eq: ["$userId1", new mongoose.Types.ObjectId(_id)] },
              then: { $arrayElemAt: ["$user2", 0] },
              else: { $arrayElemAt: ["$user1", 0] },
            },
          },
        },
      },
      {
        $project: {
          _id: "$friend._id",
          username: "$friend.username",
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
  console.log("unfriend");
  const { targetId } = req.params;
  const { _id } = req.user;
  // console.log("user=>", _id);
  // console.log("target =>", targetId);
  try {
    const targetUser = await User.find({ _id: targetId });
    if (!targetUser) new ApiError(400, "user not found");

     
    const deleteFriend = await Friend.deleteOne({
      userId1: _id,
      userId2: targetId,
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

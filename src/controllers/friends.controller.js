import Friend from "../models/friend.model.js";
import FriendRequest from "../models/friendrequest.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const sendFriendRequest = asyncHandler(async (req, res) => {
  //to do
  //get the recipient -> userId from params
  //validate recipient id
  //check for existing friend
  //create friend request instence with status="pending"
  //return the request info
  const { userId } = req.params;
  const { user } = req;
  if (String(user._id) === userId)
    throw new ApiError(400, "You cannot send friend request to yourself");
  try {
    const friendExists = await Friend.findOne({
      userId1: user._id,
      userId2: userId,
    });
    if (friendExists) throw new ApiError(400, "Friend request already exists");

    const friendRequest = await FriendRequest.create({
      senderId: user._id,
      receiverId: userId,
      status: "pending",
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, "Friend request sent successfully", friendRequest)
      );
  } catch (error) {
    throw new ApiError(
      500,
      error.message || "Internal server error || sendFriendRequest route",
      error
    );
  }
});

const acceptFriendRequest = asyncHandler(async (req, res) => {
  console.log("accept friend request");
  //to do
  //get the request id from params
  //update the request status ="accepted"
  //add both friend of each other in friend model

  const { requestId } = req.params;
  const { user } = req;
  try {
    const friendRequest = await FriendRequest.findOneAndUpdate(
      { _id: requestId },
      { status: "accepted" },
      {
        new: true,
      }
    );
    if (!friendRequest) throw new ApiError(400, "Friend request not found");

    await Friend.create({ userId1: user._id, userId2: friendRequest.senderId });
    await Friend.create({ userId1: friendRequest.senderId, userId2: user._id });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Friend request accepted successfully",
          friendRequest
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      error.message || "Internal server error || acceptFriendRequest route",
      error
    );
  }
});

const rejectFriendRequest = asyncHandler(async (req, res) => {
  console.log("in delete request");
  //to do
  //get request id from prams
  //update request status="rejected"
  //return request info

  const { requestId } = req.params;
  try {
    const friendRequest = await FriendRequest.findOneAndUpdate(
      { _id: requestId },
      { status: "rejected" },
      {
        new: true,
      }
    );
    if (!friendRequest) throw new ApiError(400, "Friend request not found");


    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Friend request rejected successfully",
          friendRequest
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      error.message || "Internal server error || rejectFriendRequest route",
      error
    );
  }
});
const getFriendRequests = asyncHandler(async (req, res) => {
  //to do
  //fetch all the request the user received and have status="pending"
  const { user } = req;
  try {
    const friendRequests = await FriendRequest.find({
      receiverId: user._id,
      status: "pending",
    });
  
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Friend requests fetched successfully",
          friendRequests
        )
      );
  } catch (error) {
    
  }
});

export {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendRequests,
};

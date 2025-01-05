import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import Friend from "../models/friend.model.js";
import {ApiResponse} from "../utils/apiResponse.js"
import FriendRequest from "../models/friendrequest.model.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    // console.log(error);
    throw new ApiError(500, "Failed to generate access and refresh token");
  }
};

const signup = asyncHandler(async (req, res) => {
  //to do
  //get user credentials and validate
  //check for existing user
  //create user
  //genrate access and refresh token
  //return the new created user with the tokens
  const { username, email, password } = req.body; 
  // console.log(username,email,password)

  if (!username || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

 try {
   const existingUser = await User.findOne({
     $or: [{ email }, { username }],
   });
   if (existingUser)
     return res.status(400).json({ message: "User already exists" });
 
   const user = await User.create({ username, email, password }) 
 
   if (!user) throw new ApiError(500, "Failed to create user");
 
   const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
     user._id
   );
 
   return res
     .status(201)
     .cookie("refreshToken", refreshToken, {
       httpOnly: true,
       secure: true,
       sameSite: "strict",
     })
     .cookie("accessToken", accessToken, {
       httpOnly: true,
       secure: true,
       sameSite: "strict",
     })
     .json(
       new ApiResponse(201, "User created successfully", {
         accessToken,
         refreshToken,
         user,
       })
     );
 } catch (error) {
  throw new ApiError(500, error.message || " Internal server error || SignUp route",error)
 }
});

const login = asyncHandler(async (req, res) => {
  //to do 
  //get user credentils and validate
  //compare password
  //return logged user data except password and refreshtoken
  const { username, password } = req.body;
  // console.log(username,password)

  if (!username || !password)
    return new ApiError(400, "All fields are required");

  
    const user = await User.findOne({ username });
    // console.log(user)
    if (!user) {
      // console.log("user not found")
      throw new ApiError(401, "User not found");
     }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) throw new ApiError(401, "Invalid password");
  
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );
  
    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
     
  
    return res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .json(
        new ApiResponse(200, "Login successful", {loggedInUser,accessToken} )
      );

  
});

const getProfile = asyncHandler(async (req, res) => {
  //to do
  //get current user 
  //fetch user data from DB 
  //count no. of friends and request
  //return profile
  const user = await User.findById(req.user._id).select(
    "-password -refreshToken"
  );
  if (!user) return new ApiError(404, "User not found");

  const friends = await Friend.countDocuments( { userId1: user._id } );

  // const friendRequestsSent = await Friend.countDocuments({
  //   userId1: user._id, // User is the sender
  // });
  const friendRequestsSent=await FriendRequest.countDocuments({
    senderId:req.user._id,
    status:"pending"
  })

  return res
  .status(200)
  .json(new ApiResponse(200,"Profile fetched successfully",{user,friends,friendRequestsSent}));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  //console.log("in refersh token");
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_SECRET
    );
    const user = await User.findById(decodedToken._id);

    if (!user) throw new ApiError(401, "Invalid refresh token");

    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );


    res
      .status(200)
      .cookie("accessToken", accessToken, { httpOnly: true, secure: true })
      .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true })
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(
      401,
      error.message || "Invalid or expired refresh token",
      error
    );
  }
});

export { signup, login, getProfile, refreshAccessToken };

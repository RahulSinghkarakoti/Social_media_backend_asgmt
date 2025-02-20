import Image from "../models/image.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const handleImageUploade = asyncHandler(async (req, res) => {
  //upload the images
  //store it in DB
  try {
    const files = req.files;
    console.log(files.image);

    const result = await Promise.all(
      files.image.map(async (item) => {
        const image = item.path;

        const uplodedImage=await uploadOnCloudinary(image);
        return uplodedImage.url;
      })
    );
    console.log(result)

    const existingUserImages = await Image.findOne({ userId: req.user._id });
    if (existingUserImages) {
        console.log("in existing image")
      existingUserImages.images.push(...result);
      await existingUserImages.save();
      return res
        .status(200)
        .json(new ApiResponse(200, "images uploaded successfully", {}));
    }
    console.log("in new image")

    const newUserImages = await Image.create({
      userId: req.user._id,
      images: result,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, "images uploaded successfully", {}));
  } catch (error) {
    throw new ApiError(
      401,
      error.message || "Invalid or expired refresh token",
      error
    );
  }
});

export { handleImageUploade };

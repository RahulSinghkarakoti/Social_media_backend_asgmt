import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  images: {
    type: Array,
    required: false,
    default: [],
  },
},{timestamps:true});

const Image=mongoose.model('Image',imageSchema)
export default Image;

import mongoose from "mongoose";
const friendSchema= new mongoose.Schema({
    userId1:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    userId2:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    }
}, {timestamps:true});

const Friend=mongoose.model('Friend',friendSchema);
export default Friend;
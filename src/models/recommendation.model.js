import mongoose from "mongoose";
const recommendationSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    recommendationsIds:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:'User',
        default:[],
    },
   
}, {timestamps:true});

const Recommendation=mongoose.model('Recommendation',recommendationSchema);
export default Recommendation;
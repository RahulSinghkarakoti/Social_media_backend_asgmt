import dotenv from "dotenv";
import { app } from "./app.js";
import mongoose from 'mongoose';

dotenv.config({
    path: "./.env"
}); 

 
 

const connectDB=async ()=>{
   
    try {
       const connectionInstance = await mongoose.connect(`${process.env.MONOGO_URI}/${process.env.DB_NAME}`)
       console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`)

    } catch (error) {
        console.log("MONGODB connection FAILED:",error);
        process.exit(1)
    }
}

connectDB()
.then(()=>{
    app.listen(process.env.PORT ||3000,()=>{
        console.log(`server is running at port :${process.env.PORT}`)
    })
})
.catch((err)=>console.log("MONGO DB connection Failed :: src/index.js",err))
 
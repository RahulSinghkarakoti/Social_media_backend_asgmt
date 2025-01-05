import express  from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import authRouter from "./routes/auth.route.js"
import userRouter from "./routes/user.route.js"
import reccomendationRouter from "./routes/recommendation.route.js"
import friendsRouter from "./routes/friends.route.js"
const app=express()

//use method is used to implement midelwears (cors,cookieparse)
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,
}))
 
app.use(express.urlencoded({   
extended:true//used to send nestedd object ........ not necesary
,limit:'16kb'
}))
 
app.use(bodyParser.json());

app.use(cookieParser());//use to perform CRUD operation on cookies_at user device
app.use(express.text());
//routes declaration
app.get('/api/v1',(req,res)=>{
    res.send('welcome to social media api')
})
app.use('/api/v1/auth',authRouter) 
app.use('/api/v1/users',userRouter) 
app.use("/api/v1/reccomendation", reccomendationRouter)
app.use("/api/v1/friends", friendsRouter)


export {app}
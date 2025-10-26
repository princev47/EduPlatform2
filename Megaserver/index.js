import express from 'express';
const app = express();

 import userRoutes from "./routes/userRoutes.js";
// import courseRoutes from "./routes/courseRoutes.js";
 import profileRoutes from "./routes/userRoutes.js";
// import paymentRoutes from "./routes/paymentRoutes.js"; 
 
 import { connectDb } from './config/database.js';
 import cookieParser from 'cookie-parser';
 import cors from 'cors';

 import { connectCloud } from './config/cloudinary.js';
 import fileUpload from 'express-fileupload';
 import dotenv from 'dotenv';
 dotenv.config();

 const PORT = process.env.PORT || 5000;
    app.use(express.json());
    app.use(cookieParser());
    app.use(cors({  
        origin: process.env.FRONTEND_URL,
        methods:["GET","POST","PUT","DELETE"],
        credentials:true,  //agar frontend se cookie bhejni hai toh yeh true krna padega
    }))
    app.use(fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp/"
    }))

    connectCloud();
    connectDb();
    app.use("/api/v1/user",userRoutes);
    ;
   

    app.get("/",(req,res)=>{
        res.status(200).json({
            success:true,
            message:"Welcome to Mega Server"
        })
    })
    app.listen(PORT,()=>{
        console.log(`Server is working on http://localhost:${PORT}`);
    })  
     


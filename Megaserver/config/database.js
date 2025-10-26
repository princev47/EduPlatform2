import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config();

const connectDb = async()=>{
  await mongoose.connect(process.env.MONGODB_URL)
   .then(()=>{
   console.log("DB connected successfully")
}).catch((error)=>{
    console.log("Db issues")
    console.error(error)
    process.exit(1);
})
}

export{connectDb}

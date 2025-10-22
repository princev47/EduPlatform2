import mongoose from "mongoose";

const SubSection = new mongoose.Schema({
   title:{
    type:String,
   },
   timeDuration :{
    type:String,
   },
   description:{
    type:String
   },
   videoUrl:{
    type:String,
   }

})

export default mongoose.model("SubSection",SubSection)
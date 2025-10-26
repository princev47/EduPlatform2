import mongoose from "mongoose";
 

const Section = new mongoose.Schema({
  
    sectionName:{
        type:String,
    },
    subSection:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"SubSection",
      //:"true"
    }]

})

export default mongoose.model("Section",Section)
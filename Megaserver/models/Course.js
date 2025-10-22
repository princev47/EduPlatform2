import e from "express";
import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({

     courseName:{
        type:String,
        required:true,
        trim:true
     },
     courseDescription:{
        type:String
     },

     instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
     },

     whatYouWillLearn:{
       type:String,
       required:true
     },

     courseContent:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Section"
     }],

     ratingAndReviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"RatingAndReview"
     }],
     price:{
        type:Number,
     },
     thumbnail:{
        type:String,
     },
     tag:{
       type:mongoose.Schema.Types.ObjectId,
       ref:"Tag"
     },

     studentsEnrolled:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
     }]

})
 

   export default mongoose.model("Course", courseSchema)
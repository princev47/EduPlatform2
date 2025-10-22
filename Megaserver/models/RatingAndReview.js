// models/RatingAndReview.js
import mongoose from "mongoose"

const ratingAndReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  review: {
    type: String,
    trim: true,
  },
}, { timestamps: true })

const RatingAndReview = mongoose.model("RatingAndReview", ratingAndReviewSchema)
export default RatingAndReview

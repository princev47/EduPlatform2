import mongoose from "mongoose"

const courseProgressSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  completedVideos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubSection", // each lesson/lecture in your course
    },
  ],
  progress: {
    type: Number,
    default: 0, // percentage (0–100)
  },
  completed: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true })

export default mongoose.model("CourseProgress", courseProgressSchema)

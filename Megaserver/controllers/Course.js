import e from "express";
import Course from "../models/Course.js";
import tags from "../models/tags.js";
import user from "../models/user.js";
import { uploadImageToloudinary } from "../utils/imageUploader.js";
import RatingAndReview from "../models/RatingAndReview.js";

// create courseHandler Function
 const createCourse = async(req,res)=>{
    try {
       const{courseName, courseDescription, whatYouWillLearn, price} =req.body
       
       //get thumbnail
       const thumbnail = req.files.thumbnailImage;
       console.log(thumbnail)

       //validation
     if(!courseName||!courseDescription||!whatYouWillLearn||!price){
        return res.status(400).json({
            success:false,
            message:"all fields are required"
        })
     }
     
      const userId = req.user.id;
      const instructorDetails = await user.findById(userId)

      if(!instructorDetails){
        return res.status(404).json({
            success:false,
            message:"instructor not found"
        })
      }
      // check tag validation
      // const tagDetails = await tags.findById(tag);
      // if(!tagDetails){

      //    return res.status(404).json({
      //       success:false,
      //       message:"tagDetails not found"
      //   })
      // }

      // upload image to cloudinary
       const thumbnailImage= await uploadImageToloudinary(thumbnail,process.env.FOLDER_NAME)

      //Create a new entry for new course
       const newCourse = await Course.create({
        courseName,
        courseDescription,
        instructor:instructorDetails._id,
        whatYouWillLearn:whatYouWillLearn,
        price,
        //tag:tagDetails._id,
        thumbnail:thumbnailImage.secure_url
       })

       // add the new course to the user schema of Instructor
        const User= await user.findByIdAndUpdate({
            _id:instructorDetails._id
         },{
          $push : {
            courses:newCourse._id
          }
    },
        {new:true});

        // update the tag schema
     // await tags.findByIdAndUpdate({_id:tagDetails._id},{$push:{course:newCourse._id}},{new:true})

      return res.status(200).json({
  success: true,
  message: "Course created successfully",
  courseId: newCourse._id,   // ✅ easy to grab
  course: newCourse,         // optional, full course details
  //instructor: User           // optional, updated instructor
})

    } catch (error) {
       return res.status(500).json({
        success:false,
        message:error.message,
       })
    }
 }

  export{createCourse}


  const showAllCourses = async(req,res)=>{
    try {
      const allCourses = await Course.find({},{
        courseName:true,
        price:true,
        thumbnail:true,
        instructor:true,
        ratingAndReviews:true,
        studentsEnrolled:true,
        courseDescription:true
      }).populate("instructor", "firstName").exec();

      console.log(allCourses)

      return res.status(200).json({
        success:true,
        message:"Data founded successfully",
        data:allCourses
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        success:false,
        message:"Cannot Fetch Course Data",
        error:error.message
      })
    }
  }
  export {showAllCourses}


  const showCourseDetails = async (req, res) => {
  try {
    let { courseId } = req.params;

    // ✅ sanitize
    if (typeof courseId === "string") {
      courseId = courseId.trim();
    }

    // ✅ validate ObjectId format
    if (!courseId || !courseId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid CourseId format",
      });
    }

    const courseDetails = await Course.findById(courseId)
      .populate({
        path: "instructor",
        populate: { path: "additionalDetails" },
      })
      .populate("tag")
      //.populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: { path: "subSection" },
      })
      .exec();

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "CourseDetails not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "CourseDetails found successfully",
      data: courseDetails,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Cannot fetch courseDetails",
      error: error.message,
    });
  }
};
        
  export {showCourseDetails}

  // Get all courses of the logged-in instructor
// Get all courses of the logged-in instructor
export const getInstructorCourses = async (req, res) => {
  try {
    const instructorId = req.user.id // ✅ from auth middleware

    const courses = await Course.find({ instructor: instructorId })
      .populate("studentsEnrolled")
      .populate("ratingAndReviews") // if ratings are in a separate model
      .exec()

    // aggregate stats
    const totalCourses = courses.length
    const totalStudents = courses.reduce(
      (sum, c) => sum + (c.studentsEnrolled?.length || 0),
      0
    )
    const totalRevenue = courses.reduce(
      (sum, c) =>
        sum + ((c.studentsEnrolled?.length || 0) * (c.price || 0)),
      0
    )
    const totalRatings = courses.reduce(
      (sum, c) =>
        sum +
        (c.ratingAndReviews?.reduce((s, r) => s + (r.rating || 0), 0) || 0),
      0
    )
    const ratingCount = courses.reduce(
      (sum, c) => sum + (c.ratingAndReviews?.length || 0),
      0
    )
    const averageRating =
      ratingCount > 0 ? (totalRatings / ratingCount).toFixed(1) : "0.0"

    return res.status(200).json({
      success: true,
      data: {
        courses,
        stats: {
          totalCourses,
          totalStudents,
          totalRevenue,
          averageRating,
        },
      },
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Failed to fetch instructor courses",
    })
  }
}

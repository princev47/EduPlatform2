import RatingAndReview from "../models/RatingAndReview";
import Course from "../models/Course";
import user from "../models/user";

const createRating = async(req,res)=>{
    try {
        const {rating, review, courseId} = req.body;
        const userId = req.user.id;

        // check if the user is enrolled in the course before submitting a review
        const enrolledCourse = await Course.findOne({_id:courseId, studentsEnrolled: {$elemMatch: {$eq: userId}}});

        if(!enrolledCourse){
            return res.status(403).json({
                success:false,
                message:"You are not enrolled in this course"
            })
        }

        // check if the user has already submitted a review for the course
        const alreadyReviewed = await RatingAndReview.findOne({user:userId, course:courseId});

        if(alreadyReviewed){
            return res.status(403).json({
                success:false,
                message:"You have already submitted a review for this course"
            })
        }

        // create a new rating and review
        const newRatingAndReview = await RatingAndReview.create({
            user:userId,
            rating,
            review,
            course:courseId
        });

        // add the rating and review to the course
        await Course.findByIdAndUpdate({_id:courseId},{$push:{ratingAndReviews:newRatingAndReview._id}},{new:true});

        return res.status(200).json({
            success:true,
            message:"Rating and Review added successfully",
            data:newRatingAndReview
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Unable to add rating and review",
            error:error.message
        })
    }
}

export {createRating}

 const getAverageRating = async(req,res)=>{
    try {
        const {courseId} = req.body;

        // fetch all ratings and reviews for the course
        const ratingAndReviews = await RatingAndReview.find({course:courseId});     
        let averageRating = 0;
        if(ratingAndReviews.length > 0){
            const totalRating = ratingAndReviews.reduce((acc, curr) => acc + curr.rating, 0);
            averageRating = totalRating / ratingAndReviews.length;
        }
        return res.status(200).json({
            success:true,
            message:"Average rating fetched successfully",
            data:averageRating
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Unable to fetch average rating",
            error:error.message
        })
    }
    }
export {getAverageRating} 

const getAllRatingAndReviews = async(req,res)=>{
    try {
        const {courseId} = req.body;

        // fetch all ratings and reviews for the course
        const ratingAndReviews = await RatingAndReview.find  ({course:courseId})
                                  .sort({rating:"desc"})
                                  .populate({
                                    path:"user",
                                    select:"firstName lastName email image"
                                  })
                                  .populate({
                                    path:"course",
                                    select:"courseName"
                                  }).exec();

        return res.status(200).json({
            success:true,
            message:"Rating and Reviews fetched successfully",
            data:ratingAndReviews
        })
    } catch (error) {
        console.log(error); 
        return res.status(500).json({
            success:false,
            message:"Unable to fetch rating and reviews",
            error:error.message
        })  
    }
}

export {getAllRatingAndReviews}

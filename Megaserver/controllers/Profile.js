import Profile from "../models/Profile.js";
import User from "../models/user.js" 
import Course from "../models/Course.js";
const updateProfile = async(req,res)=>{
   try{
    const{dateOfBirth='',about='', contactNumber,gender} =req.body;
     const id = req.user.id;
    if(!contactNumber||!gender||!id){
        return res.status(400).json({
            success:false,
            message:"Incomplete data"
        })
    }
    const userDetails = await User.findById(id);
    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findByIdAndUpdate(profileId,{
        dateOfBirth:dateOfBirth,        
        about:about,
        contactNumber:contactNumber,
        gender:gender  },{new:true})
        
        return res.status(200).json({
        success:true,
        message:"Profile updated successfully",
        data:profileDetails 
        })
    }
 catch(error){
    return res.status(500).json({
        success:false,
        message:error.message
    })
   } 
}

export {updateProfile}

// update profile pic

 const deleteAccount = async(req,res)=>{
    try {
        const id = req.user.id;
        
        
        const userDetails = await User.findById(id);
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
        // delete profile
        const profileId = userDetails.additionalDetails;
        await Profile.findByIdAndDelete(profileId);
        // delete user
        await User.findByIdAndDelete(id);
        // unenroll from all courses - to be implemented    
        const enrolledCourses = userDetails.courses;
        for(let i=0;i<enrolledCourses.length;i++){
            const courseId = enrolledCourses[i];
            // pull user from course's studentsEnrolled array
            await Course.findByIdAndUpdate(courseId,{
                $pull:{studentsEnrolled:id}
            })
        }
        return res.status(200).json({
            success:true,
            message:"User deleted successfully"
        })
    } catch (error) {
      return res.status(500).json({
         success:false,
        message:error.message
      })  
    }
}

export{deleteAccount}

const getAllUserDetails = async(req,res)=>{
    try {
        const id = req.user.id;
        const userDetails = await User.findById(id).populate("additionalDetails").exec()
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
        return res.status(200).json({
            success:true,
            message:"User details fetched successfully",
            data:userDetails
        })
    } catch (error) {
      return res.status(500).json({
         success:false,
        message:error.message
      })  
    }

}
export{getAllUserDetails}   

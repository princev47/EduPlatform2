import Section from "../models/Section.js";
import Course from "../models/Course.js"
import SubSection from "../models/SubSection.js";
const createSection = async(req,res)=>{
    try {
        const{sectionName,courseId} = req.body;
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:"Incomplete data"
            })
        }
        // create entry in db
        const sectionDetails = await Section.create({sectionName:sectionName})
        console.log(sectionDetails)

        // update course with this section id
        const courseDetails = await Course.findByIdAndUpdate(courseId,{
            $push:{courseContent:sectionDetails._id}
        },{new:true}).populate({
        path: "courseContent", // populate all sections
        populate: {
          path: "subSection", // populate subsections inside each section
        },
      })
      .exec();

        return res.status(200).json({
            success:true,
            message:"Section created successfully",
            sectionDetails,
            courseDetails
        })
    } catch (error) {
      return res.status(500).json({
         success:false,
        message:error.message
      })  
    }
 }
 export{createSection}

  const allSections = async(req,res)=>{
    try {
      const allSections = await Section.find({},{sectionName:true,subSection:true})
      res.status(200).json({
        success:true,
        message:"All sections returned",
        allSections
      })
    } catch (error) {
         return res.status(500).json({
         success:false,
        message:error.message
      })   
    }
  }

  export{allSections}

  const updateSection = async(req,res)=>{
    try {
        const{sectionId,sectionName} = req.body;
        if(!sectionId || !sectionName){
            return res.status(400).json({
                success:false,
                message:"Incomplete data"
            })
        }
        // update entry in db
        const sectionDetails = await Section.findByIdAndUpdate(sectionId,{
            sectionName:sectionName
        },{new:true})
        console.log(sectionDetails)

        return res.status(200).json({
            success:true,
            message:"Section updated successfully",
            sectionDetails
        })
    } catch (error) {
      return res.status(500).json({
         success:false,
        message:error.message
      })  
    }
}
export{updateSection}
 
const deleteSection = async(req,res)=>{
    try {
        const{sectionId,courseId} = req.body // req.params -> /:sectionId/:courseId;
        if(!sectionId || !courseId){
            return res.status(400).json({
                success:false,
                message:"Incomplete data"
            })
        }
        // delete entry in db
        const sectionDetails = await Section.findByIdAndDelete(sectionId)
        console.log(sectionDetails)

        // update course with this section id
        const courseDetails = await Course.findByIdAndUpdate(courseId,{
            $pull:{courseContent:sectionDetails._id}
        },{new:true})
        
        return res.status(200).json({
            success:true,
            message:"Section deleted successfully",
            sectionDetails,
            courseDetails
        })  
    } catch (error) {
      return res.status(500).json({
         success:false,
        message:error.message
      })    

    }
}
export{deleteSection}


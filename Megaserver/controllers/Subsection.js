import SubSection from '../models/SubSection.js';
import Section from '../models/Section.js'; 
import { uploadImageToloudinary } from '../utils/imageUploader.js';

const createSubSection = async(req,res)=>{
   //fetch data from req body
   //extract file/video
   //upload video  to cloudinary
   //create entry in subsection collection
   //update section with this subsection id
   //return response
    try {
        const{title,description,timeDuration,sectionId} = req.body;
        const video = req.files.videoFile;
        if(!title || !description || !timeDuration || !sectionId || !video){
            return res.status(400).json({
                success:false,
                message:"Incomplete data"
            })
        }
        // upload video to cloudinary
        const videoUrl = await uploadImageToloudinary(video,process.env.FOLDER_NAME)
        console.log(videoUrl)

        // create entry in subsection collection
        const subSectionDetails = await SubSection.create({
            title:title,
            description:description,
            timeDuration:timeDuration,
            videoUrl:videoUrl.secure_url
        })
        console.log(subSectionDetails)

        // update section with this subsection id
        const sectionDetails = await Section.findByIdAndUpdate(sectionId,{
            $push:{subSection:subSectionDetails._id}
        },{new:true}).populate("subSection")
        
        return res.status(200).json({
            success:true,
            message:"SubSection created successfully",
            subSectionDetails,
            sectionDetails
        })
    } catch (error) {
      return res.status(500).json({
         success:false,
        message:error.message
      })  
    }    
}

export {createSubSection}

const updateSubSection = async(req,res)=>{
    try {
        const{subSectionId,title,description,timeDuration} = req.body;
        if(!subSectionId || !title || !description || !timeDuration){
            return res.status(400).json({
                success:false,
                message:"Incomplete data"
            })
        }
        // update entry in subsection collection
        const subSectionDetails = await SubSection.findByIdAndUpdate(subSectionId,{
            title:title,
            description:description,
            timeDuration:timeDuration
        },{new:true})
        
        return res.status(200).json({
            success:true,
            message:"SubSection updated successfully",
            subSectionDetails
        })
    } catch (error) {
      return res.status(500).json({
         success:false,
        message:error.message
      })  
    }    
}
export {updateSubSection}

const deleteSubSection = async(req,res)=>{
    try {
        const {subSectionId,sectionId} = req.body;
        if(!subSectionId || !sectionId){
            return res.status(400).json({
                success:false,
                message:"Incomplete data"
            })
        }
        // delete entry from subsection collection
        const subSectionDetails = await SubSection.findByIdAndDelete(subSectionId)
        // remove reference from section collection
        const sectionDetails = await Section.findByIdAndUpdate(sectionId,{
            $pull:{subSection:subSectionId}
        },{new:true}).populate("subSection")
        
        return res.status(200).json({
            success:true,
            message:"SubSection deleted successfully",
            subSectionDetails,
            sectionDetails
        })
    } catch (error) {
      return res.status(500).json({
         success:false,
        message:error.message
      })  
    }    
}

export {deleteSubSection}
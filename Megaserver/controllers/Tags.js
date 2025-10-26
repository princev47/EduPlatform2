 import tags from "../models/tags";

 const createTag = async(req,res)=>{
    try {
         const{name,description} =req.body;
         if(!name||!description){
            return res.status(400).json({
                success:false,
                message:"Incomplete data"
            })
         }
     // create entry in db
     const tagDetails = await tags.create({name:name},{description:description})
     console.log(tagDetails)

     return res.status(200).json({
        success:true,
        message:"Tags created successfully"
     })
    } catch (error) {
      return res.status(500).json({
         success:false,
        message:error.message
      })  
    }
 }
 export{createTag}

  const allTags = async(req,res)=>{
    try {
      const allTags = await tags.find({},{name:true,description:true})
      res.status(200).json({
        success:true,
        message:"All tags returned",
        allTags
      })
    } catch (error) {
         return res.status(500).json({
         success:false,
        message:error.message
      })   
    }
  }

  export{allTags}

  // yeh galti se upar tags lihk diye but ab category ka code likhna hai
    
   

 import jwt from 'jsonwebtoken'
 import dotenv from 'dotenv'
 dotenv.config();
 import user from '../models/user.js';


//auth
const auth = async(req,res,next)=>{
    try {
      //authentication check krne k liye jsonwt verify?
      const token = req.cookies.token||req.body.token||req.header("Authorization").replace("Bearer ","")

      if(!token){
        return res.status(401).json({
            success:false,
            message:"Token is missing",   
        })
      }

      //verify the token
      try {
        const decode =  jwt.verify(token, process.env.JWT_SECRET);
        console.log(decode);
        req.user = decode;
      } catch (error) {
        // verification issue
        return res.status(401).json({
            success:false,
            message:'token is invalid'
        })
      }
         next();

    } catch (error) {
        return res.status(401).json({
            success:false,
            message:"something went wrong"
        })
    }
}

 export{auth}

//isStudent

  const isStudent = async(req,res,next)=>{
     try {
        if(req.user.accountType!=="Student"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for students only"
            })
        }
        next();
     } catch (error) {
        return res.status(500).json({
            success:false,
            message: 'User role cannot be verified'
        })
     }
  }

  export{isStudent}



//isInstructor

 const isInstructor = async(req,res,next)=>{
     try {
        if(req.user.accountType!=="Instructor"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Instructor only"
            })
        }
        next();
     } catch (error) {
        return res.status(500).json({
            success:false,
            message: 'User role cannot be verified'
        })
     }
  }


//isAdmin

export{isInstructor}


 const isAdmin = async(req,res,next)=>{
     try {
        if(req.user.accountType!=="Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for admin only"
            })
        }
        next();
     } catch (error) {
        return res.status(500).json({
            success:false,
            message: 'User role cannot be verified'
        })
     }
  }
  
  export{isAdmin}
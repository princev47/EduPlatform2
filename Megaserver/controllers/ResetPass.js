

import user from "../models/user.js";

import mailSender from "../utils/mailSender.js";
import bcrypt from 'bcrypt'
import crypto from 'crypto'
//resetPasswordToken
 
const resetPasswordToken = async(req,res)=>{
   try {
     //get email from req body
    const {email} = req.body
    //check usr for this email

    const euser = await user.findOne({email})
    if(!euser){
        return res.json({
            success:false,
            messsage:'Your email is not registered with us '
        })
    }
    //generate token

    const token = crypto.randomUUID()
    //update user by adding token and expiration time
    const updatedDetails =await user.findOneAndUpdate({email},
        {
            token:token,
            resetPasswordExpires:Date.now()+5*60*1000,
        },
        {new:true}
    )
    //create url
     const url = `http://localhost:5173/update-password/${token}`
    // send mail containing the url
    await mailSender(email, "Password Reset Link",`Password reset link ${url}`)
    //link to reset passwrord
      return res.json({
        success:true,
        message:"email sent successfully, reset the password"
      })
   
   } catch (error) {
     console.log(error)

     return res.status(500).json({
        success:false,
        message:"something went wrong while resetting the password"
      })
   }

}
export{resetPasswordToken}

 const resetPassword = async(req,res)=>{
   try {
     //data fetch token direct front end se aaega

    const{password, confirmPass, token} =req.body;
    //validation
    if(password!=confirmPass){
        return res.json({
            success:false,
            message:'Passwords are not matching'
        })
    }

    

    //user ki entry nikalne ke liye token ka use krenge cuz now we dont have the email for that
  const details = await user.findOne({
    token:token
  })

  if(!details){
    return res.json({
        success:false,
        message:"Invaild token"
    })
  }

  //token time check
   if(details.resetPasswordExpires<Date.now()){
    return res.json({
        success:false,
        message:"token is expired, please regenerate your password"
    })
   }

   const hashPass = await bcrypt.hash(password,10);

   await user.findOneAndUpdate({token:token},{password:hashPass},{new:true})
   
   return res.status(200).json({
    success:true,
    message:"reset password successful"
   })
   } catch (error) {
      res.status(500).json({
        success:false,
        message:"something went wrong"
      })
   }
 }


  export{resetPassword}

//resetPass
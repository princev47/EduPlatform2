 import user from "../models/user.js";
import Otp from "../models/Otp.js";
import bcrypt from 'bcrypt'
import otpGenerator from 'otp-generator'
import Profile from "../models/Profile.js";
import jwt from 'jsonwebtoken'
import mailSender from "../utils/mailSender.js";
import dotenv from 'dotenv'   
dotenv.config();

const sendOtp = async (req,res)=>{
    try {
        const{email}=req.body;
        //check if email already present or not
        const existingUser=await user.findOne({email})

        if(existingUser){
            return res.status(401).json({
                success:false,
                message:'User already present'
            })
        }
        // if user does not exist we have to generate otp
        var otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
        })

        let result = await Otp.findOne({otp:otp})
        while(result){
              otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
        })

        result = await Otp.findOne({otp:otp})
 
        }
        // unique otp has been generated successfully 
        const payload  = {email,otp}

        const info = await Otp.create(payload)
        console.log("yeh",info);

        return res.status(200).json({
            success:true,
            message:"Otp sent succcessfully",
            otp
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:"cant do what u want"
        })
    }
}
  export{sendOtp}
//sendOtp


//signup

 const signup = async(req,res)=>{
    try {
        //get all the details from the body
        const{email,
            firstName,
            lastName,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        } = req.body
      // validate kya kya imp cheez hai
      if(!email||!firstName||!lastName||!password||!confirmPassword||!otp){
        return res.status(400).json({
            success:false,
            message:"Enters all the details carefully"
        })
      }
      // check if password==confirmpass
      if(password!==confirmPassword){
        return res.staus.json({
            success:false,
            message:"Password and Confirm Pass do not match"
        })
      }
      //check if useralready present
      const exist  = await user.findOne({email})
      if(exist){
        return res.status(400).json({
            success:false,
            message:"User already exists"
        })
      }
      // match otp 
      const tempotp =await Otp.findOne({email}).sort({ createdAt: -1 }).limit(1);

      if(tempotp==null){
        return res.status(400).json({
            success:false,
            message:"Otp expired"
        })
      }
      else if(tempotp.otp!==otp){
        return res.status(400).json({
            success:false,
            message:'Enter Correct Otp'
        })
      }

      // as the otp match hash password

      let hashedpass =await bcrypt.hash(password,10)
      const profileDetails = await Profile.create({
        gender:null,
        dateOfBirth:null,
        about:null,
        contactNumber:null

      })
     const details = await user.create({
        firstName,
        email,
        password:hashedpass,
        accountType,
        additionalDetails:profileDetails._id,
        image:`https://api.dicebear.com/9.x/adventurer/svg?seed=${firstName}`

     })

     //return res
     return res.status(200).json({
        success:true,
        message:"user registered successfully",
        details
     })
    } catch (error) {
       return res.status(500).json({
        success:false,
        message:(error.message)
       }) 
    }
 }

export{signup}
     //signup check has been done working fine and sendotp also working fine.............../


  // lets write the login route

    const login = async(req,res)=>{
      try {
         const{email,password}= req.body; 
        //validation 
        if(!email||!password){
          return res.status(403).json({
            success:false,
            message:"Please Enter all the details"
          })
        }
        const Cuser = await user.findOne({email}).populate("additionalDetails");
      if(!Cuser){
        return res.status(401).json({
          success:false,
          message:"User is not regitered, please signup first"
        })
        
      }
      if(await bcrypt.compare(password,Cuser.password)){ 
        const payload = {
          email:Cuser.email,
          id: Cuser._id,
          accountType:Cuser.accountType,
        }
          const token = jwt.sign(payload, process.env.JWT_SECRET,{
             expiresIn:"2h",
          })
          Cuser.token = token;
          Cuser.password=undefined;
         // create cookie and send the response
         const options = {
          expires: new Date(Date.now()+3*24*60*60*1000),
          httpOnly :true
         }
         res.cookie("token", token,options).status(200).json({
          success:true,
          token,
          Cuser,
          message:'Logged in Successfully'
         }) 
        }
        else{
          return res.status(401).json({
            success:false,
            message:"password is correct"
          })
        }

      } catch (error) {
        console.log(error);
        return res.status(500).json({
          success:false,
          message:'Login failure please try again'
        })
      }
    }

    export{login}

    const changePassword = async(req,res)=>{
      //get data from req body
      // get old password, newPassword, confirmPss
      //validation
      //update pwd in db

      //send mail pass updated,

      //return
    }




















//login










//changepass







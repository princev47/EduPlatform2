import mongoose from "mongoose";
import mailSender from "../utils/mailSender.js";

const otpSchema = mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true,
    },
     createdAt: {
        type:Date,
        default:Date.now,
        expires:5*60,
       }
})
  // function-> to send mail
  async function sendVerificationEmail(email,otp){
    try {
        const mailResponse =  await mailSender(email,"Verification email from study notion", otp)
        console.log("Email sent successfully", mailResponse)
   
    } catch (error) {
        console.log("error ocurred while sending mail",error);
        throw error

    }
  }

  otpSchema.pre("save", async function(next){
    await sendVerificationEmail(this.email,this.otp);
    next();
  })

export default mongoose.model("OTP", otpSchema);
import express from "express";
import { sendOtp, signup, login } from "../controllers/Auth.js";
import { updateProfile,getAllUserDetails } from "../controllers/Profile.js";
import {auth} from "../middlewares/auth.js";
import { get } from "mongoose";
import { resetPassword, resetPasswordToken } from "../controllers/ResetPass.js";
import { createCourse, getInstructorCourses, showAllCourses } from "../controllers/Course.js";
import{ createSection, allSections } from "../controllers/Section.js";  
import { showCourseDetails } from "../controllers/Course.js";
import { createSubSection } from "../controllers/Subsection.js";
import { deleteAccount } from "../controllers/Profile.js";
import { capturePayment, verifySignature } from "../controllers/Payments.js";
const router = express.Router();

// Routes
router.post("/sendotp", sendOtp);
router.post("/signup", signup);
router.post("/login", login);
router.post("/updateprofile",auth, updateProfile);
router.get("/get",auth,getAllUserDetails);
router.post("/reset-password-token", resetPasswordToken);
router.post("/reset-password", resetPassword);
router.post("/createcourse",auth, createCourse);
router.post("/createsection",auth, createSection);
router.get("/allsections",auth, allSections);
router.get("/coursedetails/:courseId", auth, showCourseDetails);
router.post("/createsubsection",auth, createSubSection);
router.delete("/deleteuser",auth, deleteAccount);
router.get("/showAllCourses", auth, showAllCourses );
router.get("/instructor-courses", auth, getInstructorCourses)


import { deleteSection } from "../controllers/Section.js";
import { deleteSubSection } from "../controllers/Subsection.js";

router.delete("/deletesection", auth, deleteSection);
router.delete("/deletesubsection", auth, deleteSubSection);
import { markVideoCompleted } from "../controllers/CourseProgress.js"

// ...
router.post("/mark-video-completed", auth, markVideoCompleted)
router.post("/payment/capture-payment", auth, capturePayment);

// route to verify webhook signature (after payment success)
router.post("/payment/verify-signature", verifySignature);


export default router;

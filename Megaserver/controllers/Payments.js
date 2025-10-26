import mongoose from "mongoose";
import crypto from "crypto";
import razorpayInstance from "../config/Razorpay.js";
import User from "../models/user.js";
import Course from "../models/Course.js";
import mailSender from "../utils/mailSender.js";
import dotenv from "dotenv";
dotenv.config();

export const capturePayment = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;
    if (!req.user || !req.user.id) {
  return res.status(401).json({ success: false, message: "Unauthorized: user not found" });
}

    if (!courseId) {
      return res.status(400).json({ success: false, message: "courseId is required" });
    }
    console.log("Incoming body:", req.body);
console.log("User from req.user:", req.user);
console.log("Razorpay Key ID:", process.env.RAZORPAY_KEY_ID);

    const courseDetails = await Course.findById(courseId);
    if (!courseDetails) return res.status(404).json({ success: false, message: "Course not found" });

    const userDetails = await User.findById(userId);
    if (!userDetails) return res.status(404).json({ success: false, message: "User not found" });

    // Check if already enrolled
    if (courseDetails.studentsEnrolled.includes(userId)) {
      return res.status(409).json({ success: false, message: "Already enrolled" });
    }

    const options = {
      amount: courseDetails.price * 100, // convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        courseId: courseDetails._id.toString(),
        userId: userDetails._id.toString(),
      },
    };

    const paymentResponse = await razorpayInstance.orders.create(options);

    return res.status(200).json({
      success: true,
      message: "Payment initiated",
      orderId: paymentResponse.id,
      currency: paymentResponse.currency,
      amount: paymentResponse.amount,
      course: {
        name: courseDetails.courseName,
        description: courseDetails.courseDescription,
        thumbnail: courseDetails.thumbnail,
        instructor: courseDetails.instructor,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const verifySignature = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const signature = req.headers["x-razorpay-signature"];
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if (signature !== digest) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    console.log("Webhook verified ✅");

    const { courseId, userId } = req.body.payload.payment.entity.notes;

    // Enroll the student
    const enrolledStudent = await User.findByIdAndUpdate(
      userId,
      { $push: { courses: courseId } },
      { new: true }
    );

    const course = await Course.findByIdAndUpdate(
      courseId,
      { $push: { studentsEnrolled: userId } },
      { new: true }
    );

    // Send email
    const emailBody = `
      <div>
        <h1>Congratulations! 🎉 You are enrolled in ${course.courseName}</h1>
        <p>Start learning now!</p>
        <a href="http://localhost:3000/courses/${course._id}">Go to Course</a>
      </div>
    `;
    await mailSender(enrolledStudent.email, "Enrollment Successful - StudyNotion", emailBody);

    return res.status(200).json({
      success: true,
      message: "Signature verified and student enrolled successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCourseDetails } from "../api/course";
import { Clock, Users, Star, Play, BookOpen, Award, Loader2 } from "lucide-react";
import axios from "axios";

export default function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getCourseDetails(id)
        .then((res) => setCourse(res.data.data || res.data))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleEnroll = async () => {
    if (!course) return;

    try {
      // 1. Call backend to create Razorpay order (✅ withCredentials added)
      const { data } = await axios.post(
        "http://localhost:5000/api/v1/user/payment/capture-payment",
        { courseId: course._id },
        { withCredentials: true } // send JWT cookie
      );

      if (!data.success) {
        alert("Failed to create order");
        return;
      }

      // 2. Razorpay options
      const options: any = {
        key: "rzp_test_RFSoRk50UapxbA", 
        amount: data.amount,
        currency: data.currency,
        name: "StudyNotion",
        description: `Enroll in ${course.courseName}`,
        image: "https://your-logo-url.com/logo.png",
        order_id: data.orderId,
        handler: async function (response: any) {
          console.log("Payment Response:", response);

          try {
            // 3. Send details to backend for verification (✅ withCredentials added)
            const verifyRes = await axios.post(
              "http://localhost:5000/api/v1/user/payment/verify-signature",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                courseId: course._id,
              },
              { withCredentials: true }
            );

            if (verifyRes.data.success) {
              alert("🎉 Payment verified & enrollment successful!");
              // TODO: Redirect to dashboard or enrolled courses
            } else {
              alert("⚠️ Payment verification failed");
            }
          } catch (err) {
            console.error("Verification error:", err);
            alert("Error verifying payment");
          }
        },
        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };
      console.log("yha error h")
      // 4. Open Razorpay checkout
      const razor = new (window as any).Razorpay(options);
      razor.open();
    } catch (err) {
      console.error(err);
      alert("Error while initiating payment");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600 mb-4" />
          <p className="text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-16">
        <BookOpen className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Course not found</h3>
        <p className="text-gray-500">The course you're looking for doesn't exist.</p>
      </div>
    );
  }

  const totalStudents = course.studentsEnrolled?.length || 0;
  const avgRating = 4.5; 
  const learningOutcomes = course.whatYouWillLearn?.split(",") || [];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="glass-card p-8 rounded-2xl">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Course Image */}
          <div className="relative">
            <img
              src={
                course.thumbnail ||
                "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg"
              }
              alt={course.courseName}
              className="w-full h-80 object-cover rounded-xl"
            />
            <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
              <button className="bg-white/20 backdrop-blur-md p-4 rounded-full">
                <Play className="h-8 w-8 text-white" />
              </button>
            </div>
          </div>

          {/* Course Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.courseName}</h1>
              <p className="text-gray-600 text-lg leading-relaxed">{course.courseDescription}</p>
            </div>

            {/* Instructor */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {course.instructor?.firstName?.[0]}
                  {course.instructor?.lastName?.[0]}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {course.instructor?.firstName} {course.instructor?.lastName}
                </p>
                <p className="text-sm text-gray-500">Course Instructor</p>
              </div>
            </div>

            {/* Course Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-900">{totalStudents}</div>
                <div className="text-sm text-blue-700">Students</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-900">{avgRating}</div>
                <div className="text-sm text-yellow-700">Rating</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg">
                <Clock className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-emerald-900">12h</div>
                <div className="text-sm text-emerald-700">Duration</div>
              </div>
            </div>

            {/* Price and Enroll */}
            <div className="bg-gradient-to-r from-emerald-500 to-blue-600 p-6 rounded-xl text-white">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className="text-3xl font-bold">₹{course.price}</span>
                  <span className="text-emerald-100 line-through ml-2">
                    ₹{Math.round(course.price * 1.5)}
                  </span>
                </div>
                <div className="bg-white/20 px-3 py-1 rounded-full text-sm">33% OFF</div>
              </div>
              <button
                onClick={handleEnroll}
                className="w-full bg-white text-emerald-600 font-semibold py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Enroll Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* What You'll Learn */}
      {learningOutcomes.length > 0 && (
        <div className="glass-card p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Award className="h-6 w-6 mr-2 text-emerald-600" />
            What You'll Learn
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {learningOutcomes.map((outcome: string, index: number) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">{outcome.trim()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Course Content */}
      {course.courseContent && course.courseContent.length > 0 && (
        <div className="glass-card p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <BookOpen className="h-6 w-6 mr-2 text-blue-600" />
            Course Content
          </h2>
          <div className="space-y-4">
            {course.courseContent.map((section: any, index: number) => (
              <div
                key={section._id}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">
                    Section {index + 1}: {section.sectionName}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {section.subSection?.length || 0} lectures
                  </p>
                </div>
                {section.subSection && section.subSection.length > 0 && (
                  <div className="divide-y divide-gray-200">
                    {section.subSection.map((subsection: any) => (
                      <Link
                        key={subsection._id}
                        to={`/course/${course._id}/learn/${subsection._id}`}
                      >
                        <div className="px-6 py-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                          <div className="flex items-center space-x-3">
                            <Play className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-700">{subsection.title}</span>
                          </div>
                          <span className="text-sm text-gray-500">{subsection.timeDuration}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

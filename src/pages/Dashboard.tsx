import React, { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { Link } from "react-router-dom"
import {
  BookOpen,
  Users,
  TrendingUp,
  Award,
  Plus,
  BarChart3,
  Clock,
  Star,
  Loader2,
} from "lucide-react"

export default function Dashboard() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("Dashboard must be used within AuthProvider")

  const { user } = context
  const isInstructor = user?.accountType === "Instructor"

  const [courses, setCourses] = useState<any[]>([])
  const [totalStudents, setTotalStudents] = useState(0)
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [completedCourses, setCompletedCourses] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isInstructor) {
      // Fetch instructor data
      fetch("http://localhost:5000/api/v1/user/instructor-courses", {
        method: "GET",
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setCourses(data.data.courses)
            setTotalStudents(data.data.stats.totalStudents)
            setTotalRevenue(data.data.stats.totalRevenue)
          }
        })
        .catch((err) => console.error("Instructor fetch error:", err))
        .finally(() => setLoading(false))
    } else {
      // Fetch student data
      fetch("http://localhost:5000/api/v1/user/student-dashboard", {
        method: "GET",
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setCourses(data.data.enrolledCourses)
            setCompletedCourses(data.data.completedCourses)
          }
        })
        .catch((err) => console.error("Student fetch error:", err))
        .finally(() => setLoading(false))
    }
  }, [isInstructor])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    )
  }

  const stats = [
    {
      title: isInstructor ? "Total Courses" : "Enrolled Courses",
      value: isInstructor ? courses.length : courses.length,
      icon: BookOpen,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: isInstructor ? "Total Students" : "Completed Courses",
      value: isInstructor ? totalStudents : completedCourses,
      icon: Users,
      color: "from-emerald-500 to-emerald-600",
    },
    {
      title: isInstructor ? "Total Revenue" : "Certificates Earned",
      value: isInstructor ? `₹${totalRevenue}` : completedCourses, // certificates = completedCourses
      icon: isInstructor ? TrendingUp : Award,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Average Rating",
      value: isInstructor
        ? (
            courses.reduce(
              (sum, c) =>
                sum +
                (c.ratingAndReviews?.reduce(
                  (s: number, r: any) => s + (r.rating || 0),
                  0
                ) || 0),
              0
            ) /
              (courses.reduce(
                (count, c) => count + (c.ratingAndReviews?.length || 0),
                0
              ) || 1)
          ).toFixed(1)
        : "4.8",
      icon: Star,
      color: "from-yellow-500 to-yellow-600",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="glass-card p-8 rounded-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p className="text-gray-600 mt-2">
              {isInstructor
                ? "Here's an overview of your teaching progress"
                : "Continue your learning journey"}
            </p>
          </div>
          {isInstructor && (
            <Link
              to="/create-course"
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create Course</span>
            </Link>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="glass-card p-6 rounded-xl hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div
                className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}
              >
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Activity
            </h2>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {isInstructor ? (
              courses.length > 0 ? (
                courses
                  .flatMap((course) =>
                    (course.studentsEnrolled || []).map(
                      (student: any, idx: number) => (
                        <div
                          key={`${course._id}-${idx}`}
                          className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              New student enrolled in {course.courseName}
                            </p>
                            <p className="text-xs text-gray-500">just now</p>
                          </div>
                        </div>
                      )
                    )
                  )
                  .slice(-5)
              ) : (
                <p className="text-gray-500">No recent activity yet</p>
              )
            ) : courses.length > 0 ? (
              courses.slice(0, 5).map((course) => (
                <div
                  key={course._id}
                  className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Continue learning {course.courseName}
                    </p>
                    <p className="text-xs text-gray-500">
                      Progress: {course.progress}%
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No recent activity yet</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card p-6 rounded-xl">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Quick Actions
          </h2>
          <div className="space-y-3">
            {isInstructor ? (
              <>
                <Link
                  to="/create-course"
                  className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-colors"
                >
                  <Plus className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-700 font-medium">
                    Create New Course
                  </span>
                </Link>
                <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg hover:from-emerald-100 hover:to-emerald-200 transition-colors w-full">
                  <BarChart3 className="h-5 w-5 text-emerald-600" />
                  <span className="text-emerald-700 font-medium">
                    View Analytics
                  </span>
                </button>
                <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-colors w-full">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span className="text-purple-700 font-medium">
                    Manage Students
                  </span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/courses"
                  className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-colors"
                >
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-700 font-medium">
                    Browse Courses
                  </span>
                </Link>
                <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg hover:from-emerald-100 hover:to-emerald-200 transition-colors w-full">
                  <Clock className="h-5 w-5 text-emerald-600" />
                  <span className="text-emerald-700 font-medium">
                    Continue Learning
                  </span>
                </button>
                <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-colors w-full">
                  <Award className="h-5 w-5 text-purple-600" />
                  <span className="text-purple-700 font-medium">
                    View Certificates
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div className="glass-card p-6 rounded-xl">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {isInstructor ? "My Courses" : "Learning Progress"}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.length > 0 ? (
            courses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="aspect-video bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg mb-4 overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {course.courseName}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {isInstructor
                    ? `${course.studentsEnrolled?.length || 0} students enrolled`
                    : `Progress: ${course.progress || 0}%`}
                </p>
                {!isInstructor && (
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${course.progress || 0}%` }}
                    ></div>
                  </div>
                )}
                {isInstructor ? (
  <Link to={`/instructor/manage-course/${course._id}`}>
    <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
      Manage Course
    </button>
  </Link>
) : (
  <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
    Continue Learning
  </button>
)}

              </div>
            ))
          ) : (
            <p className="text-gray-500">
              {isInstructor
                ? "You haven’t created any courses yet"
                : "You haven’t enrolled in any courses yet"}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

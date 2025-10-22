import React from 'react'
import { Link } from 'react-router-dom'
import { Clock, Users, Star, Play } from 'lucide-react'

interface Course {
  _id: string
  courseName: string
  courseDescription?: string   // ✅ made optional
  price: number
  thumbnail: string
  instructor?: {
    firstName: string
    lastName: string
  }
  studentsEnrolled?: any[]
  ratingAndReviews?: any[]
}

export default function CourseCard({ course }: { course: Course }) {
  const avgRating =
    course.ratingAndReviews && course.ratingAndReviews.length > 0
      ? (
          course.ratingAndReviews.reduce(
            (acc: number, r: any) => acc + (r.rating || 0),
            0
          ) / course.ratingAndReviews.length
        ).toFixed(1)
      : 'N/A'

  const totalStudents = course.studentsEnrolled?.length || 0

  return (
    <div className="glass-card rounded-xl overflow-hidden course-card-hover group">
      {/* Course Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={
            course.thumbnail ||
            'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg'
          } 
          alt={course.courseName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Play className="h-12 w-12 text-white" />
        </div>
        <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">
          ₹{course.price}
        </div>
      </div>

      {/* Course Content */}
      <div className="p-6">
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
            {course.courseName}
          </h3>

          {/* ✅ Only show description if available */}
          {course.courseDescription && (
            <p className="text-gray-600 text-sm mt-2 line-clamp-3">
              {course.courseDescription}
            </p>
          )}
        </div>

        {/* Instructor */}
        {course.instructor && (
          <div className="mb-4">
            <p className="text-sm text-gray-500">
              By {course.instructor.firstName} 
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{totalStudents} students</span>
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 mr-1 text-yellow-500 fill-current" />
            <span>{avgRating}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>8 hours</span>
          </div>
        </div>

        {/* Action Button */}
        <Link 
          to={`/course/${course._id}`}
          className="w-full btn-primary text-center block"
        >
          View Course
        </Link>
      </div>
    </div>
  )
}

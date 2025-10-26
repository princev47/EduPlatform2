import React, { useEffect, useState } from 'react'
import { getAllCourses } from '../api/course'
import CourseCard from '../components/CourseCard'
import { Search, Filter, BookOpen, Loader2 } from 'lucide-react'

interface Course {
  _id: string
  courseName: string
  price: number
  thumbnail: string
  instructor?: {
    firstName: string
    lastName: string
  }
  ratingAndReviews: any[]
  studentsEnrolled: any[]
}


export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState<string | null>(null)

  // Fetch courses from backend
  useEffect(() => {
    getAllCourses()
      .then(res => {
        const allCourses = Array.isArray(res.data.data) ? res.data.data : []
        setCourses(allCourses)
        setFilteredCourses(allCourses)
      })
      .catch(err => {
        console.error('Failed to fetch courses:', err)
        setError('Failed to load courses')
      })
      .finally(() => setLoading(false))
  }, [])
 
    //filter courses based on search term
useEffect(() => {
  const filtered = courses.filter(course => {
    const nameMatch = (course.courseName || '')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())

    const instructorName =
      course.instructor
        ? `${course.instructor.firstName} ${course.instructor.lastName}`
        : ''

    const instructorMatch = instructorName
      .toLowerCase()
      .includes(searchTerm.toLowerCase())

    return nameMatch || instructorMatch
  })

  setFilteredCourses(filtered)
}, [searchTerm, courses])


  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600 mb-4" />
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-4">
          <BookOpen className="h-8 w-8 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold gradient-text">Explore Our Courses</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover world-class courses from expert instructors and advance your skills
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              aria-label="Search courses"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <button className="flex items-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Course Stats */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <BookOpen className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No courses found</h3>
          <p className="text-gray-500">
            {searchTerm ? 'Try adjusting your search terms' : 'Check back later for new courses'}
          </p>
        </div>
      )}
    </div>
  )
}

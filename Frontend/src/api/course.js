import api from './api'

// ✅ Create new course (multipart/form-data for file uploads)
export const createCourse = (formData) =>
  api.post('/api/v1/user/createcourse', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

// ✅ Get all courses
export const getAllCourses = () =>
  api.get('/api/v1/user/showAllCourses')

// ✅ Get single course details
export const getCourseDetails = (courseId) =>
  api.get(`/api/v1/user/coursedetails/${courseId}`)

// ✅ Mark a video as completed
export const markVideoCompleted = (courseId, videoId) =>
  api.post('/api/v1/user/mark-video-completed', { courseId, videoId })

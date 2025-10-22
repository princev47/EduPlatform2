import api from './api'

export const createCourse = (formData) =>
  api.post('/createcourse', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

// backend doesn’t have /course/getall → mapped to /allsections
export const getAllCourses = () => api.get('/showAllCourses')

// ✅ Correct: use path param, not query
export const getCourseDetails = (courseId) =>
  api.get(`/coursedetails/${courseId}`)
export const markVideoCompleted = (courseId, videoId) => 
  api.post(`/mark-video-completed`, { courseId, videoId })

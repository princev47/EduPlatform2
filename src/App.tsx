import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Courses from './pages/Courses'
import CourseDetails from './pages/CourseDetails'
import CreateCourse from './pages/CreateCourse'
import RequestReset from './pages/RequestReset'
import ResetPassword from './pages/ResetPassword'
import ProfilePage from './pages/ProfilePage'
import ProtectedRoute from './components/ProtectedRoute'
import UpdatePassword from "./pages/UpdatePassword"
import ManageCourse from "./pages/ManageCourse"
import CoursePlayer from "./pages/CoursePlayer"


// inside <Routes>



export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/courses" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/request-reset" element={<RequestReset />} />
        <Route path="/update-password/:token" element={<ResetPassword />} />
        <Route path="/instructor/manage-course/:courseId" element={<ManageCourse />} />

        <Route
          path="/dashboard"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        />
        <Route
          path="/create-course"
          element={<ProtectedRoute><CreateCourse /></ProtectedRoute>}
        />
        <Route
          path="/profile"
          element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
        />
        <Route path="/course/:courseId" element={<CourseDetails />} />
       <Route path="/course/:courseId/learn/:subSectionId" element={<CoursePlayer />} />
      </Routes>
    </Layout>
  )
}

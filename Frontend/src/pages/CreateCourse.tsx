import React, { useState } from 'react'
import { createCourse } from '../api/course'
import { Upload, Image, DollarSign, Book, FileText, Loader2 } from 'lucide-react'

export default function CreateCourse() {
  const [form, setForm] = useState({
    courseName: '',
    courseDescription: '',
    whatYouWillLearn: '',
    price: ''
  })
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setThumbnail(file)
      const reader = new FileReader()
      reader.onload = () => {
        setThumbnailPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

const submit = async (e: React.FormEvent) => {
  e.preventDefault()
  setBusy(true)
  setError('')
  
  try {
    const fd = new FormData()
    fd.append('courseName', form.courseName)
    fd.append('courseDescription', form.courseDescription)
    fd.append('whatYouWillLearn', form.whatYouWillLearn)
    fd.append('price', form.price)
    if (thumbnail) fd.append('thumbnailImage', thumbnail)

    const res = await createCourse(fd)

    if (res.data.success) {
      const courseId = res.data.courseId || res.data.data2?._id // backend response
      alert('Course created successfully!')

      // ✅ redirect directly to course details page
      if (courseId) {
        window.location.href = `/coursedetails/${courseId}`
      } else {
        window.location.href = '/dashboard'
      }
    }
  } catch (err: any) {
    setError(err.response?.data?.message || 'Failed to create course')
  } finally {
    setBusy(false)
  }
}


  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-emerald-100 to-blue-100 rounded-full mb-4">
          <Book className="h-8 w-8 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-bold gradient-text mb-2">Create New Course</h1>
        <p className="text-gray-600">Share your knowledge with the world</p>
      </div>

      {/* Form */}
      <form onSubmit={submit} className="glass-card p-8 rounded-2xl space-y-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Course Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Name *
          </label>
          <div className="relative">
            <Book className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={form.courseName}
              onChange={(e) => setForm({...form, courseName: e.target.value})}
              placeholder="Enter course name"
              className="input-field pl-10"
              required
            />
          </div>
        </div>

        {/* Course Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Description *
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
            <textarea
              value={form.courseDescription}
              onChange={(e) => setForm({...form, courseDescription: e.target.value})}
              placeholder="Describe what this course covers..."
              rows={4}
              className="input-field pl-10 resize-none"
              required
            />
          </div>
        </div>

        {/* What You Will Learn */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What Students Will Learn *
          </label>
          <input
            type="text"
            value={form.whatYouWillLearn}
            onChange={(e) => setForm({...form, whatYouWillLearn: e.target.value})}
            placeholder="List key learning outcomes (comma separated)"
            className="input-field"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Separate multiple learning outcomes with commas
          </p>
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Price (₹) *
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({...form, price: e.target.value})}
              placeholder="0"
              min="0"
              className="input-field pl-10"
              required
            />
          </div>
        </div>

        {/* Thumbnail Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Thumbnail
          </label>
          <div className="mt-2">
            {thumbnailPreview ? (
              <div className="relative">
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setThumbnail(null)
                    setThumbnailPreview(null)
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                >
                  ×
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                <Upload className="h-12 w-12 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Click to upload thumbnail</span>
                <span className="text-xs text-gray-400">PNG, JPG up to 10MB</span>
                <input
                  type="file"
                  onChange={handleThumbnailChange}
                  accept="image/*"
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy}
            className="btn-secondary flex items-center space-x-2"
          >
            {busy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <Book className="h-4 w-4" />
                <span>Create Course</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Plus, Trash2 } from "lucide-react"

export default function ManageCourse() {
  const { courseId } = useParams()
  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [newSection, setNewSection] = useState("")
  const [newSub, setNewSub] = useState({ title: "", description: "", timeDuration: "", videoFile: null as File | null })

  // ✅ Fetch course with sections & subsections
  useEffect(() => {
   fetch(`http://localhost:5000/api/v1/user/coursedetails/${courseId}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCourse(data.data)
      })
      .finally(() => setLoading(false))
  }, [courseId])

  // ✅ Create new Section
  const handleAddSection = async () => {
    if (!newSection.trim()) return
    const res = await fetch("http://localhost:5000/api/v1/user/createsection", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sectionName: newSection, courseId }),
    })
    const data = await res.json()
    if (data.success) {
      setCourse(data.courseDetails)
      setNewSection("")
    }
  }

  // ✅ Delete Section
  const handleDeleteSection = async (sectionId: string) => {
    const res = await fetch("http://localhost:5000/api/v1/user/deletesection", {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sectionId, courseId }),
    })
    const data = await res.json()
    if (data.success) setCourse(data.courseDetails)
  }

  // ✅ Add SubSection (with video upload)
  const handleAddSubSection = async (sectionId: string) => {
    if (!newSub.title || !newSub.description || !newSub.timeDuration || !newSub.videoFile) return
    const formData = new FormData()
    formData.append("title", newSub.title)
    formData.append("description", newSub.description)
    formData.append("timeDuration", newSub.timeDuration)
    formData.append("sectionId", sectionId)
    formData.append("videoFile", newSub.videoFile)

    const res = await fetch("http://localhost:5000/api/v1/user/createsubsection", {
      method: "POST",
      credentials: "include",
      body: formData,
    })
    const data = await res.json()
    if (data.success) {
      setCourse((prev: any) => ({
        ...prev,
        courseContent: prev.courseContent.map((s: any) =>
          s._id === sectionId ? data.sectionDetails : s
        ),
      }))
      setNewSub({ title: "", description: "", timeDuration: "", videoFile: null })
    }
  }

  if (loading) return <p className="p-6">Loading course...</p>
  if (!course) return <p className="p-6">Course not found</p>

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Manage Course: {course.courseName}</h1>

      {/* Add Section */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="New Section Name"
          value={newSection}
          onChange={(e) => setNewSection(e.target.value)}
          className="border p-2 rounded w-64"
        />
        <button onClick={handleAddSection} className="btn-primary flex items-center gap-1">
          <Plus size={16} /> Add Section
        </button>
      </div>

      {/* Sections */}
      {course.courseContent?.map((section: any) => (
        <div key={section._id} className="border rounded-lg p-4 space-y-3 bg-gray-50">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">{section.sectionName}</h2>
            <button onClick={() => handleDeleteSection(section._id)} className="text-red-600 hover:text-red-800">
              <Trash2 size={18} />
            </button>
          </div>

          {/* Subsections */}
          <div className="space-y-2">
            {section.subSection?.map((sub: any) => (
              <div key={sub._id} className="p-3 border rounded bg-white">
                <p className="font-medium">{sub.title}</p>
                <p className="text-sm text-gray-600">{sub.description}</p>
                <video controls src={sub.videoUrl} className="w-full mt-2 rounded" />
              </div>
            ))}
          </div>

          {/* Add SubSection */}
          <div className="mt-4 space-y-2">
            <input
              type="text"
              placeholder="SubSection Title"
              value={newSub.title}
              onChange={(e) => setNewSub({ ...newSub, title: e.target.value })}
              className="border p-2 rounded w-full"
            />
            <textarea
              placeholder="Description"
              value={newSub.description}
              onChange={(e) => setNewSub({ ...newSub, description: e.target.value })}
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              placeholder="Time Duration"
              value={newSub.timeDuration}
              onChange={(e) => setNewSub({ ...newSub, timeDuration: e.target.value })}
              className="border p-2 rounded w-full"
            />
            <input
              type="file"
              onChange={(e) => setNewSub({ ...newSub, videoFile: e.target.files?.[0] || null })}
              className="border p-2 rounded w-full"
            />
            <button onClick={() => handleAddSubSection(section._id)} className="btn-secondary w-full">
              <Plus size={16} /> Add SubSection
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

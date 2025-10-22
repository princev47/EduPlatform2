import CourseProgress from "../models/CourseProgress.js"

export const markVideoCompleted = async (req, res) => {
  try {
    const { courseId, videoId } = req.body
    const userId = req.user.id

    let progress = await CourseProgress.findOne({ course: courseId, user: userId })
    if (!progress) {
      progress = new CourseProgress({ course: courseId, user: userId, completedVideos: [] })
    }

    if (!progress.completedVideos.includes(videoId)) {
      progress.completedVideos.push(videoId)
    }

    // Calculate %
    const totalLectures = progress.totalLectures || 1
    const done = progress.completedVideos.length
    progress.progress = Math.floor((done / totalLectures) * 100)
    progress.completed = progress.progress === 100

    await progress.save()

    res.json({ success: true, progress })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: "Error updating progress" })
  }
}

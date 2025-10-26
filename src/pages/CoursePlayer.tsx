import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import { Loader2, PlayCircle } from "lucide-react";

export default function CoursePlayer() {
  const { courseId, subSectionId } = useParams<{
    courseId: string;
    subSectionId: string;
  }>();

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [subSectionTitle, setSubSectionTitle] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await api.get(`/coursedetails/${courseId}`);
        const course = res.data.data;

        let url: string | null = null;
        course.courseContent.forEach((section: any) => {
          section.subSection.forEach((sub: any) => {
            if (sub._id === subSectionId) {
              url = sub.videoUrl;
              setSubSectionTitle(sub.title);
            }
          });
        });

        if (url) {
          const unsupportedExt = [".mkv", ".mov", ".avi"];
          const isUnsupported = unsupportedExt.some((ext) =>
            url.toLowerCase().endsWith(ext)
          );

          if (isUnsupported) {
            url = url
              .replace("/upload/", "/upload/f_mp4/")
              .replace(/\.(mkv|mov|avi)$/i, ".mp4");
          }
        }

        setVideoUrl(url);
      } catch (error) {
        console.error("❌ Error fetching video:", error);
      } finally {
        setLoading(false);
      }
    };

    if (courseId && subSectionId) {
      fetchVideo();
    }
  }, [courseId, subSectionId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!videoUrl) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-600">
        No video found for this subsection.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
      {/* Subsection Title */}
      <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
        <PlayCircle className="h-8 w-8 text-blue-600" />
        {subSectionTitle || "Untitled Lesson"}
      </h1>

      {/* Video Player */}
      <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-black">
        <video
          src={videoUrl}
          controls
          className="w-full h-full"
          style={{ borderRadius: "12px" }}
        />
      </div>

      {/* Extra Info (Optional) */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Lesson Overview
        </h2>
        <p className="text-gray-600">
          You’re currently watching:{" "}
          <span className="font-medium text-blue-700">{subSectionTitle}</span>.
          Stay focused and track your progress as you complete each video.
        </p>
      </div>
    </div>
  );
}

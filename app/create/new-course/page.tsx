"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addCourseService } from "@/app/services/courseService";

export default function CreateCoursePage() {
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseCategory, setCourseCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const newCourse = await addCourseService({
        course_title: courseTitle,
        course_description: courseDescription,
        course_category: courseCategory,
      });

      if (!newCourse || !newCourse.id) {
        setError("Failed to create course.");
        return;
      }

      // Navigate to the course page
      router.push(`/create/my-courses/${newCourse.id}`);
    } catch (err) {
      console.error(err);
      setError("An error occurred while creating the course.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col justify-center items-center p-4 text-center max-w-2xl mx-auto">
      <div className="text-2xl font-bold mb-4">Create New Course</div>

      <input
        type="text"
        value={courseTitle}
        onChange={(e) => setCourseTitle(e.target.value)}
        placeholder="Course Title"
        className="mt-2 p-2 w-full border rounded"
      />

      <textarea
        value={courseDescription}
        onChange={(e) => setCourseDescription(e.target.value)}
        placeholder="What is this course about?"
        className="mt-2 p-2 w-full border rounded"
      />

      <input
        type="text"
        value={courseCategory}
        onChange={(e) => setCourseCategory(e.target.value)}
        placeholder="Course Category"
        className="mt-2 p-2 w-full border rounded"
      />

      {error && <div className="text-red-500 mt-2">{error}</div>}

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white p-2 mt-4 rounded w-full"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Course"}
      </button>
    </div>
  );
}

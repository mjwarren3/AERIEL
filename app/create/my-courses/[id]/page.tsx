"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  getCourseByIdService,
  addLesson,
  getLessonsByCourseId,
} from "@/app/services/courseService";
import { generateLessonsFromCourseData } from "@/app/actions/generateLessonsFromCourseData";
import { Course, Lesson } from "@/types/courses";
import Modal from "@/components/Modal";
import LessonsList from "@/components/LessonsList";

export default function CourseDetailsPage() {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generating, setGenerating] = useState(false);

  const refreshLessons = async () => {
    if (typeof id === "string") {
      const updatedLessons = await getLessonsByCourseId(id);
      setLessons(updatedLessons);
    }
  };

  useEffect(() => {
    const fetchCourseAndLessons = async () => {
      try {
        if (typeof id !== "string") {
          throw new Error("Invalid course ID.");
        }

        const [courseData, lessonsData] = await Promise.all([
          getCourseByIdService(id),
          getLessonsByCourseId(id),
        ]);

        if (!courseData) {
          setError("Course not found.");
        } else {
          setCourse(courseData);
        }

        if (lessonsData) {
          setLessons(lessonsData);
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching the course and lessons.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndLessons();
  }, [id]);

  const handleGenerateLessons = async () => {
    if (!course) return;

    setGenerating(true);
    try {
      const generatedLessons: Lesson[] = await generateLessonsFromCourseData({
        title: course.course_title,
        description: course.course_description,
        lessonCount: 5,
      });

      for (const lesson of generatedLessons) {
        if (course.id) {
          await addLesson(lesson, String(course.id));
        }
      }

      refreshLessons();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error generating lessons:", err);
      setError("Failed to generate lessons.");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!course) {
    return <div>Course not found.</div>;
  }

  return (
    <div className="w-full flex flex-col items-start p-4">
      <h1 className="text-2xl font-bold mb-4">{course.course_title}</h1>
      <p className="text-lg">{course.course_description}</p>
      <div className="mt-4 w-full">
        <h2 className="text-xl font-semibold">Lessons</h2>
        {lessons && lessons.length > 0 ? (
          <LessonsList
            lessons={lessons}
            courseId={String(course.id)}
            refreshLessons={refreshLessons}
          />
        ) : (
          <p className="text-gray-600 mt-2">
            No lessons available for this course.
          </p>
        )}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
        >
          Generate Lessons
        </button>
      </div>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2 className="text-xl font-bold mb-4">Generate Lessons</h2>
          <p>Are you sure you want to generate lessons for this course?</p>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerateLessons}
              className="bg-blue-500 text-white px-4 py-2 rounded"
              disabled={generating}
            >
              {generating ? "Generating..." : "Generate"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

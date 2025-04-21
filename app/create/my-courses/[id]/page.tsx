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
import Button from "@/components/Button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function CourseDetailsPage() {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [description, setDescription] = useState("");
  const [lessonCount, setLessonCount] = useState(5);

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
          setDescription(courseData.course_description); // Initialize description
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
        description: description, // Use user-adjusted description
        lessonCount: lessonCount, // Use user-inputted lesson count
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
    <div className="w-full flex flex-col items-start">
      <Link
        href="/create/my-courses"
        className="flex text-gray-500 items-center"
      >
        <ChevronLeft />
        Back to My Courses
      </Link>
      <h1 className="text-2xl font-bold mb-4">{course.course_title}</h1>
      <p className="text-lg">{course.course_description}</p>
      <div className="mt-4 w-full">
        {lessons && lessons.length > 0 ? (
          <LessonsList
            lessons={lessons}
            courseId={String(course.id)}
            refreshLessons={refreshLessons}
          />
        ) : (
          <div className="border rounded-lg border-gray-300 bg-gray-100 p-8 justify-center items-center flex flex-col gap-4 w-full">
            <p className="text-gray-600">
              No lessons created for this course yet
            </p>
            <Button variant="primary" onClick={() => setIsModalOpen(true)}>
              Generate Lessons
            </Button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2 className="text-xl font-bold mb-4">Generate Lessons</h2>
          <p className="text-gray-600">
            Adjust the description and upload context content to create a list
            of lessons in this course
          </p>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)} // Allow user to edit description
            className="p-2 w-full border rounded mt-2"
          />

          <label>How many lessons do you want to generate?</label>
          <input
            type="number"
            value={lessonCount}
            onChange={(e) => setLessonCount(Number(e.target.value))} // Update lesson count
            className="p-2 w-full border rounded mt-2"
            min={1}
          />
          <label>Upload any relevant material for context</label>
          <input
            type="file"
            accept=".pdf, .docx, .txt"
            className="p-2 w-full border rounded mt-2"
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button
              onClick={handleGenerateLessons}
              variant="primary"
              disabled={generating}
            >
              {generating ? "Generating..." : "Generate Lessons"}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

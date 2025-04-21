"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  getCourseByIdService,
  addLesson,
  getLessonsByCourseId,
  updateCourseService, // Add this service to update the course
} from "@/app/services/courseService";
import { generateLessonsFromCourseData } from "@/app/actions/generateLessonsFromCourseData";
import { Course, Lesson } from "@/types/courses";
import Modal from "@/components/Modal";
import LessonsList from "@/components/LessonsList";
import Button from "@/components/Button";
import { ChevronLeft, Edit } from "lucide-react";
import Link from "next/link";

export default function CourseDetailsPage() {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for edit modal
  const [generating, setGenerating] = useState(false);
  const [description, setDescription] = useState("");
  const [lessonCount, setLessonCount] = useState(5);

  // States for editing the course
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editApproved, setEditApproved] = useState(false);
  const [editApprover, setEditApprover] = useState("");

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
          setEditTitle(courseData.course_title); // Initialize edit states
          setEditDescription(courseData.course_description);
          setEditApproved(courseData.approved || false);
          setEditApprover(courseData.approver || "");
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

  const handleSaveCourse = async () => {
    if (!course) return;

    try {
      const updatedCourse = await updateCourseService({
        id: course.id,
        course_title: editTitle,
        course_description: editDescription,
        approved: editApproved,
        approver: editApprover,
      });

      if (updatedCourse) {
        setCourse(updatedCourse); // Update course state with the response from the service
      }

      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Error updating course:", err);
      setError("Failed to update course.");
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
      <div className="flex items-center gap-1">
        <h1 className="text-2xl font-bold">{course.course_title}</h1>
        <Edit
          className="h-5 w-6 text-gray-400 cursor-pointer"
          onClick={() => setIsEditModalOpen(true)}
        />
      </div>
      <p className="text-lg">{course.course_description}</p>
      <div onClick={() => setIsEditModalOpen(true)} className="cursor-pointer">
        {course.approved ? (
          <div className="bg-green-300 inline-flex text-xs font-semibold px-2 py-1 rounded-full mt-2">
            {course.approver ? (
              <div>Approved by {course.approver}</div>
            ) : (
              <div>Approved</div>
            )}
          </div>
        ) : (
          <div className="bg-red-300 inline-flex text-xs font-semibold px-2 py-1 rounded-full mt-2">
            Not Approved
          </div>
        )}
      </div>
      <div className="my-4 border-b-2 border-gray-300 w-full"></div>

      <div className="w-full">
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

      {isEditModalOpen && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        >
          <h2 className="text-xl font-bold mb-4">Edit Course</h2>
          <div className="w-full space-y-3">
            <div>
              <label className="text-sm text-gray-400 mt-4">Title</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="p-2 w-full border rounded"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mt-4">Description</label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="p-2 w-full border rounded"
              />
            </div>
            <div className="flex items-center w-full justify-between  gap-2">
              <label className="text-sm text-gray-400">Approved</label>
              <button
                type="button"
                onClick={() => setEditApproved(!editApproved)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  editApproved ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`w-4 h-4 bg-white rounded-full transform transition-transform ${
                    editApproved ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>

            {editApproved && (
              <div className="mt-2">
                <label className="text-sm text-gray-400 pt-4">
                  Approver Name & Title
                </label>
                <input
                  type="text"
                  value={editApprover}
                  onChange={(e) => setEditApprover(e.target.value)}
                  className="p-2 w-full border rounded mt-1"
                />
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveCourse} variant="primary">
              Save
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

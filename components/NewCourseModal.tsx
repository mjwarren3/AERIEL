"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addCourseService } from "@/app/services/courseService";
import Modal from "./Modal";
import Button from "./Button";

interface NewCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewCourseModal: React.FC<NewCourseModalProps> = ({ isOpen, onClose }) => {
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
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full flex flex-col max-w-2xl mx-auto">
        <div className="text-2xl font-bold">Create New Course</div>

        <label className="text-left w-full mt-2 text-sm font-semibold">
          Course Title
        </label>

        <input
          type="text"
          value={courseTitle}
          onChange={(e) => setCourseTitle(e.target.value)}
          placeholder="Course Title"
          className="p-2 w-full border rounded"
        />

        <label className="text-left w-full mt-2 text-sm font-semibold">
          Course Description
        </label>

        <textarea
          value={courseDescription}
          onChange={(e) => setCourseDescription(e.target.value)}
          placeholder="What is this course about?"
          className="p-2 w-full border rounded"
        />

        <label className="text-left w-full mt-2 text-sm font-semibold">
          Category
        </label>

        <input
          type="text"
          value={courseCategory}
          onChange={(e) => setCourseCategory(e.target.value)}
          placeholder="Course Category"
          className="p-2 w-full border rounded"
        />

        {error && <div className="text-red-500 mt-2">{error}</div>}

        <Button
          onClick={handleSubmit}
          className="w-full mt-4"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Course"}
        </Button>
      </div>
    </Modal>
  );
};

export default NewCourseModal;

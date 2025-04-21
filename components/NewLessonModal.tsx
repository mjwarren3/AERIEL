"use client";

import { useState } from "react";
import { addLesson } from "@/app/services/courseService";
import Modal from "./Modal";
import Button from "./Button";
import { useRouter } from "next/navigation";

interface NewLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  course_id: string; // Accept course_id as a prop
  order?: number; // Optional order prop
}

const NewLessonModal: React.FC<NewLessonModalProps> = ({
  isOpen,
  onClose,
  course_id,
  order = 0, // Default to 0 if not provided
}) => {
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonDescription, setLessonDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const newLesson = await addLesson(
        {
          lesson_title: lessonTitle,
          lesson_description: lessonDescription,
          lesson_order: order, // Default order, can be updated later
        },
        course_id
      );

      if (!newLesson || !newLesson.id) {
        setError("Failed to create lesson.");
        return;
      }

      // Close the modal after successful creation
      router.push(`/create/my-courses/${course_id}/${newLesson.id}`);
    } catch (err) {
      console.error(err);
      setError("An error occurred while creating the lesson.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full flex flex-col max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Add Lesson</h2>

        <label className="text-left w-full mt-2 text-sm font-semibold">
          Lesson Title
        </label>
        <input
          type="text"
          value={lessonTitle}
          onChange={(e) => setLessonTitle(e.target.value)}
          placeholder="Lesson Title"
          className="p-2 w-full border rounded"
        />

        <label className="text-left w-full mt-2 text-sm font-semibold">
          Lesson Description
        </label>
        <textarea
          value={lessonDescription}
          onChange={(e) => setLessonDescription(e.target.value)}
          placeholder="What is this lesson about?"
          className="p-2 w-full border rounded"
        />

        {error && <div className="text-red-500 mt-2">{error}</div>}

        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Adding..." : "Add Lesson"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default NewLessonModal;

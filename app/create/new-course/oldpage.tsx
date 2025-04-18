"use client";

import { useState } from "react";

type Lesson = {
  lesson_title: string;
  lesson_description: string;
  lesson_order: number;
};

export default function CreateCoursePage() {
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [lessonCount, setLessonCount] = useState(1);
  const [lessonFormats, setLessonFormats] = useState({
    text: false,
    multipleChoice: false,
    openReflection: false,
    answerRevealTwoChoice: false,
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!uploadedFile) {
      setError("Please upload a .pdf or .docx file.");
      return;
    }

    setLoading(true);
    setError("");
    setLessons([]);

    const formData = new FormData();
    formData.append("title", courseTitle);
    formData.append("description", courseDescription);
    formData.append("lessonCount", lessonCount.toString());
    formData.append("lessonFormats", JSON.stringify(lessonFormats));

    try {
      const response = await fetch("/api/create-course", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Server returned an error.");
      }

      const data = await response.json();
      setLessons(data);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
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
        type="number"
        value={lessonCount}
        onChange={(e) => setLessonCount(Number(e.target.value))}
        placeholder="How many lessons?"
        className="mt-2 p-2 w-full border rounded"
      />

      <div className="mt-4 text-left w-full">Lesson Formats</div>
      {Object.entries(lessonFormats).map(([key, value]) => (
        <label key={key} className="block text-left">
          <input
            type="checkbox"
            checked={value}
            onChange={(e) =>
              setLessonFormats((prev) => ({
                ...prev,
                [key]: e.target.checked,
              }))
            }
          />{" "}
          {key}
        </label>
      ))}

      <input
        type="file"
        accept=".pdf,.docx"
        onChange={handleFileChange}
        className="mt-4 w-full"
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white p-2 mt-4 rounded w-full"
        disabled={loading}
      >
        {loading ? "Generating..." : "Create Course"}
      </button>

      {error && <div className="text-red-500 mt-4">{error}</div>}

      {lessons.length > 0 && (
        <div className="mt-6 w-full text-left">
          <h2 className="text-xl font-bold mb-2">Generated Lessons</h2>
          <ul className="list-decimal pl-6 space-y-2">
            {lessons.map((lesson) => (
              <li key={lesson.lesson_order}>
                <strong>{lesson.lesson_title}</strong>:{" "}
                {lesson.lesson_description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

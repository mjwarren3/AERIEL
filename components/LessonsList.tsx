import { useState } from "react";
import { Lesson } from "@/types/courses";
import { updateLessonsService } from "@/app/services/courseService";
import Link from "next/link";

type LessonsListProps = {
  lessons: Lesson[];
  courseId: string;
  refreshLessons: () => void;
};

export default function LessonsList({
  lessons,
  courseId,
  refreshLessons,
}: LessonsListProps) {
  const [editableLessons, setEditableLessons] = useState<Lesson[]>(lessons);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleMoveLesson = (index: number, direction: "up" | "down") => {
    const newLessons = [...editableLessons];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newLessons.length) return;

    // Swap lesson_order values
    [newLessons[index].lesson_order, newLessons[targetIndex].lesson_order] = [
      newLessons[targetIndex].lesson_order,
      newLessons[index].lesson_order,
    ];

    // Swap lessons in the array
    [newLessons[index], newLessons[targetIndex]] = [
      newLessons[targetIndex],
      newLessons[index],
    ];

    setEditableLessons(newLessons);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateLessonsService(courseId, editableLessons);
      refreshLessons();
      setIsEditing(false);
    } catch (err) {
      console.error("Error saving lessons:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 mt-4">
      {editableLessons.map((lesson, index) => (
        <div
          key={lesson.lesson_order}
          className="border rounded p-4 flex flex-col gap-2 bg-gray-100 w-full"
        >
          {isEditing ? (
            <>
              <input
                type="text"
                value={lesson.lesson_title}
                onChange={(e) =>
                  setEditableLessons((prev) =>
                    prev.map((l, i) =>
                      i === index ? { ...l, lesson_title: e.target.value } : l
                    )
                  )
                }
                className="border p-2 rounded w-full"
              />
              <textarea
                value={lesson.lesson_description}
                onChange={(e) =>
                  setEditableLessons((prev) =>
                    prev.map((l, i) =>
                      i === index
                        ? { ...l, lesson_description: e.target.value }
                        : l
                    )
                  )
                }
                className="border p-2 rounded w-full"
              />
              <div className="flex justify-between">
                <button
                  onClick={() => handleMoveLesson(index, "up")}
                  className="bg-gray-300 text-black px-4 py-2 rounded"
                  disabled={index === 0}
                >
                  ↑ Move Up
                </button>
                <button
                  onClick={() => handleMoveLesson(index, "down")}
                  className="bg-gray-300 text-black px-4 py-2 rounded"
                  disabled={index === editableLessons.length - 1}
                >
                  ↓ Move Down
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                href={`/create/my-courses/${courseId}/${lesson.id}`}
                className="flex flex-col gap-2"
              >
                <h3 className="text-lg font-bold">{lesson.lesson_title}</h3>
                <p className="text-gray-700">{lesson.lesson_description}</p>
              </Link>
            </>
          )}
        </div>
      ))}
      <div className="flex justify-end gap-4">
        {isEditing ? (
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}

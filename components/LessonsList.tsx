import { useState } from "react";
import { Lesson } from "@/types/courses";
import { updateLessonsService } from "@/app/services/courseService";
import Link from "next/link";
import Button from "./Button";

type LessonsListProps = {
  lessons: Lesson[];
  courseId: string;
  refreshLessons: () => void;
  isEditing?: boolean;
  setIsEditing?: (isEditing: boolean) => void;
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
    <div className="w-full">
      <div className="w-full justify-between items-center flex">
        <h2 className="text-xl font-semibold">Lessons</h2>
        {isEditing ? (
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        ) : (
          <Button onClick={() => setIsEditing(true)}>Edit Order</Button>
        )}
      </div>

      <div className="w-full flex flex-col gap-2 mt-4">
        {editableLessons.map((lesson, index) => (
          <div
            key={lesson.lesson_order}
            className="border rounded-lg border-gray-300 p-3 flex flex-col gap-2 w-full"
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
                  className="flex flex-col gap-1"
                >
                  <div className="text-lg font-bold">{lesson.lesson_title}</div>
                  <p className="text-gray-500">{lesson.lesson_description}</p>
                </Link>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

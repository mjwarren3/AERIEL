import { useState } from "react";
import { Lesson } from "@/types/courses";
import { updateLessonsService } from "@/app/services/courseService";
import Link from "next/link";
import Button from "./Button";
import NewLessonModal from "./NewLessonModal";
import { ChevronUp, ChevronDown } from "lucide-react";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        <div className="flex gap-2 items-center">
          {isEditing ? (
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit Order</Button>
          )}
          <Button onClick={() => setIsModalOpen(true)} variant="primary">
            Add Lesson
          </Button>
        </div>
      </div>

      <div className="w-full flex flex-col gap-2 mt-4">
        {editableLessons.map((lesson, index) => (
          <div
            key={index}
            className="border rounded-lg border-gray-300 hover:bg-gray-100 p-3 flex items-center justify-between w-full"
          >
            <Link
              href={`/create/my-courses/${courseId}/${lesson.id}`}
              className="flex flex-col gap-1"
            >
              <div className="text-lg font-bold">{lesson.lesson_title}</div>
              <p className="text-gray-500">{lesson.lesson_description}</p>
            </Link>
            {isEditing && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleMoveLesson(index, "up")}
                  className="p-2 rounded bg-gray-200 hover:bg-gray-300"
                  disabled={index === 0}
                >
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => handleMoveLesson(index, "down")}
                  className="p-2 rounded bg-gray-200 hover:bg-gray-300"
                  disabled={index === editableLessons.length - 1}
                >
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <NewLessonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        course_id={courseId}
        order={editableLessons.length + 1} // New lesson will be added at the end
      />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  getSlidesByLessonId,
  getLessonByIdService,
  addSlide,
  updateSlideService,
  updateLessonService,
} from "@/app/services/courseService";

import { Lesson } from "@/types/courses";
import Modal from "@/components/Modal";
import { generateSlidesFromLessonData } from "@/app/actions/generateSlidesFromLessonData";
import SlideEditorSidebar from "@/components/SlideEditorSidebar";
import LessonPreviewModal from "@/components/LessonPreviewModal";
import { LessonContextProvider } from "@/context/LessonContextProvider";
import { LessonModule } from "@/types/lesson-modules";
import { ChevronUp, ChevronDown, ChevronLeft, Edit } from "lucide-react";
import Link from "next/link";
import Button from "@/components/Button";

export default function LessonDetailsPage() {
  const { lesson_id } = useParams();
  const { id } = useParams();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [slides, setSlides] = useState<LessonModule[] | null>(null);
  const [selectedSlide, setSelectedSlide] = useState<LessonModule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [updatedSlides, setUpdatedSlides] = useState<LessonModule[] | null>(
    null
  );
  const [description, setDescription] = useState("");
  const [lessonCount, setLessonCount] = useState(5);
  const [additionalContext, setAdditionalContext] = useState("");

  // States for editing the lesson
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editApproved, setEditApproved] = useState(false);
  const [editApprover, setEditApprover] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const refreshSlides = async () => {
    if (typeof lesson_id === "string") {
      const updatedSlides = await getSlidesByLessonId(lesson_id);
      setSlides(updatedSlides);
      setUpdatedSlides(updatedSlides);
    }
  };

  useEffect(() => {
    const fetchLessonAndSlides = async () => {
      try {
        if (typeof lesson_id !== "string") {
          throw new Error("Invalid lesson ID.");
        }

        const [lessonData, slidesData] = await Promise.all([
          getLessonByIdService(lesson_id),
          getSlidesByLessonId(lesson_id),
        ]);

        if (!lessonData) {
          setError("Lesson not found.");
        } else {
          setDescription(lessonData.lesson_description);
          setLesson(lessonData);
          setEditTitle(lessonData.lesson_title); // Initialize edit states
          setEditDescription(lessonData.lesson_description);
          setEditApproved(lessonData.approved || false);
          setEditApprover(lessonData.approver || "");
        }

        if (slidesData) {
          setSlides(slidesData);

          setUpdatedSlides(slidesData);
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching the lesson and slides.");
      } finally {
        setLoading(false);
      }
    };

    fetchLessonAndSlides();
  }, [lesson_id]);

  const handleSaveLesson = async () => {
    if (!lesson) return;

    try {
      const updatedLesson = await updateLessonService({
        id: lesson.id,
        lesson_title: editTitle,
        lesson_description: editDescription,
        approved: editApproved,
        approver: editApprover, // Only set approver if approved
      });

      if (updatedLesson) {
        setLesson(updatedLesson); // Update lesson state with the response from the service
      }

      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Error updating lesson:", err);
      setError("Failed to update lesson.");
    }
  };

  const handleGenerateSlides = async () => {
    if (!lesson) return;

    setGenerating(true);
    try {
      const generatedSlides: LessonModule[] =
        await generateSlidesFromLessonData({
          title: lesson.lesson_title,
          description: lesson.lesson_description,
          additionalContext: additionalContext,
          lessonCount: lessonCount,
        });

      for (const slide of generatedSlides) {
        if (lesson.id) {
          await addSlide(slide, String(lesson.id));
        }
      }

      refreshSlides();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error generating slides:", err);
      setError("Failed to generate slides.");
    } finally {
      setGenerating(false);
    }
  };

  const handleMoveSlide = (index: number, direction: "up" | "down") => {
    if (!updatedSlides) return;

    const newSlides = [...updatedSlides];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    // Ensure the target index is within bounds
    if (targetIndex < 0 || targetIndex >= newSlides.length) return;

    // Swap the slides in the array
    [newSlides[index], newSlides[targetIndex]] = [
      newSlides[targetIndex],
      newSlides[index],
    ];

    // Update the order values based on their new positions
    newSlides.forEach((slide, idx) => {
      slide.order = idx + 1; // Assuming order starts from 1
    });

    setUpdatedSlides(newSlides);
  };

  const handleSaveOrder = async () => {
    if (!updatedSlides) return;

    try {
      await Promise.all(
        updatedSlides.map((slide) => updateSlideService(slide))
      );
      setSlides(updatedSlides);
      setIsEditingOrder(false);
    } catch (err) {
      console.error("Error saving slide order:", err);
      setError("Failed to save slide order.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!lesson) {
    return <div>Lesson not found.</div>;
  }

  return (
    <div className="w-full flex flex-col items-start">
      <Link
        href={`/create/my-courses/${id}`}
        className="flex text-gray-500 items-center"
      >
        <ChevronLeft />
        Back to Course
      </Link>
      <div className="flex items-center gap-1">
        <h1 className="text-2xl font-bold">{lesson.lesson_title}</h1>
        <Edit
          className="h-5 w-6 text-gray-400 cursor-pointer"
          onClick={() => setIsEditModalOpen(true)}
        />
      </div>
      <p className="text-lg">{lesson.lesson_description}</p>
      <div onClick={() => setIsEditModalOpen(true)} className="cursor-pointer">
        {lesson.approved ? (
          <div className="bg-green-300 inline-flex text-xs font-semibold px-2 py-1 rounded-full mt-2">
            {lesson.approver ? (
              <div>Approved by {lesson.approver}</div>
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Exercises</h2>
          <div className="flex gap-4 mt-4">
            {!isEditingOrder ? (
              <Button onClick={() => setIsEditingOrder(true)}>
                Edit Order
              </Button>
            ) : (
              <>
                <Button onClick={handleSaveOrder}>Save</Button>
              </>
            )}

            <Button variant="primary" onClick={() => setIsPreviewOpen(true)}>
              Preview Lesson
            </Button>
          </div>
        </div>
        {slides && slides.length > 0 ? (
          <div className="flex flex-col w-full gap-4">
            {(isEditingOrder ? updatedSlides : slides)
              ?.sort((a, b) => a.order - b.order)
              .map((slide, index) => (
                <div
                  key={slide.id}
                  onClick={() => !isEditingOrder && setSelectedSlide(slide)}
                  className="border p-2 border-gray-300 rounded-lg cursor-pointer w-full hover:bg-gray-100 flex items-center justify-between"
                >
                  <div className="flex gap-2 items-center">
                    <div className="inline-flex rounded-lg bg-orange-200 min-h-16 w-20 font-semibold px-2 text-xs justify-center items-center text-center">
                      {slide.type
                        .split("_")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </div>
                    <div className="text-lg font-semibold">
                      {slide.question}
                    </div>
                  </div>

                  {isEditingOrder && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleMoveSlide(index, "up")}
                        className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                        disabled={index === 0}
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleMoveSlide(index, "down")}
                        className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                        disabled={index === slides.length - 1}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full gap-2 border bg-gray-100 border-gray-300 rounded-lg p-8">
            <p className="text-gray-600 mt-2">
              No exercises available for this lesson.
            </p>
            <Button variant="primary" onClick={() => setIsModalOpen(true)}>
              Generate Exercises
            </Button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2 className="text-xl font-bold mb-4">Generate Exercises</h2>
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
          <label>Any additional context you want to provide?</label>
          <textarea
            rows={2}
            value={additionalContext}
            onChange={(e) => setAdditionalContext(e.target.value)} // Allow user to edit description
            className="p-2 w-full border rounded mt-2"
          />

          <label>Upload any relevant material for context</label>
          <input
            type="file"
            accept=".pdf, .docx, .txt"
            className="p-2 w-full border rounded mt-2"
          />

          <label>How many exercises do you want to generate?</label>
          <input
            type="number"
            value={lessonCount}
            onChange={(e) => setLessonCount(Number(e.target.value))} // Update lesson count
            className="p-2 w-full border rounded mt-2"
            min={1}
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button
              onClick={handleGenerateSlides}
              variant="primary"
              disabled={generating}
            >
              {generating ? "Generating..." : "Generate Lessons"}
            </Button>
          </div>
        </Modal>
      )}

      {isPreviewOpen && slides && (
        <LessonContextProvider>
          <LessonPreviewModal
            isOpen={isPreviewOpen}
            onClose={() => setIsPreviewOpen(false)}
            slides={slides}
          />
        </LessonContextProvider>
      )}

      {selectedSlide && (
        <SlideEditorSidebar
          slide={selectedSlide}
          isOpen={!!selectedSlide}
          onClose={() => setSelectedSlide(null)}
          onSave={() => {
            refreshSlides();
            setSelectedSlide(null);
          }}
        />
      )}

      {isEditModalOpen && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        >
          <h2 className="text-xl font-bold mb-4">Edit Lesson</h2>
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
            <div className="flex items-center w-full justify-between gap-2">
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
            <Button onClick={handleSaveLesson} variant="primary">
              Save
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  getSlidesByLessonId,
  getLessonByIdService,
  addSlide,
} from "@/app/services/courseService";

import { Lesson } from "@/types/courses";
import Modal from "@/components/Modal";
import { generateSlidesFromLessonData } from "@/app/actions/generateSlidesFromLessonData";
import SlideEditorSidebar from "@/components/SlideEditorSidebar";
import LessonPreviewModal from "@/components/LessonPreviewModal";
import { LessonContextProvider } from "@/context/LessonContextProvider";
import { LessonModule } from "@/types/lesson-modules";

export default function LessonDetailsPage() {
  const { lesson_id } = useParams();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [slides, setSlides] = useState<LessonModule[] | null>(null);
  const [selectedSlide, setSelectedSlide] = useState<LessonModule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [generating, setGenerating] = useState(false);

  const refreshSlides = async () => {
    if (typeof lesson_id === "string") {
      const updatedSlides = await getSlidesByLessonId(lesson_id);
      setSlides(updatedSlides);
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
          setLesson(lessonData);
        }

        if (slidesData) {
          setSlides(slidesData);
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

  const handleGenerateSlides = async () => {
    if (!lesson) return;

    setGenerating(true);
    try {
      const generatedSlides: LessonModule[] =
        await generateSlidesFromLessonData({
          title: lesson.lesson_title,
          description: lesson.lesson_description,
          lessonCount: 5,
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
    <div className="w-full flex flex-col items-start p-4">
      <h1 className="text-2xl font-bold mb-4">{lesson.lesson_title}</h1>
      <p className="text-lg">{lesson.lesson_description}</p>
      <div className="mt-4 w-full">
        <h2 className="text-xl font-semibold">Slides</h2>
        {slides && slides.length > 0 ? (
          <div className="flex flex-col w-full gap-4">
            {slides.map((slide) => (
              <div
                onClick={() => setSelectedSlide(slide)}
                key={slide.id}
                className="p-4 border rounded cursor-pointer w-full hover:bg-gray-100"
              >
                <h3 className="text-base font-semibold">{slide.question}</h3>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 mt-2">
            No slides available for this lesson.
          </p>
        )}
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Generate Slides
          </button>
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Preview
          </button>
        </div>
      </div>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2 className="text-xl font-bold mb-4">Generate Slides</h2>
          <p>Are you sure you want to generate slides for this lesson?</p>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerateSlides}
              className="bg-blue-500 text-white px-4 py-2 rounded"
              disabled={generating}
            >
              {generating ? "Generating..." : "Generate"}
            </button>
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
    </div>
  );
}

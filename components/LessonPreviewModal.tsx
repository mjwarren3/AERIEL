"use client";

import Modal from "@/components/Modal";
import MarkdownModule from "@/components/lesson-modules/MarkdownModule";
import MultipleChoiceModule from "@/components/lesson-modules/MultipleChoiceModule";
import ReflectionModule from "@/components/lesson-modules/ReflectionModule";
import { useState } from "react";
import Button from "@/components/Button";
import SingleChoiceModule from "./lesson-modules/SingleChoice";
import { LessonModule } from "@/types/lesson-modules";
import RevealModule from "./lesson-modules/RevealModule";

interface LessonPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  slides: LessonModule[];
}

export default function LessonPreviewModal({
  isOpen,
  onClose,
  slides,
}: LessonPreviewModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentSlide = slides[currentIndex];

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const renderSlide = () => {
    if (!currentSlide) return null;

    const slideContent = currentSlide as LessonModule; // Cast to LessonModule type

    console.log("Slide Content:", slideContent);

    switch (slideContent.type) {
      case "markdown":
        return <MarkdownModule slide={slideContent} />;
      case "multiple_choice":
        return <MultipleChoiceModule slide={slideContent} />;
      case "single_choice":
        return <SingleChoiceModule slide={slideContent} />;
      case "reflection":
        return <ReflectionModule slide={slideContent} />;
      case "reveal":
        return <RevealModule slide={slideContent} />;
      default:
        return <p>Unsupported slide type: {slideContent}</p>;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full h-dvh px-4 flex flex-col justify-between">
        <div className="w-full">
          <div className="mb-6">{renderSlide()}</div>
        </div>
        <div className="flex justify-between mt-4">
          <Button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="bg-gray-300 text-black px-4 py-2 rounded"
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentIndex === slides.length - 1}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Next
          </Button>
        </div>
      </div>
    </Modal>
  );
}

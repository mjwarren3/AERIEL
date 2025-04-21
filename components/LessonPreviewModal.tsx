"use client";

import MarkdownModule from "@/components/lesson-modules/MarkdownModule";
import MultipleChoiceModule from "@/components/lesson-modules/MultipleChoiceModule";
import ReflectionModule from "@/components/lesson-modules/ReflectionModule";
import { useState } from "react";

import SingleChoiceModule from "./lesson-modules/SingleChoice";
import { LessonModule } from "@/types/lesson-modules";
import RevealModule from "./lesson-modules/RevealModule";
import PreviewModal from "./PreviewModal";
import { ChevronLeft } from "lucide-react";

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
    } else {
      console.log("No more slides to continue");
      // Close module
      onClose();
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const renderSlide = () => {
    if (!currentSlide) return null;

    const slideContent = currentSlide as LessonModule; // Cast to LessonModule type

    switch (slideContent.type) {
      case "markdown":
        return <MarkdownModule handleNext={handleNext} slide={slideContent} />;
      case "multiple_choice":
        return (
          <MultipleChoiceModule handleNext={handleNext} slide={slideContent} />
        );
      case "single_choice":
        return (
          <SingleChoiceModule handleNext={handleNext} slide={slideContent} />
        );
      case "reflection":
        return (
          <ReflectionModule handleNext={handleNext} slide={slideContent} />
        );
      case "reveal":
        return <RevealModule handleNext={handleNext} slide={slideContent} />;
      default:
        return <p>Unsupported slide type: {slideContent}</p>;
    }
  };

  const progressPercentage = (currentIndex / slides.length) * 100;

  return (
    <PreviewModal isOpen={isOpen} onClose={onClose}>
      <div className="w-full h-dvh flex flex-col items-center justify-between">
        {/* Progress Bar */}
        <div className="flex w-3/4 absolute top-6 ">
          <div className="w-full">
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden ">
              <div
                className="h-full bg-green-500 rounded-full duration-200 transition-all"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Slide Content */}

        <div className="w-full ">
          <div className="">{renderSlide()}</div>
        </div>
      </div>
      {currentIndex > 0 && (
        <ChevronLeft
          className="absolute top-4 left-4 cursor-pointer"
          onClick={handleBack}
        />
      )}
    </PreviewModal>
  );
}

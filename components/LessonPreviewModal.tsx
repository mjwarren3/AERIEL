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
import Button from "./Button";
import AnimatedDiv from "./AnimatedDiv";

interface LessonPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  slides: LessonModule[];
  lessonTitle: string;
  lessonDescription: string;
}

export default function LessonPreviewModal({
  isOpen,
  onClose,
  slides,
  lessonTitle,
  lessonDescription,
}: LessonPreviewModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const allSlides = [
    {
      type: "intro",
      question: lessonTitle,
      content: {
        text: lessonDescription,
      },
      order: 0,
    }, // Placeholder for IntroSlide
    ...slides,
    {
      type: "end",
      question: "End of Lesson",
      content: {
        text: "Thank you for completing the lesson!",
      },
      order: slides.length + 1,
    }, // Placeholder for EndSlide
  ];

  const currentSlide = allSlides[currentIndex];

  const handleNext = () => {
    if (currentIndex < allSlides.length - 1) {
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
      case "intro":
        return (
          <div className="flex flex-col items-center justify-center h-dvh max-h-[896px] p-4 text-white font-sans">
            <AnimatedDiv className="h-full w-full bg-gradient-12 rounded-lg flex justify-center items-center flex-col p-4">
              <h1 className="text-3xl font-extra bold text-center w-full">
                {slideContent.question}
              </h1>
              <p className="text-lg font-semibold text-center mb-3 w-full">
                {slideContent.content.text}
              </p>
              <div className="bg-green-900 text-white rounded-full px-3 text-sm mt-1 mb-2">
                {slides.length} modules
              </div>

              <Button onClick={handleNext} variant="primary">
                Start Lesson
              </Button>
            </AnimatedDiv>
          </div>
        );
      case "end":
        return (
          <div className="flex flex-col items-center justify-center h-dvh max-h-[896px] p-4 text-white font-sans">
            <AnimatedDiv className="h-full w-full bg-gradient-12 rounded-lg flex justify-center items-center flex-col p-4">
              <h1 className="text-3xl font-extra bold">Awesome job!</h1>
              <p className="text-base text-center mb-3">
                You&apos;ve finished the lesson! We hope you enjoyed it.
              </p>
              <p className="text-base text-center mb-3">
                Click the button below to start the next lesson in the course
              </p>
              <div className="flex gap-2">
                <Button onClick={onClose} className="border-white">
                  Close
                </Button>
                <Button variant="primary">Next Lesson</Button>
              </div>
            </AnimatedDiv>
          </div>
        );
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

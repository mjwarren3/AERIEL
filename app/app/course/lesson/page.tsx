"use client";
import { useState } from "react";
import MarkdownModule from "@/components/lesson-modules/MarkdownModule";
import ReflectionModule from "@/components/lesson-modules/ReflectionModule";
import ApplicationModule from "@/components/lesson-modules/ApplicationModule";
import TrueFalseModule from "@/components/lesson-modules/TrueFalseModule";
import MultipleChoiceModule from "@/components/lesson-modules/MultipleChoiceModule";
import { LessonModule } from "@/types/lesson-modules";
import Button from "@/components/Button";

const lesson_content: LessonModule[] = [
  {
    type: "markdown",
    content: `## What is Photosynthesis?

Photosynthesis is how plants make their own food. It involves:

- Capturing sunlight
- Converting CO₂ and water into glucose
- Releasing oxygen

### Key Formula:

6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂
`,
  },
  {
    type: "multiple_choice",
    question: "What is the main purpose of photosynthesis?",
    options: [
      {
        text: "Respiration",
        description:
          "Respiration is how organisms use oxygen to produce energy, not the purpose of photosynthesis.",
      },
      {
        text: "Energy conversion",
        description:
          "Correct! Photosynthesis converts light energy into chemical energy.",
      },
      {
        text: "Water filtration",
        description: "Water filtration is not related to photosynthesis.",
      },
      {
        text: "Reproduction",
        description:
          "Reproduction is a biological process, but it is not the purpose of photosynthesis.",
      },
    ],
    answer: "Energy conversion",
    right_answer_description:
      "Correct! Photosynthesis converts light energy into chemical energy.",
  },
  {
    type: "true_false",
    question: "Photosynthesis produces carbon dioxide as a byproduct.",
    answer: false,
    right_answer_description:
      "Correct! It actually produces oxygen, not carbon dioxide.",
    wrong_answer_description:
      "Incorrect. Photosynthesis consumes carbon dioxide and releases oxygen.",
  },
  {
    type: "reflection",
    prompt:
      "In your own words, why is photosynthesis important to life on Earth?",
  },
  {
    type: "application",
    task: "Observe a plant for a few minutes today. What signs of photosynthesis can you notice or infer? Write a short paragraph.",
  },
];

const ProgressBar = ({
  currentIndex,
  total,
}: {
  currentIndex: number;
  total: number;
}) => {
  const progress = ((currentIndex + 1) / total) * 100;
  return (
    <div className="w-full bg-gray-200 h-2 rounded">
      <div
        className="bg-green-500 h-2 rounded transition-all duration-300"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default function CourseLesson() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentLesson = lesson_content[currentIndex];

  const handleContinue = () => {
    if (currentIndex < lesson_content.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      console.log("Current Index Updated:", currentIndex + 1);
    } else {
      console.log("No more lessons to continue");
    }
  };

  const renderModule = () => {
    switch (currentLesson.type) {
      case "markdown":
        return <MarkdownModule content={currentLesson} />;
      case "multiple_choice":
        return <MultipleChoiceModule content={currentLesson} />;
      case "true_false":
        return <TrueFalseModule content={currentLesson} />;
      case "reflection":
        return <ReflectionModule content={currentLesson} />;
      case "application":
        return <ApplicationModule content={currentLesson} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full px-4 flex justify-center">
      <div className="w-full py-8 bg-white">
        <ProgressBar
          currentIndex={currentIndex}
          total={lesson_content.length}
        />
        <div className="mb-6 mt-6">{renderModule()}</div>
        <Button className="w-full mt-4" onClick={handleContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
}

import { MultipleChoice } from "@/types/lesson-modules";
import { useState, useEffect } from "react";
import AnimatedDiv from "@/components/AnimatedDiv";
import { useLessonContext } from "@/context/LessonContextProvider";

interface MultipleChoiceModuleProps {
  slide: MultipleChoice;
}

export default function MultipleChoiceModule({
  slide,
}: MultipleChoiceModuleProps) {
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const { setContinueEnabled } = useLessonContext();

  // Disable the "Continue" button by default
  useEffect(() => {
    setContinueEnabled(false);
  }, [setContinueEnabled]);

  const isCorrect =
    userAnswers.length > 0 &&
    userAnswers.every((answer) =>
      slide.content.correct_answer.includes(answer)
    ) &&
    slide.content.correct_answer.length === userAnswers.length;

  const handleAnswerToggle = (answer: string) => {
    setUserAnswers((prev) => {
      if (prev.includes(answer)) {
        // Remove the answer if it's already selected
        return prev.filter((a) => a !== answer);
      } else {
        // Add the answer if it's not selected
        return [...prev, answer];
      }
    });
  };

  useEffect(() => {
    // Enable the "Continue" button only if the user selects the correct answers
    setContinueEnabled(isCorrect);
  }, [isCorrect, setContinueEnabled]);

  return (
    <AnimatedDiv>
      <h2 className="font-semibold">{slide.question}</h2>
      <div className="flex flex-wrap gap-2 mt-4">
        {slide.content.options.map((option, idx) => (
          <button
            key={idx}
            className={`px-4 py-2 rounded ${
              userAnswers.includes(option)
                ? slide.content.correct_answer.includes(option)
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => handleAnswerToggle(option)}
          >
            {option}
          </button>
        ))}
      </div>
      {userAnswers.length > 0 && (
        <p
          className={`mt-4 font-semibold ${
            isCorrect ? "text-green-600" : "text-red-600"
          }`}
        >
          {isCorrect
            ? slide.content.correct_answer_description
            : slide.content.wrong_answer_description}
        </p>
      )}
    </AnimatedDiv>
  );
}

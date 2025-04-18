import { SingleChoice } from "@/types/lesson-modules";
import { useState, useEffect } from "react";
import AnimatedDiv from "@/components/AnimatedDiv";
import { useLessonContext } from "@/context/LessonContextProvider";

interface SingleChoiceModuleProps {
  slide: SingleChoice;
}

export default function SingleChoiceModule({ slide }: SingleChoiceModuleProps) {
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const { setContinueEnabled } = useLessonContext();

  // Disable the "Continue" button by default
  useEffect(() => {
    setContinueEnabled(false);
  }, [setContinueEnabled]);

  const isCorrect = userAnswer === slide.content.correct_answer;

  const handleAnswer = (answer: string) => {
    setUserAnswer(answer);
    if (answer === slide.content.correct_answer) {
      setContinueEnabled(true); // Enable the "Continue" button if the answer is correct
    } else {
      setContinueEnabled(false); // Keep the "Continue" button disabled if the answer is incorrect
    }
  };

  return (
    <AnimatedDiv>
      <h2 className="font-semibold">{slide.question}</h2>
      <div className="flex flex-wrap gap-2 mt-4">
        {slide.content.options.map((option, idx) => (
          <button
            key={idx}
            className={`px-4 py-2 rounded ${
              userAnswer === slide.content.correct_answer
                ? isCorrect
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => handleAnswer(option)}
          >
            {option}
          </button>
        ))}
      </div>
      {userAnswer !== null && (
        <p
          className={`mt-4 font-semibold ${
            isCorrect ? "text-green-600" : "text-red-600"
          }`}
        >
          {isCorrect
            ? slide.content.correct_answer_description
            : slide.content.options.find((option) => option === userAnswer)}
        </p>
      )}
    </AnimatedDiv>
  );
}

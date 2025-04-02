import { TrueFalse } from "@/types/lesson-modules";
import { useState, useEffect } from "react";
import AnimatedDiv from "@/components/AnimatedDiv";
import { useLessonContext } from "@/context/LessonContextProvider";

interface TrueFalseModuleProps {
  content: TrueFalse;
}

export default function TrueFalseModule({ content }: TrueFalseModuleProps) {
  const [userAnswer, setUserAnswer] = useState<boolean | null>(null);
  const { setContinueEnabled } = useLessonContext();

  // Disable the "Continue" button by default
  useEffect(() => {
    setContinueEnabled(false);
  }, [setContinueEnabled]);

  const isCorrect = userAnswer === content.answer;

  const handleAnswer = (answer: boolean) => {
    setUserAnswer(answer);
    if (answer === content.answer) {
      setContinueEnabled(true); // Enable the "Continue" button if the answer is correct
    } else {
      setContinueEnabled(false); // Keep the "Continue" button disabled if the answer is incorrect
    }
  };

  return (
    <AnimatedDiv>
      <h2 className="font-semibold">{content.question}</h2>
      <div className="flex gap-4 mt-4">
        <button
          className={`px-4 py-2 rounded ${
            userAnswer === true
              ? isCorrect
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={() => handleAnswer(true)}
        >
          True
        </button>
        <button
          className={`px-4 py-2 rounded ${
            userAnswer === false
              ? isCorrect
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={() => handleAnswer(false)}
        >
          False
        </button>
      </div>
      {userAnswer !== null && (
        <p
          className={`mt-4 font-semibold ${
            isCorrect ? "text-green-600" : "text-red-600"
          }`}
        >
          {isCorrect
            ? content.right_answer_description
            : content.wrong_answer_description}
        </p>
      )}
    </AnimatedDiv>
  );
}

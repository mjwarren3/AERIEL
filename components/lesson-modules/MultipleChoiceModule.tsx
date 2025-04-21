import { MultipleChoice } from "@/types/lesson-modules";
import { useState } from "react";
import AnimatedDiv from "@/components/AnimatedDiv";
import Button from "@/components/Button";

interface MultipleChoiceModuleProps {
  slide: MultipleChoice;
  handleNext: () => void;
}

export default function MultipleChoiceModule({
  slide,
  handleNext,
}: MultipleChoiceModuleProps) {
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [isChecked, setIsChecked] = useState(false);

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
    setIsChecked(false); // Reset the check state when a new answer is selected
  };

  const handleCheck = () => {
    setIsChecked(true);
  };

  return (
    <AnimatedDiv className="flex flex-col justify-between max-h-[896px] bg-white h-dvh font-sans">
      <div className="w-full mt-16 px-8">
        <h1 className="gradient-text">{slide.question}</h1>
        <div className="text-gray-500 my-2">Select all that apply</div>
        <div className="flex flex-col w-full gap-2 mt-4">
          {slide.content.options.map((option, idx) => (
            <button
              key={idx}
              className={`px-4 py-2 rounded-lg cursor-pointer ${
                userAnswers.includes(option)
                  ? isChecked
                    ? isCorrect
                      ? "bg-gradient-to-r from-teal-500 to-green-500 text-white"
                      : "bg-gradient-to-r from-red-400 to-rose-500 text-white"
                    : "bg-black text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => handleAnswerToggle(option)}
            >
              {option}
            </button>
          ))}
        </div>
        {isChecked && (
          <p
            className={`mt-4 ${isCorrect ? "text-gray-500" : "text-gray-500"}`}
          >
            {isCorrect
              ? slide.content.correct_answer_description
              : slide.content.wrong_answer_description}
          </p>
        )}
      </div>
      <div className="w-full">
        {!isChecked || !isCorrect ? (
          <div className="w-full rounded-t-xl pb-4 px-4 pt-2">
            <Button
              onClick={handleCheck}
              className="w-full"
              disabled={userAnswers.length === 0} // Disable the button if no answers are selected
            >
              {userAnswers.length === 0 ? "Select Answers" : "Check"}
            </Button>
          </div>
        ) : (
          isCorrect && (
            <div className="w-full bg-green-200 rounded-t-xl pb-4 px-4 pt-2">
              <AnimatedDiv>
                <h4 className="text-green-800">Great work!</h4>
              </AnimatedDiv>
              <Button
                onClick={handleNext}
                className="w-full bg-green-800 text-white border-green-800 hover:bg-green-600 hover:border-green-600 mt-1"
              >
                Continue
              </Button>
            </div>
          )
        )}
      </div>
    </AnimatedDiv>
  );
}

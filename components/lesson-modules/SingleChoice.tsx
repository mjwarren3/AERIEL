import { SingleChoice } from "@/types/lesson-modules";
import { useState } from "react";
import AnimatedDiv from "@/components/AnimatedDiv";
import Button from "@/components/Button";

interface SingleChoiceModuleProps {
  slide: SingleChoice;
  handleNext: () => void;
}

export default function SingleChoiceModule({
  slide,
  handleNext,
}: SingleChoiceModuleProps) {
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);

  const isCorrect = userAnswer === slide.content.correct_answer;

  const handleCheck = () => {
    setIsChecked(true);
  };

  const handleAnswer = (answer: string) => {
    setUserAnswer(answer);
    setIsChecked(false); // Reset the check state when a new answer is selected
  };

  return (
    <AnimatedDiv className="flex flex-col justify-between max-h-[896px] bg-white  h-dvh font-sans">
      <div className="w-full mt-16 px-8">
        <h1 className="gradient-text">{slide.question}</h1>
        <div className="text-gray-500 my-2">Select one</div>
        <div className="flex flex-col w-full gap-2 mt-4">
          {slide.content.options.map((option, idx) => (
            <button
              key={idx}
              className={`px-4 py-2 rounded-lg cursor-pointer ${
                userAnswer === option
                  ? isChecked
                    ? isCorrect
                      ? "bg-gradient-to-r from-teal-500 to-green-500 text-white"
                      : "bg-gradient-to-r from-red-400 to-rose-500 text-white"
                    : "bg-black text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => handleAnswer(option)}
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
              disabled={!userAnswer} // Disable the button if no answer is selected
            >
              {!userAnswer ? "Select an Answer" : "Check"}
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

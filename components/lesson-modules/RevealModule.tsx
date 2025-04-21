import AnimatedDiv from "@/components/AnimatedDiv";
import { useLessonContext } from "@/context/LessonContextProvider";
import { Reveal } from "@/types/lesson-modules";
import { useEffect, useState } from "react";
import Button from "@/components/Button";

export default function RevealModule({
  slide,
  handleNext,
}: {
  slide: Reveal;
  handleNext: () => void;
}) {
  const { setContinueEnabled } = useLessonContext();
  const [isRevealed, setIsRevealed] = useState(false);

  // Ensure the "Continue" button is disabled until the answer is revealed
  useEffect(() => {
    setContinueEnabled(isRevealed);
  }, [isRevealed, setContinueEnabled]);

  const handleReveal = () => {
    setIsRevealed(true);
  };

  return (
    <AnimatedDiv className="flex flex-col justify-between max-h-[896px] bg-white h-dvh font-sans">
      <div className="w-full mt-16 px-8">
        <h1 className="gradient-text">{slide.question}</h1>
        <div className="relative mt-6 rounded-lg p-6 bg-gray-100 ">
          {/* The text is always present */}
          <div
            className={`text-gray-800 text-lg font-medium ${
              !isRevealed ? "blur-sm" : ""
            }`}
          >
            ✨ {slide.content.correct_answer} ✨
          </div>

          {/* Blur overlay */}
          {!isRevealed && (
            <div className="absolute inset-0 rounded-lg pointer-events-none">
              {/* Blur layer */}
              <div className="absolute inset-0  z-0 rounded-lg" />

              {/* Button layer */}
              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-auto">
                <Button
                  onClick={handleReveal}
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-2 rounded-lg hover:from-purple-600 hover:to-indigo-600 border-0 border-transparent"
                >
                  Reveal
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      {isRevealed && (
        <div className="w-full bg-green-200 rounded-t-xl pb-4 px-4 pt-2 mt-4">
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
      )}
    </AnimatedDiv>
  );
}

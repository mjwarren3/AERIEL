import AnimatedDiv from "@/components/AnimatedDiv";
import { useLessonContext } from "@/context/LessonContextProvider";
import { Reveal } from "@/types/lesson-modules";
import { useEffect, useState } from "react";

export default function RevealModule({ slide }: { slide: Reveal }) {
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
    <AnimatedDiv>
      <h2 className="font-semibold">{slide.question}</h2>
      <div className="relative mt-4 border rounded p-4 bg-gray-100">
        {!isRevealed ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-300 bg-opacity-75">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={handleReveal}
            >
              Reveal
            </button>
          </div>
        ) : (
          <p className="text-gray-800">{slide.content.correct_answer}</p>
        )}
      </div>
    </AnimatedDiv>
  );
}

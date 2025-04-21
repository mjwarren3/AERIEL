import AnimatedDiv from "@/components/AnimatedDiv";
import Button from "@/components/Button";
import { useState } from "react";
import { getReflectionResponse } from "@/app/actions/getReflectionResponse";
import { Reflection } from "@/types/lesson-modules";

export default function ReflectionModule({
  slide,
  handleNext,
}: {
  slide: Reflection;
  handleNext: () => void;
}) {
  const [reflection, setReflection] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [aiResponse, setAiResponse] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!reflection.trim()) return;

    setLoading(true);
    try {
      // Pass both the original prompt and the user's reflection to the AI
      const response = await getReflectionResponse(slide.question, reflection);
      setAiResponse(response ? response.split("\n\n") : ["No response"]); // Split AI response into paragraphs
      setSubmitted(true);
    } catch (error) {
      console.error("Error fetching AI response:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedDiv className="flex flex-col justify-between max-h-[896px] bg-white h-dvh font-sans">
      <div className="w-full mt-16 px-8">
        {!submitted ? (
          <>
            <h3 className="gradient-text">{slide.question}</h3>
            <textarea
              className="w-full border rounded p-2 mt-4"
              rows={4}
              placeholder="Write your thoughts here..."
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
            ></textarea>
          </>
        ) : (
          <>
            <h3 className="gradient-text">{slide.question}</h3>
            <p className="text-gray-500 text-sm mt-4 italic">
              Your Reflection: {reflection}
            </p>
            <div className="space-y-4 mt-4">
              {aiResponse.map((paragraph, idx) => (
                <AnimatedDiv key={idx} className="text-gray-700 text-sm">
                  {paragraph}
                </AnimatedDiv>
              ))}
            </div>
          </>
        )}
      </div>
      {submitted ? (
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
      ) : (
        <div className="w-full  pb-4 px-4 pt-2 mt-4">
          <div
            onClick={handleNext}
            className="text-sm hover:underline cursor-pointer text-center font-semibold text-gray-500"
          >
            Skip Reflection
          </div>
          <Button
            onClick={handleSubmit}
            className="w-full mt-4"
            disabled={!reflection.trim() || loading}
          >
            {loading ? "Submitting..." : "Submit Reflection"}
          </Button>
        </div>
      )}
    </AnimatedDiv>
  );
}

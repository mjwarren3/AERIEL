import AnimatedDiv from "@/components/AnimatedDiv";
import { useLessonContext } from "@/context/LessonContextProvider";
import { Reflection } from "@/types/lesson-modules";
import { useEffect } from "react";

export default function ReflectionModule({ content }: { content: Reflection }) {
  const { setContinueEnabled } = useLessonContext();

  // Ensure the "Continue" button is enabled by default for Markdown modules
  useEffect(() => {
    setContinueEnabled(true);
  }, [setContinueEnabled]);
  return (
    <AnimatedDiv>
      <h2 className="font-semibold">{content.prompt}</h2>
      <textarea
        className="w-full border rounded p-2 mt-4"
        rows={4}
        placeholder="Your thoughts here..."
      ></textarea>
    </AnimatedDiv>
  );
}

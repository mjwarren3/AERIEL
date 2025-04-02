import AnimatedDiv from "@/components/AnimatedDiv";
import { useLessonContext } from "@/context/LessonContextProvider";
import { Application } from "@/types/lesson-modules";
import { useEffect } from "react";

export default function ApplicationModule({
  content,
}: {
  content: Application;
}) {
  const { setContinueEnabled } = useLessonContext();

  // Ensure the "Continue" button is enabled by default for Markdown modules
  useEffect(() => {
    setContinueEnabled(true);
  }, [setContinueEnabled]);
  return (
    <AnimatedDiv>
      <h2 className="font-semibold">{content.task}</h2>
      <textarea
        className="w-full border rounded p-2 mt-4"
        rows={4}
        placeholder="Your response here..."
      ></textarea>
    </AnimatedDiv>
  );
}

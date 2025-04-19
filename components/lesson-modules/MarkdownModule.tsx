import AnimatedDiv from "@/components/AnimatedDiv";
import { useLessonContext } from "@/context/LessonContextProvider";
import { Markdown } from "@/types/lesson-modules";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";

export default function MarkdownModule({ slide }: { slide: Markdown }) {
  const { setContinueEnabled } = useLessonContext();

  console.log("Content", slide);

  // Ensure the "Continue" button is enabled by default for Markdown modules
  useEffect(() => {
    setContinueEnabled(true);
  }, [setContinueEnabled]);

  return (
    <AnimatedDiv>
      <h2 className="font-semibold">{slide.question}</h2>
      <div className="space-y-3">
        <ReactMarkdown>{slide.content.text}</ReactMarkdown>
      </div>
    </AnimatedDiv>
  );
}

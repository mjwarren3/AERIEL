import AnimatedDiv from "@/components/AnimatedDiv";
import { useLessonContext } from "@/context/LessonContextProvider";
import { Markdown } from "@/types/lesson-modules";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";

export default function MarkdownModule({ content }: { content: Markdown }) {
  const { setContinueEnabled } = useLessonContext();

  // Ensure the "Continue" button is enabled by default for Markdown modules
  useEffect(() => {
    setContinueEnabled(true);
  }, [setContinueEnabled]);

  return (
    <AnimatedDiv>
      <ReactMarkdown>{content.content}</ReactMarkdown>
    </AnimatedDiv>
  );
}

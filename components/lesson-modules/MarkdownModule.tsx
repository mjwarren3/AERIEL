import AnimatedDiv from "@/components/AnimatedDiv";
import { Markdown } from "@/types/lesson-modules";
import ReactMarkdown from "react-markdown";
import Button from "../Button";

export default function MarkdownModule({
  slide,
  handleNext,
}: {
  slide: Markdown;
  handleNext: () => void;
}) {
  return (
    <AnimatedDiv className="flex flex-col justify-between max-h-[896px] bg-white px-8 pb-4 h-dvh font-sans">
      <div className="w-full mt-16">
        <h1 className="gradient-text">{slide.question}</h1>
        <div className="space-y-3 text-xl mt-4">
          <ReactMarkdown>{slide.content.text}</ReactMarkdown>
        </div>
      </div>
      <Button onClick={handleNext} className="w-full">
        Continue
      </Button>
    </AnimatedDiv>
  );
}

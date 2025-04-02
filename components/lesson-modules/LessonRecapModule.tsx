import { LessonRecap } from "@/types/lesson-modules";
import AnimatedDiv from "@/components/AnimatedDiv";

interface LessonRecapModuleProps {
  content: LessonRecap;
}

export default function LessonRecapModule({ content }: LessonRecapModuleProps) {
  return (
    <AnimatedDiv>
      <h2 className="font-semibold">Lesson Recap</h2>
      <ul className="list-disc pl-6 mt-4">
        {content.bullets.map((bullet, idx) => (
          <li key={idx} className="mb-2">
            {bullet}
          </li>
        ))}
      </ul>
    </AnimatedDiv>
  );
}

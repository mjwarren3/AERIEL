export interface Markdown {
  type: "markdown";
  content: string;
}

export interface MultipleChoice {
  type: "multiple_choice";
  question: string;
  options: {
    text: string;
    description: string; // Feedback for this specific option
  }[];
  answer: string; // The correct answer (matches one of the option texts)
  right_answer_description: string; // General feedback for the correct answer
}

export interface TrueFalse {
  type: "true_false";
  question: string;
  answer: boolean;
  right_answer_description: string;
  wrong_answer_description: string;
}

export interface Reflection {
  type: "reflection";
  prompt: string;
}

export interface Application {
  type: "application";
  task: string;
}

export interface LessonRecap {
  type: "lesson_recap";
  bullets: string[]; // List of bullet points summarizing the lesson
}

// Union type for all lesson module types
export type LessonModule =
  | Markdown
  | MultipleChoice
  | TrueFalse
  | Reflection
  | Application
  | LessonRecap;

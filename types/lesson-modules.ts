export interface Markdown {
  id?: number;
  type: "markdown"; // A markdown module attempts to teach a concept or idea
  question: string; // This represents the title of the module, which can be represented as a topic or question
  order: number; // The order of the module in the lesson, this is a number that represents the order of the module in the lesson
  content: {
    text: string; // This is the markdown content of the module, it should be a string that can be parsed by a markdown parser and it thoroughly explains the concept or idea in a parent-friendly tone
  };
}

export interface SingleChoice {
  id?: number;
  type: "single_choice"; // A single choice module is a question with two or more options, but only one of them is correct
  question: string; // This is the question being asked in the module
  order: number; // The order of the module in the lesson, this is a number that represents the order of the module in the lesson
  content: {
    options: string[]; // The options for the question, this is an array of strings
    correct_answer: string; // The correct answer (matches one of the option texts)
    correct_answer_description: string; // Feedback to the user if they select the correct answer - it should be encouraging in a parent-friendly tone
    wrong_answer_description: string; // Feedback to the user if they select the wrong answer that nudges them towards the correct answer, but it does not tell them the answer directly - it should be encouraging in a parent-friendly tone
  };
}

export interface MultipleChoice {
  id?: number;
  type: "multiple_choice"; // A multiple choice module is a question with two or more options, but one or more of them can be correct
  question: string; // The question being asked in the module
  order: number; // The order of the module in the lesson, this is a number that represents the order of the module in the lesson
  content: {
    options: string[]; // The options for the question, this is an array of strings
    correct_answer: string[]; // The correct answers (matches the option texts)
    correct_answer_description: string; // General feedback for the correct answer
    wrong_answer_description: string; // General feedback for the wrong answer, this should nudge the user towards the correct answer, but it does not tell them the answer directly - it should be encouraging in a parent-friendly tone
  };
}

export interface Reflection {
  id?: number;
  type: "reflection"; // A reflection module is a question that asks the user to reflect on their own experiences or feelings, or it presents them a scenario and asks them to reflect on what they would do in that situation
  question: string; // The reflection question or scenario being presented to the user
  order: number; // The order of the module in the lesson, this is a number that represents the order of the module in the lesson
  content: {
    response_context: string; // Context for the reflection question, this is a string that is provided as guidance to AI in how to respond to the user's reflection, and nudges them towards the correct answer, but it does not tell them the answer directly - it should be encouraging in a parent-friendly tone
  };
}

export interface Reveal {
  id?: number;
  type: "reveal"; // A reveal module is a question presented to the user, and then reveals the answer to them
  question: string; // The question being asked in the module
  order: number; // The order of the module in the lesson, this is a number that represents the order of the module in the lesson
  content: {
    correct_answer: string; // The answer to be revealed to the uesr
  };
}

// Union type for all lesson module types
export type LessonModule =
  | Markdown
  | SingleChoice
  | MultipleChoice
  | Reflection
  | Reveal;

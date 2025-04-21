"use server";

import OpenAI from "openai";
import {
  LessonModule,
  Markdown,
  SingleChoice,
  MultipleChoice,
  Reflection,
  Reveal,
} from "@/types/lesson-modules";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function generateSlidesFromLessonData({
  title,
  description,
  lessonCount,
  additionalContext,
}: {
  title: string;
  description: string;
  lessonCount: number;
  additionalContext?: string;
}): Promise<LessonModule[]> {
  console.log("Executing generate slides from lesson data");

  const res = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `
You are generating slide content for a dynamic, AI-assisted learning module. Return a JSON array of slides. Each slide must match one of the following types:

1. **Markdown**:
   - Purpose: A markdown module attempts to teach a concept or idea.
   - Format:
     {
       "type": "markdown",
       "question": "What is Markdown?",
       "order": 1,
       "content": {
         "text": "Markdown is a lightweight markup language for creating formatted text using a plain-text editor."
       }
     }

2. **SingleChoice**:
   - Purpose: A single choice module is a question with two or more options, but only one of them is correct.
   - Format:
     {
       "type": "single_choice",
       "question": "What is the capital of France?",
       "order": 2,
       "content": {
         "options": ["Paris", "London", "Berlin"],
         "correct_answer": "Paris",
         "correct_answer_description": "Correct! Paris is the capital of France.",
         "wrong_answer_description": "Incorrect. The correct answer is Paris."
       }
     }

3. **MultipleChoice**:
   - Purpose: A multiple choice module is a question with two or more options, but one or more of them can be correct.
   - Format:
     {
       "type": "multiple_choice",
       "question": "Which of the following are fruits?",
       "order": 3,
       "content": {
         "options": ["Apple", "Carrot", "Banana"],
         "correct_answer": ["Apple", "Banana"],
         "correct_answer_description": "Correct! Apples and bananas are fruits.",
         "wrong_answer_description": "Incorrect. Carrots are vegetables."
       }
     }

4. **Reflection**:
   - Purpose: A reflection module asks the user to reflect on their own experiences or feelings, or it presents them a scenario and asks them to reflect on what they would do in that situation.
   - Format:
     {
       "type": "reflection",
       "question": "What are your thoughts on climate change?",
       "order": 4,
       "content": {
         "response_context": "Provide a thoughtful response about the importance of addressing climate change."
       }
     }

5. **Reveal**:
   - Purpose: A reveal module is a question presented to the user, and then reveals the answer to them.
   - Format:
     {
       "type": "reveal",
       "question": "What is the largest planet in our solar system?",
       "order": 5,
       "content": {
         "correct_answer": "Jupiter"
       }
     }

     Make sure to include a Markdown slide for every other slide. The information on the Markdown slide should help inform an exercise on the slide that comes after it.

Ensure that each slide matches one of these types and includes the required fields. Return only valid JSON.
`.trim(),
      },
      {
        role: "user",
        content: `Generate ${lessonCount} slides for a lesson titled "${title}". Description of the lesson: ${description}. Some additional context to consider is: ${additionalContext}. The slides should be in the format specified above.`,
      },
    ],
  });

  const raw = res.choices[0].message.content ?? "[]";

  try {
    const slides = JSON.parse(raw);

    // Validate each slide
    const validSlides: LessonModule[] = [];
    slides.forEach((slide: LessonModule, index: number) => {
      if (isValidLessonModule(slide)) {
        validSlides.push(slide);
      } else {
        console.error(`Invalid slide at index ${index}:`, slide);
      }
    });

    return validSlides;
  } catch (err) {
    console.error("Failed to parse OpenAI response", err);
    return [];
  }
}

// Validation function to check if a slide matches one of the LessonModule types
function isValidLessonModule(slide: LessonModule): slide is LessonModule {
  switch (slide.type) {
    case "markdown":
      return validateMarkdown(slide);
    case "single_choice":
      return validateSingleChoice(slide);
    case "multiple_choice":
      return validateMultipleChoice(slide);
    case "reflection":
      return validateReflection(slide);
    case "reveal":
      return validateReveal(slide);
    default:
      return false;
  }
}

// Validators for each type
function validateMarkdown(slide: LessonModule): slide is Markdown {
  return (
    slide.type === "markdown" &&
    typeof slide.question === "string" &&
    typeof slide.order === "number" &&
    slide.content &&
    typeof slide.content.text === "string"
  );
}

function validateSingleChoice(slide: LessonModule): slide is SingleChoice {
  return (
    slide.type === "single_choice" &&
    typeof slide.question === "string" &&
    typeof slide.order === "number" &&
    slide.content &&
    Array.isArray(slide.content.options) &&
    slide.content.options.every((opt: unknown) => typeof opt === "string") &&
    typeof slide.content.correct_answer === "string" &&
    typeof slide.content.correct_answer_description === "string" &&
    typeof slide.content.wrong_answer_description === "string"
  );
}

function validateMultipleChoice(slide: LessonModule): slide is MultipleChoice {
  return (
    slide.type === "multiple_choice" &&
    typeof slide.question === "string" &&
    typeof slide.order === "number" &&
    slide.content &&
    Array.isArray(slide.content.options) &&
    slide.content.options.every((opt: unknown) => typeof opt === "string") &&
    Array.isArray(slide.content.correct_answer) &&
    slide.content.correct_answer.every(
      (ans: unknown) => typeof ans === "string"
    ) &&
    typeof slide.content.correct_answer_description === "string" &&
    typeof slide.content.wrong_answer_description === "string"
  );
}

function validateReflection(slide: LessonModule): slide is Reflection {
  return (
    slide.type === "reflection" &&
    typeof slide.question === "string" &&
    typeof slide.order === "number" &&
    slide.content &&
    typeof slide.content.response_context === "string"
  );
}

function validateReveal(slide: LessonModule): slide is Reveal {
  return (
    slide.type === "reveal" &&
    typeof slide.question === "string" &&
    typeof slide.order === "number" &&
    slide.content &&
    typeof slide.content.correct_answer === "string"
  );
}

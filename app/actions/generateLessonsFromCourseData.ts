// app/actions/generateLessonsFromCourseData.ts

"use server";

import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function generateLessonsFromCourseData({
  title,
  description,

  lessonCount,
}: {
  title: string;
  description: string;

  lessonCount: number;
}) {
  console.log("Executing generate lessons from course data");

  const res = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          "You are helping generate a course outline. Return a JSON array of lessons. Each item should have: lesson_title, lesson_description, and lesson_order. Don't title things 'lesson 1', 'lesson 2', etc. Instead, use descriptive titles. lesson_order should start with 0, and increment by 1.",
      },
      {
        role: "user",
        content: `Course title: ${title}\nDescription: ${description}\nLessons: ${lessonCount}`,
      },
    ],
  });

  console.log("Unparsed response:", res.choices[0].message.content);

  const raw = res.choices[0].message.content ?? "[]";

  console.log("Parsed response:", raw);

  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

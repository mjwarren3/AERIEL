"use server";

import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function getClarification(topic: string) {
  const res = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          "Ask one short clarification question to better understand what the user wants to learn about this topic.",
      },
      {
        role: "user",
        content: topic,
      },
    ],
  });

  return res.choices[0].message.content;
}

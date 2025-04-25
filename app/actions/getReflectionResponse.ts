"use server";

import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function getReflectionResponse(
  prompt: string,
  reflection: string
) {
  const res = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          "You are a kind and empathetic therapist. Provide thoughtful and therapeutic feedback to the user's reflection based on the original prompt. Keep the response to 1-2 sentences. If its not a reflective question, don't be as emotional. Don't respond with any questions to the user, no matter what. If they don't answer the reflective question, just say 'I see you didn't answer the reflective question. I hope you can reflect on future reflection questions.'",
      },
      {
        role: "user",
        content: `Prompt: ${prompt}\n\nReflection: ${reflection}`,
      },
    ],
  });

  return res.choices[0].message.content;
}

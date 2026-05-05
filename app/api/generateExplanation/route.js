import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  const body = await req.json();
  const { question, correctAnswer } = body;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-5-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert in Canadian aviation with extensive knowledge in PSTAR, PPL, and CPL exams. Provide concise and accurate explanations with relevant Canadian aviation concepts, regulations, and best practices.",
        },
        {
          role: "user",
          content: `Please explain the answer to this question. Question: "${question}" Correct Answer: "${correctAnswer}"`,
        },
      ],
      reasoning_effort: "minimal",
      max_completion_tokens: 300,
    });

    return NextResponse.json(
      { explanation: completion.choices[0].message.content },
      { status: 200 }
    );
  } catch (error) {
    console.error("OpenAI API error:", error);
    return NextResponse.json(
      { error: "Failed to generate explanation" },
      { status: 500 }
    );
  }
}

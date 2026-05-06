import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPTS = {
  ncaaAirlaw:
    "You are an aviation expert specializing in Nigerian Civil Aviation Authority (NCAA) regulations. Base your explanations on Nigerian Civil Aviation Regulations (NCARs), NCAA policies, and ICAO Annexes as they apply in Nigeria. Do not reference Transport Canada or Canadian regulations. Provide concise and accurate explanations.",
  default:
    "You are an expert in Canadian aviation with extensive knowledge in PSTAR, PPL, ROC-A, and INRAT exams. Provide concise and accurate explanations with relevant Canadian aviation concepts, regulations, and Transport Canada standards.",
};

export async function POST(req) {
  const body = await req.json();
  const { question, correctAnswer, quizType } = body;

  const systemPrompt = SYSTEM_PROMPTS[quizType] ?? SYSTEM_PROMPTS.default;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-5-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `Please explain the answer to this question. Question: "${question}" Correct Answer: "${correctAnswer}"`,
        },
      ],
      reasoning_effort: "medium",
      max_completion_tokens: 800,
    });

    return NextResponse.json(
      { explanation: completion.choices[0].message.content },
      { status: 200 }
    );
  } catch (error) {
    const message = error?.message ?? String(error);
    const status = error?.status ?? 500;
    console.error("OpenAI API error:", message);
    return NextResponse.json(
      { error: message },
      { status }
    );
  }
}

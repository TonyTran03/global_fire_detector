import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "'messages' must be an array" }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages,
    });

    return NextResponse.json({ completion: completion.choices[0].message });
  } catch (error) {
    console.error("Error with OpenAI API:", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

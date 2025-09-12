// src/app/api/gemini-chat/route.ts

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body;

    const latestMessage = messages?.[messages.length - 1]?.content;

    if (!latestMessage) {
      return NextResponse.json({ error: "Missing user message" }, { status: 400 });
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY not set" }, { status: 500 });
    }

    // ✅ FIX: use gemini-1.5-pro (or gemini-1.5-flash)
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${geminiApiKey}`;

    const response = await axios.post(
      url,
      {
        contents: [
          {
            role: 'user',
            parts: [{ text: latestMessage }],
          },
        ],
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    return NextResponse.json({ reply: reply || "Sorry, no response from Gemini." });
  } catch (error: any) {
    console.error("Gemini API error:", error?.response?.data || error.message);
    return NextResponse.json(
      { error: error?.response?.data || "Internal server error" },
      { status: 500 }
    );
  }
}

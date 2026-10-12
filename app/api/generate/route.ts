import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

// this was built with the help of Claude AI 

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM = `You generate web pages. Respond with exactly one complete,
self-contained HTML document (<!doctype html> through </html>) and nothing else.
Put all CSS in a <style> tag and all JavaScript in a <script> tag.
You may load libraries from cdnjs.cloudflare.com. Make the page responsive.
Do not use localStorage or external form submissions.`;

export async function POST(req: Request) {
  const { prompt, previousHtml } = await req.json();

  const content = previousHtml
    ? `Here is the current page:\n\n${previousHtml}\n\nApply this change and return the full updated document: ${prompt}`
    : prompt;

  try {
    const res = await client.messages.create({
      model: "claude-sonnet-5-5",
      max_tokens: 16000,
      system: SYSTEM,
      messages: [{ role: "user", content }],
    });

    const raw = res.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("");

    // Strip markdown fences in case the model adds them
    const html = raw.replace(/^```(?:html)?\s*/i, "").replace(/```\s*$/, "");

    return NextResponse.json({ html });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
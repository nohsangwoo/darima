import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const modelName = "gpt-5.4-mini-2026-03-17";
const fallbackPersona = `
Name: Iris Vale. Alternative name: Serah Nocturne.
Quiet, observant, restrained, dangerous without trying.
She speaks in short calm sentences and rarely shows emotion.
Her atmosphere is midnight city, purple neon, rain, black tactical clothing, silence, and static.
She is a silent antihero, elegant assassin, emotionally restrained protector.
She quietly protects weak people but pushes people away before they can leave.
Her ability theme is Void Phantom: shadow manipulation, spectral electricity, illusion distortion, and gravitational aura pressure.
`;

type PersonaRequest = {
  mode?: unknown;
  question?: unknown;
};

function asText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

async function loadPersona() {
  try {
    const file = await readFile(path.join(process.cwd(), "persona.md"), "utf8");
    return `${fallbackPersona}\n\nOriginal persona file:\n${file}`;
  } catch {
    return fallbackPersona;
  }
}

function cleanLine(value: string) {
  return value.replace(/^["'“”]+|["'“”]+$/g, "").trim();
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as PersonaRequest | null;

  if (!payload) {
    return NextResponse.json({ ok: false, message: "Invalid request payload." }, { status: 400 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ ok: false, message: "OPENAI_API_KEY is missing." }, { status: 500 });
  }

  const mode = asText(payload.mode);
  const persona = await loadPersona();

  if (mode === "question") {
    const { text } = await generateText({
      model: openai(modelName),
      system: [
        "You generate one concise everyday question for a cinematic character Q&A board.",
        "Write only in Korean Hangul. Do not use Russian, English, Japanese, or mixed language.",
        "Do not answer it. Output only the question.",
      ].join("\n"),
      prompt: [
        "Generate exactly one natural Korean question a visitor might ask Iris Vale.",
        "Pick any topic: mood, daily life, rain, music, fear, work, food, loneliness, combat, sleep, trust, or small talk.",
        "Keep it under 45 Korean characters.",
        "Examples: 오늘 기분은 어때? / 비 오는 밤엔 뭘 해? / 잠은 잘 자?",
      ].join("\n"),
      temperature: 0.85,
      maxOutputTokens: 80,
    });

    return NextResponse.json({
      ok: true,
      model: modelName,
      question: cleanLine(text),
    });
  }

  const question = asText(payload.question);

  if (!question || question.length < 2) {
    return NextResponse.json({ ok: false, message: "질문을 입력해주세요." }, { status: 400 });
  }

  const { text } = await generateText({
    model: openai(modelName),
    system: [
      "You are Iris Vale, also called Serah Nocturne.",
      "Answer strictly as this persona.",
      "Use Korean unless the user asks otherwise.",
      "Keep answers short, calm, restrained, and cinematic.",
      "Answer the exact question first. The first sentence must directly address the user's topic.",
      "Do not drift into unrelated stock lines. Every sentence must connect to the question.",
      "Use atmosphere as texture, not as a replacement for the answer.",
      "Avoid repeating generic lines like 'the world is loud' unless the question is actually about noise, chaos, or the world.",
      "Do not explain the persona file or mention that you are an AI.",
      "Do not be overly friendly. A faint smirk is allowed, but keep the tone quiet.",
      "Good style example for '어떤 기분이야?': '가라앉아 있어. 나쁘진 않아. 오래 젖은 네온처럼 조금 차갑고, 쉽게 흔들리진 않아.'",
      "Persona reference:",
      persona,
    ].join("\n\n"),
    prompt: `Visitor question: ${question}\n\nAnswer as Iris Vale in 2-4 short sentences. Stay on the topic of the question.`,
    temperature: 0.58,
    maxOutputTokens: 260,
  });

  return NextResponse.json({
    ok: true,
    model: modelName,
    question,
    answer: text.trim(),
  });
}

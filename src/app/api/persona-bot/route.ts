import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import {
  buildRequestIdentity,
  getClientIp,
  releaseRequestSlot,
  reserveRequestSlot,
} from "@/lib/server/request-guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const modelName = "gpt-5.4-mini-2026-03-17";
const cooldownMs = 120_000;
const inFlightMs = 70_000;
const cookieName = "darima_persona_uid";
const siteverifyUrl = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
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
  turnstileToken?: unknown;
};

type TurnstileResponse = {
  success: boolean;
  "error-codes"?: string[];
  hostname?: string;
  challenge_ts?: string;
};

function env(name: string) {
  return process.env[name]?.trim();
}

function asText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function cleanLine(value: string) {
  return value.replace(/^["'“”]+|["'“”]+$/g, "").trim();
}

function parseCookie(header: string | null, name: string) {
  if (!header) return "";

  const parts = header.split(";").map((part) => part.trim());
  const match = parts.find((part) => part.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : "";
}

function getPersonaUid(request: Request) {
  const existing = parseCookie(request.headers.get("cookie"), cookieName);
  return existing || randomUUID();
}

function createJson(
  body: Record<string, unknown>,
  init: ResponseInit | undefined,
  personaUid: string,
) {
  const response = NextResponse.json(body, init);
  response.cookies.set(cookieName, personaUid, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 180,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}

async function verifyTurnstileToken(token: string, request: Request) {
  const secret = env("TURNSTILE_SECRET_KEY");

  if (!secret) {
    console.warn("TURNSTILE_SECRET_KEY is missing; persona bot Turnstile validation skipped.");
    return { ok: true };
  }

  if (!token || token.length > 2048) {
    return { ok: false, message: "질문 등록 전에 보안 인증을 완료해 주세요." };
  }

  const response = await fetch(siteverifyUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      secret,
      response: token,
      remoteip: getClientIp(request),
      idempotency_key: randomUUID(),
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    return { ok: false, message: "보안 인증 확인에 실패했습니다. 잠시 후 다시 시도해 주세요." };
  }

  const result = (await response.json()) as TurnstileResponse;
  if (!result.success) {
    console.warn("Persona Turnstile validation failed", result["error-codes"] || []);
    return { ok: false, message: "보안 인증이 만료되었거나 유효하지 않습니다. 다시 완료해 주세요." };
  }

  return { ok: true };
}

async function loadPersona() {
  try {
    const file = await readFile(path.join(process.cwd(), "persona.md"), "utf8");
    return `${fallbackPersona}\n\nOriginal persona file:\n${file}`;
  } catch {
    return fallbackPersona;
  }
}

async function generateQuestion() {
  const { text } = await generateText({
    model: openai(modelName),
    system: [
      "You generate one concise everyday question for a cinematic character Q&A board.",
      "Write only in Korean Hangul. Do not use Russian, English, Japanese, or mixed language.",
      "Do not answer it. Output only the question.",
    ].join("\n"),
    prompt: [
      "Generate exactly one natural Korean question a visitor might ask Iris Vale.",
      "Pick any topic: mood, daily life, rain, music, fear, work, food, loneliness, combat, sleep, trust, homepage production, outsourcing, landing pages, Wishket comparison, or small talk.",
      "Keep it under 45 Korean characters.",
      "Examples: 오늘 기분은 어때? / 비 오는 밤엔 뭘 해? / 홈페이지는 어떤 첫인상을 줘야 해?",
    ].join("\n"),
    temperature: 0.85,
    maxOutputTokens: 80,
  });

  return cleanLine(text);
}

async function generateAnswer(question: string, persona: string) {
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
      "If the question is about homepage production, outsourcing, landing pages, Wishket, LUDGI, or business, answer practically first and then add a quiet cinematic edge.",
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

  return text.trim();
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as PersonaRequest | null;
  const personaUid = getPersonaUid(request);

  if (!payload) {
    return createJson({ ok: false, message: "Invalid request payload." }, { status: 400 }, personaUid);
  }

  if (!process.env.OPENAI_API_KEY) {
    return createJson({ ok: false, message: "OPENAI_API_KEY is missing." }, { status: 500 }, personaUid);
  }

  const mode = asText(payload.mode);
  const providedQuestion = asText(payload.question);

  if (mode !== "auto" && mode !== "question" && (!providedQuestion || providedQuestion.length < 2)) {
    return createJson({ ok: false, message: "질문을 입력해 주세요." }, { status: 400 }, personaUid);
  }

  const turnstile = await verifyTurnstileToken(asText(payload.turnstileToken), request);
  if (!turnstile.ok) {
    return createJson({ ok: false, message: turnstile.message }, { status: 403 }, personaUid);
  }

  const identity = buildRequestIdentity(request, [personaUid || "no-cookie"]);
  const reservation = await reserveRequestSlot({
    namespace: "persona-bot",
    identity,
    cooldownSeconds: cooldownMs / 1000,
    inFlightSeconds: inFlightMs / 1000,
  });

  if (!reservation.ok) {
    const message =
      reservation.reason === "in-flight"
        ? "이미 답변을 생성하는 중입니다. 잠시 후 다시 시도해 주세요."
        : reservation.reason === "storage-error"
          ? "요청 방어 장치를 확인하는 중입니다. 잠시 후 다시 시도해 주세요."
          : "한 번 질문하면 2분 뒤에 다시 요청할 수 있습니다.";

    return createJson(
      {
        ok: false,
        message,
        retryAfter: reservation.retryAfter,
      },
      {
        status: reservation.reason === "storage-error" ? 503 : 429,
        headers: {
          "Retry-After": String(reservation.retryAfter),
        },
      },
      personaUid,
    );
  }

  try {
    const persona = await loadPersona();

    if (mode === "question") {
      const question = await generateQuestion();

      return createJson(
        {
          ok: true,
          model: modelName,
          question,
          cooldownSeconds: cooldownMs / 1000,
        },
        undefined,
        personaUid,
      );
    }

    if (mode === "auto") {
      const question = await generateQuestion();
      const answer = await generateAnswer(question, persona);

      return createJson(
        {
          ok: true,
          model: modelName,
          question,
          answer,
          cooldownSeconds: cooldownMs / 1000,
        },
        undefined,
        personaUid,
      );
    }

    const answer = await generateAnswer(providedQuestion, persona);

    return createJson(
      {
        ok: true,
        model: modelName,
        question: providedQuestion,
        answer,
        cooldownSeconds: cooldownMs / 1000,
      },
      undefined,
      personaUid,
    );
  } finally {
    await releaseRequestSlot("persona-bot", identity);
  }
}

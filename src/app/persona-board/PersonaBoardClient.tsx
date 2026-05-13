"use client";

import { RefreshCw, Send, Sparkles, WandSparkles } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import TurnstileBox from "@/components/TurnstileBox";
import { usePersonaBoard } from "@/lib/persona-board-store";

type BotStatus = "idle" | "answer";

const pageSize = 5;

export default function PersonaBoardClient() {
  const [question, setQuestion] = useState("");
  const [status, setStatus] = useState<BotStatus>("idle");
  const [notice, setNotice] = useState("");
  const [turnstileEnabled, setTurnstileEnabled] = useState(false);
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const { entries, page, pageCount, registerAnswer, setPage, visibleEntries } = usePersonaBoard(pageSize);

  const cooldownRemaining = Math.max(0, Math.ceil((cooldownUntil - now) / 1000));
  const waitingForTurnstile = turnstileEnabled && !turnstileToken;
  const busy = status !== "idle";
  const requestBlocked = busy || cooldownRemaining > 0 || waitingForTurnstile;

  useEffect(() => {
    if (!cooldownUntil) return;

    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [cooldownUntil]);

  const resetPersonaTurnstile = () => {
    setTurnstileToken("");
    setTurnstileResetKey((value) => value + 1);
  };

  const handlePersonaResponse = async (response: Response) => {
    const result = (await response.json().catch(() => null)) as {
      answer?: string;
      cooldownSeconds?: number;
      message?: string;
      question?: string;
      retryAfter?: number;
    } | null;

    if (!response.ok || !result?.answer || !result.question) {
      if (response.status === 429 && result?.retryAfter) {
        setCooldownUntil(Date.now() + result.retryAfter * 1000);
      }

      throw new Error(result?.message || "응답 생성에 실패했습니다. 잠시 뒤 다시 시도해 주세요.");
    }

    registerAnswer(result.question, result.answer);
    setQuestion("");
    setCooldownUntil(Date.now() + (result.cooldownSeconds || 120) * 1000);
  };

  const submitQuestion = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextQuestion = question.trim();

    if (!nextQuestion) {
      setNotice("질문을 입력하거나 봇이 스스로 질문하게 해 주세요.");
      return;
    }

    try {
      setStatus("answer");
      setNotice("");

      const response = await fetch("/api/persona-bot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: "answer",
          question: nextQuestion,
          turnstileToken,
        }),
      });

      await handlePersonaResponse(response);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "응답 생성에 실패했습니다.");
    } finally {
      if (turnstileEnabled) {
        resetPersonaTurnstile();
      }
      setStatus("idle");
    }
  };

  const askRandom = async () => {
    try {
      setStatus("answer");
      setNotice("");

      const response = await fetch("/api/persona-bot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: "auto",
          turnstileToken,
        }),
      });

      await handlePersonaResponse(response);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "자동 질답 생성에 실패했습니다.");
    } finally {
      if (turnstileEnabled) {
        resetPersonaTurnstile();
      }
      setStatus("idle");
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[0.86fr_1.14fr]">
      <section className="border border-violet-300/20 bg-[#0d1020]/82 p-5 shadow-[0_0_44px_rgba(139,92,246,0.16)] backdrop-blur-xl">
        <div className="flex items-start justify-between gap-5 border-b border-white/10 pb-5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-pink-300">Question Console</p>
            <h2 className="mt-3 font-serif text-3xl text-white">질문 등록</h2>
          </div>
          <Sparkles className="text-violet-200" size={28} />
        </div>
        <form className="mt-5" onSubmit={submitQuestion}>
          <label className="block">
            <span className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">Prompt</span>
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              rows={7}
              disabled={busy}
              placeholder="홈페이지제작, 랜딩페이지, 아웃소싱, 위시켓 비교, 오늘 기분 같은 아무 질문이나 던져보세요."
              className="mt-3 min-h-44 w-full resize-none border border-white/10 bg-black/40 p-4 text-sm leading-7 text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-violet-300/50 focus:bg-black/60"
            />
          </label>
          <TurnstileBox
            className="mt-4 border border-white/10 bg-black/30 p-3 text-sm text-zinc-400"
            deferUntilVisible
            onEnabledChange={setTurnstileEnabled}
            onTokenChange={setTurnstileToken}
            resetKey={turnstileResetKey}
          />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={askRandom}
              disabled={requestBlocked}
              className="inline-flex items-center justify-center gap-2 border border-violet-300/35 bg-violet-500/10 px-4 py-3 text-xs uppercase tracking-[0.22em] text-violet-100 transition hover:bg-violet-500/20 disabled:cursor-not-allowed disabled:opacity-55"
            >
              {status === "answer" ? <RefreshCw className="animate-spin" size={17} /> : <WandSparkles size={17} />}
              봇이 질문하고 답하기
            </button>
            <button
              type="submit"
              disabled={requestBlocked}
              className="inline-flex items-center justify-center gap-2 border border-pink-300/35 bg-pink-500/14 px-4 py-3 text-xs uppercase tracking-[0.22em] text-white transition hover:bg-pink-500/24 disabled:cursor-not-allowed disabled:opacity-55"
            >
              {status === "answer" ? <RefreshCw className="animate-spin" size={17} /> : <Send size={17} />}
              질문 등록
            </button>
          </div>
          {cooldownRemaining > 0 ? (
            <p className="mt-4 border border-violet-300/20 bg-violet-500/10 p-3 text-sm text-violet-100">
              다음 질문까지 {cooldownRemaining}초 남았습니다.
            </p>
          ) : waitingForTurnstile ? (
            <p className="mt-4 border border-violet-300/20 bg-violet-500/10 p-3 text-sm text-violet-100">
              질문 등록 전에 보안 인증을 완료해 주세요.
            </p>
          ) : null}
          {notice ? <p className="mt-4 border border-pink-300/20 bg-pink-500/10 p-3 text-sm text-pink-100">{notice}</p> : null}
        </form>
      </section>

      <section className="min-h-[620px] border border-white/10 bg-[#080914]/82 p-5">
        <div className="flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-violet-300">Archive</p>
            <h2 className="mt-3 font-serif text-3xl text-white">AI 질답 게시판</h2>
          </div>
          <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Posts {entries.length}</p>
        </div>
        <div className="mt-5 grid gap-4">
          {visibleEntries.map((entry, index) => (
            <article key={entry.id} className="border border-white/10 bg-white/[0.035] p-5 transition hover:border-violet-300/35">
              <div className="flex items-center justify-between gap-3">
                <span className="border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-violet-200">
                  {entry.tag}
                </span>
                <span className="font-mono text-xs text-zinc-600">#{String(entries.length - (page * pageSize + index)).padStart(3, "0")}</span>
              </div>
              <h3 className="mt-4 text-xl font-semibold leading-8 text-white">{entry.question}</h3>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-zinc-400">{entry.answer}</p>
            </article>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(current - 1, 0))}
            disabled={page === 0}
            className="border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.22em] text-zinc-300 disabled:opacity-35"
          >
            Prev
          </button>
          <span className="font-mono text-xs text-zinc-500">
            {page + 1} / {pageCount}
          </span>
          <button
            type="button"
            onClick={() => setPage((current) => Math.min(current + 1, pageCount - 1))}
            disabled={page >= pageCount - 1}
            className="border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.22em] text-zinc-300 disabled:opacity-35"
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
}

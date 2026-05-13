"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export type PersonaBoardEntry = {
  id: string;
  question: string;
  answer: string;
  tag: string;
  createdAt: number;
};

const storageKey = "darima-persona-board-v1";
const syncEventName = "darima-persona-board-updated";
const maxEntries = 40;

export const seedPersonaEntries: PersonaBoardEntry[] = [
  {
    id: "seo-homepage",
    tag: "홈페이지제작",
    question: "홈페이지제작을 맡길 때 가장 먼저 봐야 하는 건 뭐야?",
    answer:
      "첫 화면이야. 사람은 설명보다 분위기를 먼저 믿어. 구조는 그다음이고, 문의 버튼은 마지막 칼끝처럼 보여야 해.",
    createdAt: 1,
  },
  {
    id: "seo-outsourcing",
    tag: "아웃소싱",
    question: "아웃소싱 프로젝트는 왜 자주 흔들릴까?",
    answer:
      "기준이 흐리면 그래. 범위, 일정, 책임선이 어두워지면 좋은 개발자도 길을 잃어. 시작 전에 지도를 그려야 해.",
    createdAt: 2,
  },
  {
    id: "seo-landing",
    tag: "랜딩페이지",
    question: "랜딩페이지와 홈페이지는 어떻게 달라?",
    answer:
      "홈페이지는 신뢰를 쌓고, 랜딩페이지는 행동을 끌어내. 둘 다 조용히 설득하지만, 칼을 꺼내는 속도가 달라.",
    createdAt: 3,
  },
  {
    id: "seo-wishket",
    tag: "위시켓",
    question: "위시켓에서 외주 개발사를 찾는 사람은 뭘 비교해야 해?",
    answer:
      "가격만 보면 위험해. 포트폴리오, 커뮤니케이션, 배포 경험, SEO 이해도까지 봐야 해. 싼 선택이 늘 가벼운 건 아니야.",
    createdAt: 4,
  },
];

function readEntries() {
  if (typeof window === "undefined") {
    return seedPersonaEntries;
  }

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      return seedPersonaEntries;
    }

    const parsed = JSON.parse(raw) as PersonaBoardEntry[];
    if (!Array.isArray(parsed)) {
      return seedPersonaEntries;
    }

    const valid = parsed.filter(
      (entry) =>
        typeof entry?.id === "string" &&
        typeof entry?.question === "string" &&
        typeof entry?.answer === "string" &&
        typeof entry?.tag === "string",
    );

    return valid.length ? valid.slice(0, maxEntries) : seedPersonaEntries;
  } catch {
    return seedPersonaEntries;
  }
}

function writeEntries(entries: PersonaBoardEntry[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(entries.slice(0, maxEntries)));
  window.dispatchEvent(new CustomEvent(syncEventName));
}

export function inferPersonaTag(question: string) {
  if (question.includes("위시켓")) return "위시켓";
  if (question.includes("아웃소싱") || question.includes("외주")) return "아웃소싱";
  if (question.includes("랜딩")) return "랜딩페이지";
  if (question.includes("홈페이지")) return "홈페이지제작";
  if (question.includes("럿지") || question.includes("LUDGI")) return "LUDGI";
  return "페르소나";
}

export function usePersonaBoard(pageSize: number) {
  const [entries, setEntries] = useState<PersonaBoardEntry[]>(seedPersonaEntries);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const sync = () => setEntries(readEntries());
    window.setTimeout(sync, 0);
    window.addEventListener("storage", sync);
    window.addEventListener(syncEventName, sync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(syncEventName, sync);
    };
  }, []);

  const pageCount = Math.max(1, Math.ceil(entries.length / pageSize));
  const currentPage = Math.min(page, Math.max(0, pageCount - 1));
  const visibleEntries = useMemo(
    () => entries.slice(currentPage * pageSize, currentPage * pageSize + pageSize),
    [currentPage, entries, pageSize],
  );

  const registerAnswer = useCallback((question: string, answer: string) => {
    const nextEntry: PersonaBoardEntry = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      question,
      answer,
      tag: inferPersonaTag(question),
      createdAt: Date.now(),
    };

    setEntries((current) => {
      const nextEntries = [nextEntry, ...current].slice(0, maxEntries);
      writeEntries(nextEntries);
      return nextEntries;
    });
    setPage(0);
  }, []);

  return {
    entries,
    page: currentPage,
    pageCount,
    registerAnswer,
    setPage,
    visibleEntries,
  };
}

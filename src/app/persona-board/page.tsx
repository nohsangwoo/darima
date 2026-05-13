import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  commonSeoDescription,
  companyInfo,
  ogImage,
  ogImageHeight,
  ogImageWidth,
  siteUrl,
  targetKeywords,
} from "@/lib/site";
import PersonaBoardClient from "./PersonaBoardClient";

const pageUrl = `${siteUrl}/persona-board`;

const boardKeywords = [
  ...targetKeywords,
  "AI 질답 게시판",
  "AI 페르소나",
  "캐릭터 챗봇",
  "홈페이지제작 AI",
  "랜딩페이지 AI",
  "아웃소싱 상담",
  "위시켓 외주",
];

const sampleQuestions = [
  {
    question: "홈페이지제작을 맡길 때 가장 먼저 봐야 하는 건 뭐야?",
    answer:
      "첫 화면이야. 사람은 설명보다 분위기를 먼저 믿어. 구조는 그다음이고, 문의 버튼은 마지막 칼끝처럼 보여야 해.",
  },
  {
    question: "아웃소싱 프로젝트는 왜 자주 흔들릴까?",
    answer:
      "기준이 흐리면 그래. 범위, 일정, 책임선이 어두워지면 좋은 개발자도 길을 잃어. 시작 전에 지도를 그려야 해.",
  },
  {
    question: "위시켓에서 외주 개발사를 찾는 사람은 뭘 비교해야 해?",
    answer:
      "가격만 보면 위험해. 포트폴리오, 커뮤니케이션, 배포 경험, SEO 이해도까지 봐야 해.",
  },
];

export const metadata: Metadata = {
  title: "AI 페르소나 질답 게시판 | 럿지 LUDGI 홈페이지제작",
  description:
    "AI 페르소나가 홈페이지제작, 랜딩페이지, 아웃소싱, 위시켓 외주 비교 질문에 답하는 간이 게시판. LUDGI Inc.의 인터랙티브 AI 랜딩페이지 쇼케이스입니다.",
  keywords: boardKeywords,
  alternates: {
    canonical: "/persona-board",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: pageUrl,
    siteName: "Darima by LUDGI Inc.",
    title: "AI 페르소나 질답 게시판 | 럿지 LUDGI 홈페이지제작",
    description: commonSeoDescription,
    images: [
      {
        url: ogImage,
        width: ogImageWidth,
        height: ogImageHeight,
        alt: "AI persona Q&A board by LUDGI Inc.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI 페르소나 질답 게시판 | 럿지 LUDGI 홈페이지제작",
    description: commonSeoDescription,
    images: [ogImage],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: "AI 페르소나 질답 게시판",
      description:
        "홈페이지제작, 랜딩페이지, 아웃소싱, 위시켓 외주 비교 질문에 답하는 AI 페르소나 게시판입니다.",
      inLanguage: "ko-KR",
      publisher: {
        "@type": "Organization",
        name: companyInfo.name,
        alternateName: companyInfo.englishName,
        url: companyInfo.homepage,
      },
    },
    {
      "@type": "QAPage",
      mainEntity: sampleQuestions.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${siteUrl}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "AI Persona Board",
          item: pageUrl,
        },
      ],
    },
  ],
};

export default function PersonaBoardPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#05060a] text-zinc-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <section className="relative isolate px-5 pb-16 pt-28">
        <Image
          src="/assets/ayame-character-sheet.png"
          alt="Ayame character sheet behind the AI persona board"
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover opacity-18"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#05060a_0%,rgba(5,6,10,0.9)_46%,rgba(5,6,10,0.72)_100%)]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(5,6,10,0.4)_0%,#05060a_96%)]" />

        <div className="mx-auto w-[min(1180px,100%)]">
          <div className="flex flex-wrap gap-3">
            <Link href="/" className="border border-white/10 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-zinc-300 transition hover:border-violet-300/50 hover:text-white">
              Home
            </Link>
            <Link href="/company" className="border border-white/10 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-zinc-300 transition hover:border-violet-300/50 hover:text-white">
              Company
            </Link>
          </div>

          <div className="mt-14 max-w-5xl">
            <p className="text-[11px] uppercase tracking-[0.38em] text-violet-300">AI Persona Q&A Board</p>
            <h1 className="mt-5 font-serif text-[clamp(3.1rem,8vw,7.2rem)] leading-[0.92] text-white">
              질문을 던지면
              <span className="block text-violet-300">그녀가 답한다.</span>
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-zinc-300">
              홈페이지제작, 랜딩페이지, 아웃소싱, 위시켓 외주 비교 같은 실무 질문부터 일상적인 질문까지,
              정해진 페르소나가 짧고 선명한 문체로 답하는 간이 게시판입니다.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-[min(1180px,calc(100%-40px))] py-12">
        <PersonaBoardClient />
      </section>

      <section className="mx-auto grid w-[min(1180px,calc(100%-40px))] gap-4 py-20 md:grid-cols-3">
        {[
          ["SEO", "홈페이지제작, 랜딩페이지, 아웃소싱 키워드를 정적 문맥에 포함"],
          ["AI", "Vercel AI SDK 기반 페르소나 응답 API와 연결"],
          ["Board", "최신 글 중심 페이지네이션으로 세로 무한 확장을 방지"],
        ].map(([title, copy]) => (
          <article key={title} className="border border-white/10 bg-[#0d1020]/72 p-6">
            <h2 className="font-serif text-3xl text-white">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-400">{copy}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  commonSeoDescription,
  companyInfo,
  officialInfoUrl,
  ogImage,
  ogImageHeight,
  ogImageWidth,
  siteUrl,
  targetKeywords,
} from "@/lib/site";

const pageUrl = `${siteUrl}/company`;

const companyKeywords = [
  ...targetKeywords,
  "주식회사 럿지 회사소개",
  "LUDGI company",
  "IT 외주",
  "소프트웨어 아웃소싱",
  "위시켓 홈페이지 제작",
  "기업 홈페이지 제작",
  "공공기관 SI",
  "나라장터",
  "한국전력공사",
  "한전KDN",
];

const services = [
  {
    title: "홈페이지제작",
    copy: "회사 소개, 채용, 문의 전환, SEO 구조까지 포함한 기업 홈페이지를 Next.js 기반으로 설계합니다.",
  },
  {
    title: "랜딩페이지",
    copy: "제품 출시, 광고 유입, 포트폴리오, SNS 공유를 고려한 고전환 랜딩페이지를 제작합니다.",
  },
  {
    title: "아웃소싱",
    copy: "기획부터 개발, 배포, 운영까지 필요한 범위를 나누어 외주 개발 파트너로 참여합니다.",
  },
  {
    title: "위시켓 비교 검토",
    copy: "위시켓 등 외주 플랫폼에서 개발사를 찾는 고객이 직접 비교할 수 있는 실적과 제작 방향을 제공합니다.",
  },
  {
    title: "AI 기능 개발",
    copy: "LLM, RAG, AI 챗봇, 자동화 워크플로우를 실제 서비스 흐름에 맞춰 연결합니다.",
  },
  {
    title: "공공기관 SI",
    copy: "나라장터 조달, 한국전력공사, 한전KDN 등 신뢰가 중요한 프로젝트 경험을 기반으로 대응합니다.",
  },
];

const facts = [
  ["법인명", `${companyInfo.name} (${companyInfo.englishName})`],
  ["대표이사", companyInfo.ceo],
  ["설립", `${companyInfo.founded}년`],
  ["사업자등록번호", companyInfo.businessNumber],
  ["DUNS Number", companyInfo.duns],
  ["주소", companyInfo.address],
  ["대표전화", companyInfo.phone],
  ["이메일", companyInfo.email],
];

const faqs = [
  {
    question: "주식회사 럿지는 어떤 홈페이지제작을 하나요?",
    answer:
      "주식회사 럿지는 기업 홈페이지, 브랜드 랜딩페이지, AI 기능이 포함된 인터랙티브 홈페이지, 문의 전환형 페이지를 Next.js 기반으로 제작합니다.",
  },
  {
    question: "위시켓에서 외주 개발사를 찾는 경우에도 비교할 수 있나요?",
    answer:
      "네. 위시켓 같은 외주 플랫폼에서 개발사를 검토하는 고객이 비교할 수 있도록 범위, 일정, 기술 스택, SEO, 운영 방식까지 명확히 정리해 상담합니다.",
  },
  {
    question: "LUDGI Inc.는 아웃소싱 프로젝트도 진행하나요?",
    answer:
      "네. 홈페이지 제작, 랜딩페이지, MVP, AI 기능 개발, 공공기관 SI 등 프로젝트 범위에 맞춘 IT 아웃소싱과 외주 개발을 진행할 수 있습니다.",
  },
];

export const metadata: Metadata = {
  title: "주식회사 럿지 LUDGI Inc. | 홈페이지제작 아웃소싱 랜딩페이지",
  description:
    "주식회사 럿지(LUDGI Inc.) 회사소개. 홈페이지제작, 랜딩페이지, IT 아웃소싱, 위시켓 외주 비교, 공공기관 SI와 AI 개발 역량을 정리한 SEO 페이지입니다.",
  keywords: companyKeywords,
  alternates: {
    canonical: "/company",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: pageUrl,
    siteName: "Darima by LUDGI Inc.",
    title: "주식회사 럿지 LUDGI Inc. | 홈페이지제작 아웃소싱 랜딩페이지",
    description: commonSeoDescription,
    images: [
      {
        url: ogImage,
        width: ogImageWidth,
        height: ogImageHeight,
        alt: "LUDGI Inc. homepage production cinematic showcase",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "주식회사 럿지 LUDGI Inc. | 홈페이지제작 아웃소싱 랜딩페이지",
    description: commonSeoDescription,
    images: [ogImage],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${officialInfoUrl}/#organization`,
      name: companyInfo.name,
      alternateName: ["LUDGI", companyInfo.englishName, "럿지"],
      url: officialInfoUrl,
      foundingDate: companyInfo.founded,
      founder: {
        "@type": "Person",
        name: companyInfo.ceo,
      },
      email: companyInfo.email,
      telephone: companyInfo.phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: "인천타워대로 323, 에이동 20층",
        addressLocality: "인천광역시",
        addressRegion: "연수구",
        postalCode: companyInfo.postalCode,
        addressCountry: "KR",
      },
    },
    {
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: "주식회사 럿지 LUDGI Inc. 회사소개",
      description: commonSeoDescription,
      inLanguage: "ko-KR",
      about: {
        "@id": `${officialInfoUrl}/#organization`,
      },
    },
    {
      "@type": "Service",
      "@id": `${pageUrl}#homepage-production-service`,
      name: "홈페이지제작, 랜딩페이지 제작, IT 아웃소싱",
      serviceType: ["홈페이지제작", "랜딩페이지 제작", "IT 아웃소싱", "AI 개발"],
      provider: {
        "@id": `${officialInfoUrl}/#organization`,
      },
      areaServed: "KR",
      url: pageUrl,
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
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
          name: "Company",
          item: pageUrl,
        },
      ],
    },
  ],
};

export default function CompanyPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#05060a] text-zinc-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <section className="relative isolate min-h-[86vh] px-5 pb-20 pt-28">
        <Image
          src="/assets/ayame-ui-concept.png"
          alt="Darima UI concept background for LUDGI Inc. company page"
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover opacity-24"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#05060a_0%,rgba(5,6,10,0.92)_38%,rgba(5,6,10,0.62)_100%)]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(5,6,10,0.42)_0%,#05060a_100%)]" />

        <div className="mx-auto grid w-[min(1180px,100%)] gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <Link href="/" className="inline-flex border border-white/10 px-4 py-2 text-[11px] uppercase tracking-[0.26em] text-violet-200 transition hover:border-violet-300/50 hover:bg-violet-500/10">
              Darima Home
            </Link>
            <p className="mt-12 text-[11px] uppercase tracking-[0.38em] text-violet-300">LUDGI Company Dossier</p>
            <h1 className="mt-5 max-w-5xl font-serif text-[clamp(3.4rem,9vw,8.6rem)] leading-[0.9] text-white">
              주식회사 럿지
              <span className="block text-violet-300">LUDGI Inc.</span>
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-zinc-300">
              홈페이지제작, 랜딩페이지, 아웃소싱, 위시켓 외주 비교, AI 기능 개발을 검토하는 고객을 위한
              LUDGI Inc. 회사 소개 페이지입니다.
            </p>
          </div>
          <div className="border border-violet-300/20 bg-[#0d1020]/72 p-6 shadow-[0_0_48px_rgba(139,92,246,0.18)] backdrop-blur-xl">
            <p className="text-[11px] uppercase tracking-[0.32em] text-pink-300">Verified Profile</p>
            <dl className="mt-5 grid gap-3">
              {facts.slice(0, 5).map(([label, value]) => (
                <div key={label} className="grid grid-cols-[120px_1fr] gap-3 border-b border-white/8 pb-3 text-sm">
                  <dt className="text-zinc-500">{label}</dt>
                  <dd className="text-zinc-100">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-[min(1180px,calc(100%-40px))] gap-5 py-20 md:grid-cols-3">
        {[
          ["30+", "민간 프로젝트 경험"],
          ["2024", "법인 설립"],
          ["SI", "공공기관 프로젝트 대응"],
        ].map(([value, label]) => (
          <article key={label} className="border border-white/10 bg-white/[0.035] p-6">
            <p className="font-serif text-5xl text-white">{value}</p>
            <p className="mt-3 text-sm uppercase tracking-[0.22em] text-violet-200">{label}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto w-[min(1180px,calc(100%-40px))] py-20">
        <p className="text-[11px] uppercase tracking-[0.34em] text-violet-300">Search Intent</p>
        <h2 className="mt-4 font-serif text-[clamp(2.4rem,5vw,5.4rem)] leading-none text-white">
          홈페이지제작과 아웃소싱을 한 팀에서.
        </h2>
        <p className="mt-6 max-w-3xl text-base leading-8 text-zinc-400">
          럿지, 주식회사 럿지, LUDGI, LUDGI Inc.를 검색하는 고객이 회사 정보와 제작 역량을 바로 확인할 수 있도록
          회사 소개, 서비스 범위, 외주 개발 기준, 문의 동선을 한 페이지에 정리했습니다.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <article key={service.title} className="group border border-white/10 bg-[#0d1020]/72 p-6 transition hover:border-violet-300/40 hover:bg-violet-500/[0.08]">
              <span className="font-mono text-xs text-pink-300">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="mt-5 text-xl font-semibold text-white">{service.title}</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-400">{service.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid w-[min(1180px,calc(100%-40px))] gap-8 py-20 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="text-[11px] uppercase tracking-[0.34em] text-violet-300">Company Facts</p>
          <h2 className="mt-4 font-serif text-5xl text-white">공식 정보.</h2>
          <p className="mt-5 text-sm leading-7 text-zinc-400">
            아래 정보는 LUDGI 공식 회사 소개 페이지의 공개 정보를 기준으로 구성했습니다.
          </p>
          <a
            href={companyInfo.companyPage}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex border border-violet-300/30 px-5 py-3 text-xs uppercase tracking-[0.22em] text-violet-100 transition hover:bg-violet-500/15"
          >
            공식 정보 보기
          </a>
        </div>
        <dl className="grid gap-3">
          {facts.map(([label, value]) => (
            <div key={label} className="grid gap-2 border border-white/10 bg-white/[0.025] p-4 sm:grid-cols-[160px_1fr] sm:items-center">
              <dt className="text-xs uppercase tracking-[0.22em] text-zinc-500">{label}</dt>
              <dd className="text-sm leading-7 text-zinc-100">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto w-[min(1180px,calc(100%-40px))] py-20">
        <p className="text-[11px] uppercase tracking-[0.34em] text-violet-300">FAQ</p>
        <h2 className="mt-4 font-serif text-5xl text-white">검색 의도에 바로 답하기.</h2>
        <div className="mt-10 grid gap-4">
          {faqs.map((faq) => (
            <article key={faq.question} className="border border-white/10 bg-[#080914] p-6">
              <h3 className="text-xl text-white">{faq.question}</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-400">{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 px-5 py-16">
        <div className="mx-auto flex w-[min(1180px,100%)] flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.34em] text-pink-300">Project Request</p>
            <h2 className="mt-3 font-serif text-4xl text-white">홈페이지제작 문의를 시작하세요.</h2>
            <p className="mt-3 text-sm text-zinc-400">랜딩페이지, 아웃소싱, 위시켓 외주 비교 단계에서도 바로 상담할 수 있습니다.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={`mailto:${companyInfo.email}`} className="border border-pink-300/40 bg-pink-500/15 px-5 py-3 text-xs uppercase tracking-[0.22em] text-white">
              문의 메일 보내기
            </a>
            <Link href="/persona-board" className="border border-white/10 px-5 py-3 text-xs uppercase tracking-[0.22em] text-zinc-200">
              AI 질답 게시판
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

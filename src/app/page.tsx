"use client";

import { AnimatePresence, motion } from "framer-motion";
import Lenis from "lenis";
import {
  Activity,
  AlertTriangle,
  Building2,
  ChevronDown,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Crosshair,
  Database,
  Eye,
  ExternalLink,
  Flame,
  Hexagon,
  Camera,
  Leaf,
  LockKeyhole,
  LoaderCircle,
  Mail,
  MapPin,
  Menu,
  Music2,
  Orbit,
  Phone,
  Play,
  Radio,
  RefreshCw,
  ScrollText,
  Send,
  Shield,
  Sparkles,
  Swords,
  Volume2,
  VolumeX,
  WandSparkles,
  X,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import Script from "next/script";
import { type ChangeEvent, type FormEvent, useEffect, useMemo, useRef, useState } from "react";

type TurnstileRenderOptions = {
  sitekey: string;
  theme?: "light" | "dark" | "auto";
  size?: "normal" | "compact" | "flexible";
  callback?: (token: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: () => void;
};

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement | string, options: TurnstileRenderOptions) => string;
      reset: (widgetId?: string) => void;
      remove?: (widgetId: string) => void;
    };
  }
}

const navItems = [
  ["Home", "hero"],
  ["About", "overview"],
  ["Bot", "persona-bot"],
  ["Skills", "skills"],
  ["Gallery", "gallery"],
  ["Contacts", "contact"],
] as const;

const socialLinks: Array<{ icon: LucideIcon; label: string }> = [
  { icon: Send, label: "Discord" },
  { icon: Camera, label: "Instagram" },
  { icon: Music2, label: "TikTok" },
];

const siteUrl = "https://www.darima.xyz";

const companyInfo = {
  name: "주식회사 럿지",
  englishName: "LUDGI Inc.",
  ceo: "노상우",
  founded: "2024",
  businessNumber: "307-88-03283",
  duns: "963415644",
  address: "인천광역시 연수구 인천타워대로 323, 에이동 20층",
  phone: "010-3006-9310",
  email: "milli@molluhub.com",
  homepage: "https://info.ludgi.ai/",
  summary:
    "공공기관 SI 수주와 30여 개 이상의 민간 프로젝트를 수행한 소프트웨어 개발 전문 기업입니다.",
};

const inquiryInitialState = {
  name: "",
  company: "",
  email: "",
  phone: "",
  message: "",
  website: "",
};

type InquiryForm = typeof inquiryInitialState;
type InquiryStatus = "idle" | "sending" | "success" | "error";
type PersonaBotStatus = "idle" | "question" | "answer";

type PersonaBoardEntry = {
  id: string;
  question: string;
  answer: string;
  model: string;
};

const personaModelName = "gpt-5.4-mini-2026-03-17";
const personaPageSize = 3;

const initialPersonaBoard: PersonaBoardEntry[] = [
  {
    id: "seed-rain",
    question: "비 오는 밤에는 무슨 생각을 해?",
    answer: "소리가 줄어들어.\n도시는 젖고, 사람들은 서두르지.\n그때가 제일 보기 좋아.",
    model: personaModelName,
  },
  {
    id: "seed-kind",
    question: "너는 다정한 편이야?",
    answer: "다정함은 시끄러워.\n나는 필요한 만큼만 움직여.\n그게 더 오래 남아.",
    model: personaModelName,
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://info.ludgi.ai/#organization",
      name: companyInfo.name,
      alternateName: companyInfo.englishName,
      url: companyInfo.homepage,
      foundingDate: companyInfo.founded,
      founder: {
        "@type": "Person",
        name: companyInfo.ceo,
      },
      email: companyInfo.email,
      telephone: companyInfo.phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: companyInfo.address,
        postalCode: "21998",
        addressCountry: "KR",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: `${siteUrl}/`,
      name: "Darima",
      alternateName: ["럿지 랜딩페이지", "LUDGI Inc. homepage"],
      inLanguage: "ko-KR",
      publisher: {
        "@id": "https://info.ludgi.ai/#organization",
      },
    },
    {
      "@type": "Service",
      "@id": `${siteUrl}/#homepage-production`,
      name: "홈페이지 및 랜딩페이지 제작문의",
      serviceType: "Homepage and landing page production",
      provider: {
        "@id": "https://info.ludgi.ai/#organization",
      },
      areaServed: "KR",
      url: `${siteUrl}/`,
      description:
        "Next.js 기반 인터랙티브 랜딩페이지, 홈페이지, 시네마틱 UX/UI 제작문의.",
    },
  ],
};

const heroVideoSources = [
  {
    desktop: "/assets/ayame-hero.mp4",
    mobile: "/assets/ayame-hero-mobile.mp4",
  },
  {
    desktop: "/assets/ayame-hero-reverse.mp4",
    mobile: "/assets/ayame-hero-mobile-reverse.mp4",
  },
] as const;

const profile = [
  ["Age", "21"],
  ["Rank", "Jounin / ANBU"],
  ["Clan", "Uchiha"],
  ["Chakra Type", "Fire / Wind"],
  ["Specialty", "Genjutsu"],
  ["Affiliation", "Hidden Leaf"],
];

const skills = [
  {
    icon: Eye,
    name: "Tsukuyomi",
    danger: "S",
    copy: "A moonlit illusion field that compresses perception and dismantles enemy intent before the blade is drawn.",
  },
  {
    icon: Flame,
    name: "Amaterasu",
    danger: "S+",
    copy: "Black fire signature tuned for silent pursuit, leaving only purple heat bloom across the target profile.",
  },
  {
    icon: Orbit,
    name: "Spatial Genjutsu",
    danger: "A+",
    copy: "Distorts distance, sound, and timing until the battlefield feels a step out of phase.",
  },
  {
    icon: Sparkles,
    name: "Shadow Clone",
    danger: "A",
    copy: "Low-noise clones designed for misdirection, reconnaissance, and multi-angle seal deployment.",
  },
  {
    icon: Shield,
    name: "Chakra Suppression",
    danger: "S",
    copy: "Reduces her chakra signature to background fog, ideal for ANBU infiltration and close-range ambush.",
  },
];

const equipment = [
  { icon: Shield, name: "ANBU Mask", type: "Identity Veil" },
  { icon: Swords, name: "Kunai", type: "Close-Quarters" },
  { icon: ScrollText, name: "Scroll", type: "Seal Archive" },
  { icon: Radio, name: "Smoke Bomb", type: "Exit Bloom" },
  { icon: Hexagon, name: "Chakra Seal", type: "Limiter Key" },
];

const stats = [
  ["Speed", 88],
  ["Strategy", 94],
  ["Genjutsu", 99],
  ["Taijutsu", 78],
  ["Chakra", 91],
  ["Intelligence", 96],
] as const;

const relationships = [
  {
    role: "Mentor",
    name: "Kage Observer",
    copy: "Trained her to read silence as terrain.",
    tone: "moon",
  },
  {
    role: "Rival",
    name: "Iron Lotus",
    copy: "A taijutsu specialist who can break illusions by pain response.",
    tone: "ember",
  },
  {
    role: "Clan",
    name: "Uchiha Archive",
    copy: "Bloodline records remain sealed under violet clearance.",
    tone: "seal",
  },
  {
    role: "Allies",
    name: "ANBU Cell 09",
    copy: "A covert squad that exists only as erased mission timestamps.",
    tone: "fog",
  },
];

const timeline = [
  ["00. First Mission", "Recovered a stolen sealing scroll without triggering a single perimeter alarm."],
  ["07. ANBU Recruitment", "Selected after defeating a three-person tracker squad through sensory misdirection."],
  ["13. Clan Incident", "Archived eyewitness accounts contradict each other by exactly nine seconds."],
  ["21. Forbidden Technique", "Sharingan threshold crossed during a moon-eclipse simulation in the old forest."],
];

const gallery = [
  {
    title: "Character Sheet",
    src: "/assets/ayame-character-sheet.png",
    width: 1536,
    height: 1024,
    className: "md:col-span-2 md:row-span-2",
    position: "center",
  },
  {
    title: "UI Concept",
    src: "/assets/ayame-ui-concept.png",
    width: 1199,
    height: 1312,
    className: "md:col-span-2",
    position: "center",
  },
  {
    title: "Portrait Close-Up",
    src: "/assets/ayame-character-sheet.png",
    width: 1536,
    height: 1024,
    className: "",
    position: "left top",
  },
  {
    title: "Equipment Archive",
    src: "/assets/ayame-ui-concept.png",
    width: 1199,
    height: 1312,
    className: "",
    position: "left bottom",
  },
] as const;

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    let width = 0;
    let height = 0;
    let frame = 0;
    let raf = 0;
    let particles: Array<{ x: number; y: number; vx: number; vy: number; r: number; a: number }> = [];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = width < 700 ? 46 : 92;
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.8 + 0.4,
        a: Math.random() * 0.45 + 0.12,
      }));
    };

    const draw = () => {
      frame += 0.01;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(176,38,255,0.18)";
      ctx.strokeStyle = "rgba(255,79,216,0.12)";
      particles.forEach((particle, index) => {
        particle.x += particle.vx + Math.sin(frame + index) * 0.018;
        particle.y += particle.vy + Math.cos(frame + index * 0.7) * 0.018;

        if (particle.x < -10) particle.x = width + 10;
        if (particle.x > width + 10) particle.x = -10;
        if (particle.y < -10) particle.y = height + 10;
        if (particle.y > height + 10) particle.y = -10;

        ctx.globalAlpha = particle.a;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        ctx.fill();

        if (index % 5 === 0) {
          ctx.globalAlpha = 0.08;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(particle.x + Math.sin(frame + index) * 48, particle.y + Math.cos(frame) * 34);
          ctx.stroke();
        }
      });
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0 opacity-70 mix-blend-screen" />;
}

function IntroLoader({ loading }: { loading: boolean }) {
  return (
    <AnimatePresence>
      {loading ? (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-[#05060a]"
          exit={{ opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.18),transparent_42%)]" />
          <div className="loader-ring" />
          <motion.div
            className="relative z-10 flex flex-col items-center gap-4 text-center"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="glitch text-xs font-semibold uppercase tracking-[0.48em] text-violet-200" data-text="ACCESSING SHINOBI DATABASE...">
              ACCESSING SHINOBI DATABASE...
            </p>
            <div className="flex items-center gap-4 text-[11px] uppercase tracking-[0.36em] text-violet-400/70">
              <span>暗部認証</span>
              <span className="h-px w-10 bg-violet-500/40" />
              <span>секретный архив</span>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function MagneticCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let targetCursorX = window.innerWidth / 2;
    let targetCursorY = window.innerHeight / 2;
    let cursorX = targetCursorX;
    let cursorY = targetCursorY;
    let raf = 0;

    const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

    const animate = () => {
      currentX += (targetX - currentX) * 0.075;
      currentY += (targetY - currentY) * 0.075;
      cursorX += (targetCursorX - cursorX) * 0.22;
      cursorY += (targetCursorY - cursorY) * 0.22;

      document.documentElement.style.setProperty("--magnet-x", currentX.toFixed(4));
      document.documentElement.style.setProperty("--magnet-y", currentY.toFixed(4));

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cursorX - 18}px, ${cursorY - 18}px, 0)`;
      }

      raf = requestAnimationFrame(animate);
    };

    const move = (event: PointerEvent) => {
      const x = event.clientX;
      const y = event.clientY;
      targetX = clamp((x / window.innerWidth - 0.5) * 2, -1, 1);
      targetY = clamp((y / window.innerHeight - 0.5) * 2, -1, 1);
      targetCursorX = x;
      targetCursorY = y;

      if (cursorRef.current) {
        cursorRef.current.style.opacity = "1";
      }
    };

    const reset = () => {
      targetX = 0;
      targetY = 0;
      if (cursorRef.current) {
        cursorRef.current.style.opacity = "0";
      }
    };

    raf = requestAnimationFrame(animate);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerleave", reset);
    window.addEventListener("blur", reset);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerleave", reset);
      window.removeEventListener("blur", reset);
    };
  }, []);

  return <div ref={cursorRef} className="magnetic-cursor hidden md:block" />;
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${scrolled ? "nav-lit py-3" : "py-5"}`}>
      <nav className="mx-auto flex w-[min(1180px,calc(100%-32px))] items-center justify-between">
        <button
          aria-label="Go to home"
          onClick={() => scrollToId("hero")}
          className="group flex items-center gap-3 text-left"
        >
          <span className="grid h-10 w-10 place-items-center border border-white/10 bg-white/[0.03] text-violet-300 shadow-[0_0_24px_rgba(139,92,246,0.22)]">
            <Leaf size={18} />
          </span>
          <span>
            <span className="block font-serif text-lg leading-none tracking-[0.16em] text-white">AYAME</span>
            <span className="block text-[10px] uppercase tracking-[0.36em] text-violet-300/70">UCHIHA CLAN</span>
          </span>
        </button>

        <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-black/20 p-1 backdrop-blur-xl md:flex">
          {navItems.map(([label, id]) => (
            <button
              key={id}
              onClick={() => scrollToId(id)}
              className="rounded-full px-4 py-2 text-xs uppercase tracking-[0.22em] text-zinc-300 transition hover:bg-violet-500/15 hover:text-white"
            >
              {label}
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {socialLinks.map(({ icon: Icon, label }) => (
            <a
              key={label}
              aria-label={label}
              href="#contact"
              className="grid h-10 w-10 place-items-center border border-white/10 bg-white/[0.03] text-zinc-300 transition hover:border-violet-400/50 hover:bg-violet-500/10 hover:text-white"
            >
              <Icon size={17} />
            </a>
          ))}
        </div>

        <button
          className="grid h-10 w-10 place-items-center border border-white/10 bg-white/[0.04] text-white md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="mx-auto mt-4 flex w-[min(1180px,calc(100%-32px))] flex-col gap-2 border border-white/10 bg-[#080914]/95 p-3 backdrop-blur-xl md:hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {navItems.map(([label, id]) => (
              <button
                key={id}
                onClick={() => {
                  scrollToId(id);
                  setOpen(false);
                }}
                className="px-3 py-3 text-left text-xs uppercase tracking-[0.26em] text-zinc-200"
              >
                {label}
              </button>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

function SectionHeader({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) {
  return (
    <motion.div
      className="section-header"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
    >
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {copy ? <p className="section-copy">{copy}</p> : null}
    </motion.div>
  );
}

function RadarChart() {
  const points = useMemo(() => {
    const center = 50;
    const radius = 38;
    return stats
      .map(([, value], index) => {
        const angle = (Math.PI * 2 * index) / stats.length - Math.PI / 2;
        const distance = (value / 100) * radius;
        return `${center + Math.cos(angle) * distance},${center + Math.sin(angle) * distance}`;
      })
      .join(" ");
  }, []);

  return (
    <div className="radar-wrap">
      <svg viewBox="0 0 100 100" className="radar-svg" aria-label="Ayame combat statistics radar chart">
        {[14, 24, 34, 44].map((radius) => (
          <polygon
            key={radius}
            points={stats
              .map((_, index) => {
                const angle = (Math.PI * 2 * index) / stats.length - Math.PI / 2;
                return `${50 + Math.cos(angle) * radius},${50 + Math.sin(angle) * radius}`;
              })
              .join(" ")}
            fill="none"
            stroke="rgba(176,38,255,0.18)"
            strokeWidth="0.45"
          />
        ))}
        {stats.map(([label], index) => {
          const angle = (Math.PI * 2 * index) / stats.length - Math.PI / 2;
          return (
            <g key={label}>
              <line x1="50" y1="50" x2={50 + Math.cos(angle) * 44} y2={50 + Math.sin(angle) * 44} stroke="rgba(255,255,255,0.10)" strokeWidth="0.4" />
              <text x={50 + Math.cos(angle) * 48} y={50 + Math.sin(angle) * 48} textAnchor="middle" dominantBaseline="middle" className="radar-label">
                {label}
              </text>
            </g>
          );
        })}
        <motion.polygon
          points={points}
          fill="rgba(176,38,255,0.24)"
          stroke="#ff4fd8"
          strokeWidth="1.1"
          initial={{ opacity: 0, scale: 0.68, transformOrigin: "50px 50px" }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="grid gap-3 sm:grid-cols-2">
        {stats.map(([label, value]) => (
          <div key={label} className="stat-line">
            <span>{label}</span>
            <strong>{value}</strong>
            <i style={{ width: `${value}%` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function PersonaQASection() {
  const [question, setQuestion] = useState("");
  const [entries, setEntries] = useState<PersonaBoardEntry[]>(initialPersonaBoard);
  const [status, setStatus] = useState<PersonaBotStatus>("idle");
  const [notice, setNotice] = useState("");
  const [page, setPage] = useState(0);
  const pageCount = Math.max(1, Math.ceil(entries.length / personaPageSize));
  const visibleEntries = entries.slice(page * personaPageSize, page * personaPageSize + personaPageSize);

  const registerAnswer = (nextQuestion: string, answer: string, model: string) => {
    setEntries((current) => [
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        question: nextQuestion,
        answer,
        model,
      },
      ...current,
    ]);
    setPage(0);
  };

  const requestAnswer = async (nextQuestion: string) => {
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
      }),
    });
    const result = (await response.json().catch(() => null)) as {
      answer?: string;
      message?: string;
      model?: string;
      question?: string;
    } | null;

    if (!response.ok || !result?.answer) {
      throw new Error(result?.message || "페르소나 응답 생성에 실패했습니다.");
    }

    registerAnswer(result.question || nextQuestion, result.answer, result.model || personaModelName);
    setQuestion("");
  };

  const askQuestion = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    const nextQuestion = question.trim();

    if (!nextQuestion) {
      setNotice("질문을 입력하거나 랜덤 주제를 던져주세요.");
      return;
    }

    try {
      await requestAnswer(nextQuestion);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "응답 생성에 실패했습니다.");
    } finally {
      setStatus("idle");
    }
  };

  const askRandomQuestion = async () => {
    try {
      setStatus("question");
      setNotice("");

      const response = await fetch("/api/persona-bot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: "question",
        }),
      });
      const result = (await response.json().catch(() => null)) as {
        message?: string;
        question?: string;
      } | null;

      if (!response.ok || !result?.question) {
        throw new Error(result?.message || "랜덤 질문 생성에 실패했습니다.");
      }

      setQuestion(result.question);
      await requestAnswer(result.question);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "랜덤 질답 생성에 실패했습니다.");
    } finally {
      setStatus("idle");
    }
  };

  const busy = status !== "idle";

  return (
    <section id="persona-bot" className="persona-board-section section-wrap">
      <SectionHeader
        eyebrow="Midnight Q&A Archive"
        title="Ask the quiet one. She may answer."
        copy="Throw a small question into the archive. Iris answers in her own silence."
      />
      <div className="persona-board-grid">
        <motion.div
          className="persona-console"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="persona-console-head">
            <div>
              <span>ACTIVE DOSSIER</span>
              <strong>IRIS VALE</strong>
            </div>
            <Eye size={28} />
          </div>
          <form className="persona-question-form" onSubmit={askQuestion}>
            <label>
              <span>QUESTION INPUT</span>
              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="오늘 기분은 어때? / 싸우는 게 무섭지 않아? / 좋아하는 음악 있어?"
                rows={5}
                disabled={busy}
              />
            </label>
            <div className="persona-actions">
              <button type="button" onClick={askRandomQuestion} disabled={busy}>
                {status === "question" ? <RefreshCw className="animate-spin" size={17} /> : <WandSparkles size={17} />}
                <span>{status === "question" ? "주제 선택 중" : "랜덤 주제 던지기"}</span>
              </button>
              <button type="submit" disabled={busy}>
                {status === "answer" ? <RefreshCw className="animate-spin" size={17} /> : <Send size={17} />}
                <span>{status === "answer" ? "응답 생성 중" : "질문 등록"}</span>
              </button>
            </div>
            {notice ? <p className="persona-notice">{notice}</p> : null}
          </form>
        </motion.div>

        <div className="persona-answer-feed">
          {visibleEntries.map((entry, index) => (
            <motion.article
              key={entry.id}
              className="persona-answer-card"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: Math.min(index * 0.05, 0.2) }}
            >
              <div className="persona-answer-meta">
                <span>IRIS VALE</span>
                <em>{String(entries.length - (page * personaPageSize + index)).padStart(2, "0")}</em>
              </div>
              <h3>{entry.question}</h3>
              <p>{entry.answer}</p>
            </motion.article>
          ))}
          <div className="persona-pagination" aria-label="Q&A archive pagination">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(current - 1, 0))}
              disabled={page === 0}
              aria-label="Previous Q&A page"
            >
              <ChevronLeft size={16} />
            </button>
            <span>
              {page + 1} / {pageCount}
            </span>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(current + 1, pageCount - 1))}
              disabled={page >= pageCount - 1}
              aria-label="Next Q&A page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<(typeof gallery)[number] | null>(null);
  const [heroProgress, setHeroProgress] = useState(0);
  const [heroVideoIndex, setHeroVideoIndex] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [skillActionActive, setSkillActionActive] = useState(false);
  const [skillActionSoundEnabled, setSkillActionSoundEnabled] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquiryForm, setInquiryForm] = useState<InquiryForm>(inquiryInitialState);
  const [inquiryStatus, setInquiryStatus] = useState<InquiryStatus>("idle");
  const [inquiryNotice, setInquiryNotice] = useState("");
  const [turnstileConfigLoaded, setTurnstileConfigLoaded] = useState(false);
  const [turnstileReady, setTurnstileReady] = useState(false);
  const [turnstileSiteKey, setTurnstileSiteKey] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const heroRef = useRef<HTMLDivElement>(null);
  const heroAudioRef = useRef<HTMLAudioElement>(null);
  const heroVideoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const skillActionVideoRef = useRef<HTMLVideoElement>(null);
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, wheelMultiplier: 0.9 });
    let raf = 0;
    const animate = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    const updateHeroProgress = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const hero = heroRef.current;
        if (!hero) {
          return;
        }
        const rect = hero.getBoundingClientRect();
        const progress = Math.min(Math.max(-rect.top / Math.max(rect.height, 1), 0), 1);
        setHeroProgress(progress);
      });
    };

    updateHeroProgress();
    window.addEventListener("scroll", updateHeroProgress, { passive: true });
    window.addEventListener("resize", updateHeroProgress);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", updateHeroProgress);
      window.removeEventListener("resize", updateHeroProgress);
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 1850);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/turnstile/site-key", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((config: { siteKey?: string; enabled?: boolean } | null) => {
        if (cancelled) {
          return;
        }

        setTurnstileSiteKey(config?.siteKey || "");
      })
      .catch(() => {
        if (!cancelled) {
          setTurnstileSiteKey("");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setTurnstileConfigLoaded(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!inquiryOpen) {
      if (turnstileWidgetIdRef.current && window.turnstile?.remove) {
        window.turnstile.remove(turnstileWidgetIdRef.current);
      }

      turnstileWidgetIdRef.current = null;
      return;
    }

    if (
      !turnstileSiteKey ||
      !turnstileReady ||
      !turnstileContainerRef.current ||
      !window.turnstile ||
      turnstileWidgetIdRef.current
    ) {
      return;
    }

    turnstileWidgetIdRef.current = window.turnstile.render(turnstileContainerRef.current, {
      sitekey: turnstileSiteKey,
      theme: "dark",
      size: "flexible",
      callback: (token) => {
        setTurnstileToken(token);
        if (inquiryStatus === "error") {
          setInquiryStatus("idle");
          setInquiryNotice("");
        }
      },
      "expired-callback": () => {
        setTurnstileToken("");
      },
      "error-callback": () => {
        setTurnstileToken("");
        setInquiryStatus("error");
        setInquiryNotice("보안 인증을 다시 완료해주세요.");
      },
    });
  }, [inquiryOpen, inquiryStatus, turnstileReady, turnstileSiteKey]);

  useEffect(() => {
    heroVideoRefs.current.forEach((video, index) => {
      if (!video) {
        return;
      }

      video.muted = true;
      video.loop = false;

      if (index === heroVideoIndex) {
        video.currentTime = 0;
        const playPromise = video.play();
        if (playPromise) {
          playPromise.catch(() => {
            // Muted autoplay normally succeeds; user gesture will recover unusual browser states.
          });
        }
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [heroVideoIndex]);

  const stopHeroSound = () => {
    const audio = heroAudioRef.current;
    if (!audio) {
      return;
    }

    audio.pause();
    setSoundEnabled(false);
  };

  const toggleHeroSound = () => {
    const audio = heroAudioRef.current;
    if (!audio) {
      return;
    }

    if (soundEnabled) {
      stopHeroSound();
      return;
    }

    audio.volume = 0.42;
    audio.muted = false;
    const playPromise = audio.play();
    if (playPromise) {
      playPromise
        .then(() => setSoundEnabled(true))
        .catch(() => setSoundEnabled(false));
    } else {
      setSoundEnabled(true);
    }
  };

  const endSkillAction = () => {
    const video = skillActionVideoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
      video.muted = true;
    }
    setSkillActionActive(false);
    setSkillActionSoundEnabled(false);
  };

  const startSkillAction = () => {
    stopHeroSound();
    setSkillActionActive(true);
    setSkillActionSoundEnabled(true);

    const video = skillActionVideoRef.current;
    if (!video) {
      return;
    }

    video.currentTime = 0;
    video.volume = 0.65;
    video.muted = false;
    const playPromise = video.play();
    if (playPromise) {
      playPromise.catch(() => {
        video.muted = true;
        setSkillActionSoundEnabled(false);
        video.play().catch(() => endSkillAction());
      });
    }
  };

  const toggleSkillActionSound = () => {
    const video = skillActionVideoRef.current;
    if (!video) {
      return;
    }

    if (skillActionSoundEnabled) {
      video.muted = true;
      setSkillActionSoundEnabled(false);
      return;
    }

    video.volume = 0.65;
    video.muted = false;
    setSkillActionSoundEnabled(true);
  };

  const resetTurnstile = () => {
    setTurnstileToken("");

    if (turnstileWidgetIdRef.current && window.turnstile) {
      window.turnstile.reset(turnstileWidgetIdRef.current);
    }
  };

  const openInquiry = () => {
    setInquiryOpen(true);
    setInquiryStatus("idle");
    setInquiryNotice("");
  };

  const closeInquiry = () => {
    if (inquiryStatus !== "sending") {
      setTurnstileToken("");
      setInquiryOpen(false);
    }
  };

  const updateInquiry = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setInquiryForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const submitInquiry = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (turnstileSiteKey && !turnstileToken) {
      setInquiryStatus("error");
      setInquiryNotice("문의 발송 전에 보안 인증을 완료해주세요.");
      return;
    }

    setInquiryStatus("sending");
    setInquiryNotice("");

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...inquiryForm,
          turnstileToken,
        }),
      });
      const result = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        throw new Error(result?.message || "문의 발송에 실패했습니다.");
      }

      setInquiryStatus("success");
      setInquiryNotice("문의가 전송되었습니다. LUDGI 팀이 확인 후 연락드릴게요.");
      setInquiryForm(inquiryInitialState);
    } catch (error) {
      setInquiryStatus("error");
      setInquiryNotice(error instanceof Error ? error.message : "문의 발송에 실패했습니다.");
    } finally {
      if (turnstileSiteKey) {
        resetTurnstile();
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {turnstileSiteKey ? (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onLoad={() => setTurnstileReady(true)}
        />
      ) : null}
      <IntroLoader loading={loading} />
      <ParticleField />
      <MagneticCursor />
      <Navbar />

      <main className="relative z-10 overflow-hidden bg-[#05060a] text-zinc-100">
        <section id="hero" ref={heroRef} className="relative min-h-screen overflow-hidden pt-28">
          <audio ref={heroAudioRef} src="/assets/ayame-hero.mp4" preload="auto" loop />
          {heroVideoSources.map((source, index) => (
            <video
              key={source.desktop}
              ref={(element) => {
                heroVideoRefs.current[index] = element;
              }}
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
              autoPlay={index === 0}
              muted
              preload="auto"
              playsInline
              onEnded={() => setHeroVideoIndex((current) => (current + 1) % heroVideoSources.length)}
              style={{
                transform: `scale(${1 + heroProgress * 0.16})`,
                opacity: heroVideoIndex === index ? 1 - heroProgress * 0.74 : 0,
              }}
            >
              <source src={source.mobile} type="video/mp4" media="(max-width: 767px)" />
              <source src={source.desktop} type="video/mp4" />
            </video>
          ))}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_28%,rgba(176,38,255,0.24),transparent_31%),linear-gradient(90deg,#05060a_0%,rgba(5,6,10,0.86)_38%,rgba(5,6,10,0.42)_68%,#05060a_100%)]" />
          <div className="absolute left-[12%] top-[16%] h-60 w-60 rounded-full border border-violet-300/10 bg-violet-400/10 blur-3xl moon-pulse" />
          <div className="scan-lines" />
          <button
            type="button"
            className="sound-toggle"
            aria-label={soundEnabled ? "Turn hero background sound off" : "Turn hero background sound on"}
            aria-pressed={soundEnabled}
            onClick={toggleHeroSound}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            <span>{soundEnabled ? "Sound On" : "Sound Off"}</span>
          </button>

          <div className="relative mx-auto grid min-h-[calc(100vh-112px)] w-[min(1180px,calc(100%-32px))] items-center gap-12 pb-20 lg:grid-cols-[0.92fr_1.08fr]">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: loading ? 0 : 1, y: loading ? 40 : 0 }}
              transition={{ delay: 0.25, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl"
            >
              <div className="mb-7 inline-flex items-center gap-3 border border-violet-300/20 bg-violet-300/[0.06] px-4 py-2 text-[11px] uppercase tracking-[0.36em] text-violet-200">
                <Database size={15} />
                ANBU clearance S-09
              </div>
              <h1 className="font-serif text-[clamp(3.15rem,12vw,10.8rem)] leading-[0.82] tracking-normal text-white">
                AYAME
                <span className="block text-violet-300 drop-shadow-[0_0_30px_rgba(176,38,255,0.54)]">UCHIHA</span>
              </h1>
              <p className="mt-7 max-w-xl font-serif text-2xl text-violet-100 md:text-3xl">
                “私は夢にも、悪夢にもなれる。”
              </p>
              <p className="mt-3 max-w-xl text-sm uppercase tracking-[0.24em] text-violet-300/80">
                I can be your dream... or your nightmare.
              </p>
              <div className="mt-8 grid max-w-xl gap-3 border-l border-violet-400/30 pl-5 text-sm leading-7 text-zinc-300">
                <span>White-haired genjutsu specialist operating under erased ANBU mission records.</span>
                <span>Clan: Uchiha / Rank: Jounin / Threat Classification: Moon Violet.</span>
              </div>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <button onClick={() => scrollToId("overview")} className="btn-primary">
                  <span>Enter Database</span>
                  <ChevronDown size={17} />
                </button>
                <button onClick={() => scrollToId("skills")} className="btn-secondary">
                  <Crosshair size={17} />
                  <span>View Techniques</span>
                </button>
              </div>
            </motion.div>

            <motion.div
              className="hero-panel"
              initial={{ opacity: 0, x: 46, rotateY: -10 }}
              animate={{ opacity: loading ? 0 : 1, x: loading ? 46 : 0, rotateY: 0 }}
              transition={{ delay: 0.42, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="hero-image-frame">
                <Image
                  src="/assets/ayame-character-sheet.png"
                  alt="Ayame Uchiha character concept sheet"
                  fill
                  priority
                  loading="eager"
                  sizes="(min-width: 1024px) 48vw, 90vw"
                  className="object-cover"
                  style={{ objectPosition: "74% 18%" }}
                />
              </div>
              <div className="absolute -bottom-6 left-6 right-6 grid grid-cols-3 gap-3">
                {["Genjutsu", "ANBU", "Sharingan"].map((label) => (
                  <div key={label} className="border border-white/10 bg-black/50 px-4 py-3 text-center text-[10px] uppercase tracking-[0.26em] text-violet-200 backdrop-blur-xl">
                    {label}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section id="overview" className="section-wrap">
          <SectionHeader
            eyebrow="Character Overview"
            title="A classified shinobi profile with no public mission trail."
            copy="The database unlocks in fragments: identity first, threat model second, emotional damage last."
          />
          <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
            <motion.div
              className="glass-panel p-6 md:p-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-lg leading-8 text-zinc-200">
                Ayame Uchiha is a tactical illusionist raised between clan ritual and ANBU silence. Her presence reads
                elegant at a distance, but every movement is calibrated: hair like moonlight, uniform like a sealed
                warrant, eyes tuned to turn hesitation into terrain.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  ["Threat", "S-Class"],
                  ["Clearance", "Violet"],
                  ["Signal", "Suppressed"],
                ].map(([label, value]) => (
                  <div key={label} className="mini-terminal">
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-2">
              {profile.map(([label, value], index) => (
                <motion.div
                  key={label}
                  className="profile-card"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.04 }}
                >
                  <span>{label}</span>
                  <strong>{value}</strong>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="skills" className="skill-stage">
          <video className="skill-bg-video" src="/assets/skill-waiting.mp4" autoPlay muted loop playsInline preload="auto" />
          <video
            ref={skillActionVideoRef}
            className="skill-action-video"
            playsInline
            preload="auto"
            onEnded={endSkillAction}
            style={{ opacity: skillActionActive ? 1 : 0 }}
          >
            <source src="/assets/skill-action-mobile.mp4" type="video/mp4" media="(max-width: 767px)" />
            <source src="/assets/skill-action.mp4" type="video/mp4" />
          </video>
          <div className="skill-stage-overlay" />
          <button
            type="button"
            className="skill-sound-toggle"
            aria-label={skillActionSoundEnabled ? "Turn fox afterimage sound off" : "Turn fox afterimage sound on"}
            aria-pressed={skillActionSoundEnabled}
            onClick={toggleSkillActionSound}
            disabled={!skillActionActive}
          >
            {skillActionSoundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            <span>{skillActionSoundEnabled ? "Action Sound On" : "Action Sound Off"}</span>
          </button>

          <motion.div
            className="skill-content section-wrap"
            animate={skillActionActive ? { opacity: 0, x: -90, filter: "blur(12px)" } : { opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <SectionHeader
              eyebrow="Combat Skill Loadout"
              title="Cast the awakened node. Upgrade the sealed techniques."
              copy="The active skill behaves like a playable combat slot, while locked skills read as upgrade targets."
            />
            <div className="skill-hud-strip">
              <div>
                <span>SKILL POINTS</span>
                <strong>01</strong>
              </div>
              <div>
                <span>ACTIVE SLOT</span>
                <strong>FOX AFTERIMAGE</strong>
              </div>
              <div>
                <span>INPUT</span>
                <strong>CLICK TO CAST</strong>
              </div>
            </div>
            <div className="skill-loadout">
              <motion.article
                className="skill-card fox-skill-card skill-node-active group"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7 }}
              >
                <button
                  type="button"
                  className="fox-skill-button"
                  onClick={startSkillAction}
                  aria-label="Cast fox afterimage skill"
                >
                  <div className="skill-cast-orb">
                    <span className="skill-cast-ring" />
                    <span className="skill-cast-ring delayed" />
                    <Sparkles size={28} />
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="skill-state ready">
                        <Zap size={13} />
                        Ready
                      </span>
                      <span className="danger-badge">S+ Active</span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-end gap-3">
                      <h3>여우 잔영</h3>
                      <span className="skill-kanji">狐残影</span>
                    </div>
                    <p>Fox afterimage protocol. Click to execute the sealed action sequence with combat audio.</p>
                    <div className="skill-cast-cta">
                      <Play size={15} />
                      <span>PRESS TO CAST</span>
                    </div>
                  </div>
                  <Flame className="skill-cast-flame" size={34} />
                </button>
              </motion.article>

              {skills.map((skill, index) => {
                const Icon = skill.icon;
                return (
                  <motion.article
                    key={skill.name}
                    className="skill-card locked-skill-card group"
                    initial={{ opacity: 0, x: index % 2 ? 30 : -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.7, delay: index * 0.06 }}
                    aria-disabled="true"
                  >
                    <div className="locked-skill-icon">
                      <Icon size={24} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3>{skill.name}</h3>
                        <span className="skill-state locked">
                          <LockKeyhole size={13} />
                          LV.{String(index + 2).padStart(2, "0")} REQUIRED
                        </span>
                        <span className="danger-badge">Danger {skill.danger}</span>
                      </div>
                      <p>{skill.copy}</p>
                      <div className="skill-upgrade-line">
                        <span>LEVEL UP REQUIRED</span>
                        <i />
                      </div>
                    </div>
                    <LockKeyhole className="locked-skill-mark" size={28} />
                  </motion.article>
                );
              })}
            </div>
          </motion.div>
        </section>

        <PersonaQASection />

        <section className="section-wrap">
          <SectionHeader
            eyebrow="Equipment"
            title="Hard tools for silent work."
            copy="Tactical items are presented as glowing artifact cards with restrained motion."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {equipment.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.name}
                  className="equipment-card"
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.65, delay: index * 0.05 }}
                >
                  <Icon size={34} />
                  <h3>{item.name}</h3>
                  <p>{item.type}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="section-wrap grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <SectionHeader
            eyebrow="Statistics"
            title="Combat telemetry rendered as a neon radar."
            copy="The numbers suggest a shinobi built to think three seconds ahead and disappear one second earlier."
          />
          <RadarChart />
        </section>

        <section className="section-wrap">
          <SectionHeader
            eyebrow="Relationship Web"
            title="Every bond is a classified vector."
            copy="Mentors, rivals, clan archives, and ANBU cells expand the myth beyond the first screen."
          />
          <div className="relationship-track">
            {relationships.map((item, index) => (
              <motion.article
                key={item.role}
                className={`relationship-card ${item.tone}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.06 }}
              >
                <span>{item.role}</span>
                <h3>{item.name}</h3>
                <p>{item.copy}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="section-wrap">
          <SectionHeader
            eyebrow="Lore Timeline"
            title="Mission records draw themselves back into existence."
            copy="Each entry is written like a recovered line from a forbidden operations log."
          />
          <div className="timeline">
            {timeline.map(([title, copy], index) => (
              <motion.div
                key={title}
                className="timeline-item"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-90px" }}
                transition={{ duration: 0.65, delay: index * 0.06 }}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="gallery" className="section-wrap">
          <SectionHeader
            eyebrow="Gallery"
            title="Concept sheets, interface mockups, and moonlit fragments."
            copy="The uploaded reference images are integrated as a masonry-style database gallery."
          />
          <div className="gallery-grid">
            {gallery.map((item, index) => (
              <motion.button
                key={`${item.title}-${index}`}
                className={`gallery-tile ${item.className}`}
                onClick={() => setSelectedImage(item)}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65, delay: index * 0.05 }}
              >
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  sizes="(min-width: 900px) 46vw, 92vw"
                  className="object-cover transition duration-700 hover:scale-[1.03]"
                  style={{ objectPosition: item.position }}
                />
                <span>{item.title}</span>
              </motion.button>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden py-28 md:py-36">
          <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-300/10 bg-[radial-gradient(circle,rgba(176,38,255,0.34),transparent_58%)] blur-sm" />
          <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-pink-300/20" />
          <motion.div
            className="relative mx-auto max-w-4xl px-5 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85 }}
          >
            <p className="eyebrow justify-center">Philosophy</p>
            <blockquote className="mt-6 font-serif text-[clamp(3rem,8vw,7.2rem)] leading-[0.92] text-white">
              “I can be your dream...
              <span className="block text-violet-300">or your nightmare.”</span>
            </blockquote>
          </motion.div>
        </section>

        <footer id="contact" className="site-footer border-t border-white/10 bg-[#070812] px-5 py-12">
          <div className="mx-auto grid w-[min(1180px,100%)] gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <p className="font-serif text-3xl text-white">ACCESS COMPLETE.</p>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-400">
                {companyInfo.name}({companyInfo.englishName})가 제작한 인터랙티브 시네마틱 랜딩페이지
                쇼케이스입니다. 홈페이지, 랜딩페이지, AI/웹앱 제작문의는 아래 버튼으로 바로 전달됩니다.
              </p>
              <div className="mt-6 grid gap-3 text-sm text-zinc-300 sm:grid-cols-2">
                <div className="footer-info">
                  <Building2 size={16} />
                  <span>{companyInfo.name} · {companyInfo.englishName}</span>
                </div>
                <div className="footer-info">
                  <Activity size={16} />
                  <span>대표 {companyInfo.ceo} · 설립 {companyInfo.founded}</span>
                </div>
                <div className="footer-info">
                  <Database size={16} />
                  <span>사업자등록번호 {companyInfo.businessNumber}</span>
                </div>
                <div className="footer-info">
                  <Crosshair size={16} />
                  <span>DUNS {companyInfo.duns}</span>
                </div>
                <div className="footer-info sm:col-span-2">
                  <MapPin size={16} />
                  <span>{companyInfo.address}</span>
                </div>
                <div className="footer-info">
                  <Phone size={16} />
                  <span>{companyInfo.phone}</span>
                </div>
                <div className="footer-info">
                  <Mail size={16} />
                  <span>{companyInfo.email}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 lg:items-end">
              <div className="flex flex-wrap gap-3 lg:justify-end">
                {[...socialLinks, { icon: Activity, label: "Contact" }].map(({ icon: Icon, label }) => (
                  <a key={label} href={label === "Contact" ? `mailto:${companyInfo.email}` : "#"} className="social-link">
                    <Icon size={16} />
                    <span>{label}</span>
                  </a>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <a
                  href={companyInfo.homepage}
                  target="_blank"
                  rel="noreferrer"
                  className="footer-cta secondary"
                >
                  <ExternalLink size={16} />
                  <span>LUDGI 공식 정보</span>
                </a>
                <button type="button" className="footer-cta" onClick={openInquiry}>
                  <Mail size={16} />
                  <span>홈페이지 제작문의</span>
                </button>
              </div>
            </div>
          </div>
        </footer>
      </main>

      <div className="inquiry-dock">
        <AnimatePresence>
          {inquiryOpen ? (
            <motion.aside
              className="inquiry-panel"
              role="dialog"
              aria-modal="true"
              aria-label="홈페이지 제작문의"
              initial={{ opacity: 0, y: 22, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.96 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow">LUDGI PROJECT REQUEST</p>
                  <h2 className="mt-2 font-serif text-2xl text-white">홈페이지 제작문의</h2>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    darima.xyz에서 온 문의로 표시되어 바로 구분됩니다.
                  </p>
                </div>
                <button
                  type="button"
                  className="inquiry-close"
                  onClick={closeInquiry}
                  aria-label="Close inquiry form"
                >
                  <X size={18} />
                </button>
              </div>
              <form className="mt-5 grid gap-3" onSubmit={submitInquiry}>
                <input
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                  name="website"
                  value={inquiryForm.website}
                  onChange={updateInquiry}
                />
                <label className="inquiry-field">
                  <span>이름 / 담당자 *</span>
                  <input
                    name="name"
                    value={inquiryForm.name}
                    onChange={updateInquiry}
                    placeholder="홍길동"
                    required
                  />
                </label>
                <label className="inquiry-field">
                  <span>회사명</span>
                  <input
                    name="company"
                    value={inquiryForm.company}
                    onChange={updateInquiry}
                    placeholder="주식회사 럿지"
                  />
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="inquiry-field">
                    <span>이메일 *</span>
                    <input
                      name="email"
                      type="email"
                      value={inquiryForm.email}
                      onChange={updateInquiry}
                      placeholder="name@example.com"
                      required
                    />
                  </label>
                  <label className="inquiry-field">
                    <span>연락처</span>
                    <input
                      name="phone"
                      value={inquiryForm.phone}
                      onChange={updateInquiry}
                      placeholder="010-0000-0000"
                    />
                  </label>
                </div>
                <label className="inquiry-field">
                  <span>프로젝트 개요 *</span>
                  <textarea
                    name="message"
                    value={inquiryForm.message}
                    onChange={updateInquiry}
                    placeholder="원하는 홈페이지/랜딩페이지 분위기, 예산, 일정 등을 알려주세요."
                    rows={5}
                    minLength={10}
                    required
                  />
                </label>
                <div className="turnstile-shell">
                  {turnstileSiteKey ? (
                    <div ref={turnstileContainerRef} className="turnstile-widget" />
                  ) : (
                    <p>
                      {turnstileConfigLoaded
                        ? "Turnstile site key is not configured."
                        : "보안 인증 설정을 확인하는 중입니다."}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="inquiry-submit"
                  disabled={inquiryStatus === "sending" || Boolean(turnstileSiteKey && !turnstileToken)}
                >
                  {inquiryStatus === "sending" ? <LoaderCircle className="animate-spin" size={18} /> : <Send size={18} />}
                  <span>{inquiryStatus === "sending" ? "전송 중..." : "milli@molluhub.com 으로 문의 보내기"}</span>
                </button>
                {inquiryNotice ? (
                  <p className={`inquiry-notice ${inquiryStatus}`}>
                    {inquiryStatus === "success" ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                    <span>{inquiryNotice}</span>
                  </p>
                ) : null}
              </form>
            </motion.aside>
          ) : null}
        </AnimatePresence>
        <button type="button" className="inquiry-fab" onClick={openInquiry} aria-label="홈페이지 제작문의 열기">
          <Mail size={19} />
          <span>제작문의</span>
        </button>
      </div>

      <AnimatePresence>
        {selectedImage ? (
          <motion.div
            className="fixed inset-0 z-[90] grid place-items-center bg-black/82 p-4 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="relative max-h-[88vh] max-w-[96vw] overflow-hidden border border-violet-300/20 bg-[#0d1020]"
              initial={{ scale: 0.94, y: 22 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 22 }}
              onClick={(event) => event.stopPropagation()}
            >
              <Image
                src={selectedImage.src}
                alt={selectedImage.title}
                width={selectedImage.width || 1536}
                height={selectedImage.height || 1024}
                sizes="96vw"
                className="block max-h-[88vh] w-auto max-w-[96vw] object-contain"
              />
              <button
                className="absolute right-4 top-4 grid h-10 w-10 place-items-center border border-white/10 bg-black/60 text-white backdrop-blur"
                onClick={() => setSelectedImage(null)}
                aria-label="Close gallery image"
              >
                <X size={18} />
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

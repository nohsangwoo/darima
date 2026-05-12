"use client";

import { AnimatePresence, motion } from "framer-motion";
import Lenis from "lenis";
import {
  Activity,
  ChevronDown,
  Crosshair,
  Database,
  Eye,
  Flame,
  Hexagon,
  Camera,
  Leaf,
  Menu,
  Music2,
  Orbit,
  Radio,
  ScrollText,
  Send,
  Shield,
  Sparkles,
  Swords,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

const navItems = [
  ["Home", "hero"],
  ["About", "overview"],
  ["Skills", "skills"],
  ["Gallery", "gallery"],
  ["Contacts", "contact"],
] as const;

const socialLinks: Array<{ icon: LucideIcon; label: string }> = [
  { icon: Send, label: "Discord" },
  { icon: Camera, label: "Instagram" },
  { icon: Music2, label: "TikTok" },
];

const heroVideoSources = ["/assets/ayame-hero.mp4", "/assets/ayame-hero-reverse.mp4"] as const;

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

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<(typeof gallery)[number] | null>(null);
  const [heroProgress, setHeroProgress] = useState(0);
  const [heroVideoIndex, setHeroVideoIndex] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroVideoRefs = useRef<Array<HTMLVideoElement | null>>([]);

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

  return (
    <>
      <IntroLoader loading={loading} />
      <ParticleField />
      <MagneticCursor />
      <Navbar />

      <main className="relative z-10 overflow-hidden bg-[#05060a] text-zinc-100">
        <section id="hero" ref={heroRef} className="relative min-h-screen overflow-hidden pt-28">
          {heroVideoSources.map((source, index) => (
            <video
              key={source}
              ref={(element) => {
                heroVideoRefs.current[index] = element;
              }}
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
              src={source}
              autoPlay={index === 0}
              muted
              preload="auto"
              playsInline
              onEnded={() => setHeroVideoIndex((current) => (current + 1) % heroVideoSources.length)}
              style={{
                transform: `scale(${1 + heroProgress * 0.16})`,
                opacity: heroVideoIndex === index ? 1 - heroProgress * 0.74 : 0,
              }}
            />
          ))}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_28%,rgba(176,38,255,0.24),transparent_31%),linear-gradient(90deg,#05060a_0%,rgba(5,6,10,0.86)_38%,rgba(5,6,10,0.42)_68%,#05060a_100%)]" />
          <div className="absolute left-[12%] top-[16%] h-60 w-60 rounded-full border border-violet-300/10 bg-violet-400/10 blur-3xl moon-pulse" />
          <div className="scan-lines" />

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

        <section id="skills" className="section-wrap">
          <SectionHeader
            eyebrow="Forbidden Technique Documents"
            title="Every technique leaves a violet afterimage."
            copy="Hover the archive cards to expose the danger layer and ocular telemetry."
          />
          <div className="grid gap-4">
            {skills.map((skill, index) => {
              const Icon = skill.icon;
              return (
                <motion.article
                  key={skill.name}
                  className="skill-card group"
                  initial={{ opacity: 0, x: index % 2 ? 30 : -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7, delay: index * 0.06 }}
                >
                  <div className="grid h-14 w-14 place-items-center border border-violet-300/20 bg-violet-400/[0.08] text-violet-200">
                    <Icon size={24} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3>{skill.name}</h3>
                      <span className="danger-badge">Danger {skill.danger}</span>
                    </div>
                    <p>{skill.copy}</p>
                  </div>
                  <Eye className="hidden text-violet-300/50 transition group-hover:text-pink-300 md:block" size={28} />
                </motion.article>
              );
            })}
          </div>
        </section>

        <section className="section-wrap">
          <SectionHeader
            eyebrow="Equipment"
            title="Hard tools for silent work."
            copy="Tactical items are presented as rotating artifact cards with a restrained 3D tilt."
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

        <footer id="contact" className="border-t border-white/10 bg-[#070812] px-5 py-12">
          <div className="mx-auto flex w-[min(1180px,100%)] flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-serif text-3xl text-white">ACCESS COMPLETE.</p>
              <p className="mt-2 text-sm text-zinc-400">Ayame Uchiha dossier unlocked for cinematic preview.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {[...socialLinks, { icon: Activity, label: "Contact" }].map(({ icon: Icon, label }) => (
                <a key={label} href="#" className="social-link">
                  <Icon size={16} />
                  <span>{label}</span>
                </a>
              ))}
            </div>
          </div>
        </footer>
      </main>

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

import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative isolate grid min-h-screen place-items-center overflow-hidden bg-[#05060a] px-5 py-20 text-zinc-100">
      <Image
        src="/assets/ayame-ui-concept.png"
        alt="Darima classified database background"
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover opacity-22"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#05060a_0%,rgba(5,6,10,0.9)_46%,#05060a_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.045)_0px,rgba(255,255,255,0.045)_1px,transparent_1px,transparent_9px)] opacity-18" />

      <section className="w-[min(980px,100%)] border border-violet-300/20 bg-[#080914]/82 p-6 shadow-[0_0_70px_rgba(139,92,246,0.18)] backdrop-blur-xl md:p-10">
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
          <div className="border border-white/10 bg-black/30 p-5">
            <p className="font-mono text-7xl leading-none text-pink-300 md:text-8xl">404</p>
            <p className="mt-4 text-[11px] uppercase tracking-[0.36em] text-violet-200">Route Missing</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.34em] text-violet-300">Classified record not found</p>
            <h1 className="mt-4 font-serif text-[clamp(3rem,8vw,6.8rem)] leading-[0.9] text-white">
              이 문서는
              <span className="block text-violet-300">봉인되었습니다.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-400">
              요청한 페이지를 찾을 수 없습니다. Darima 데이터베이스 홈, 주식회사 럿지 회사소개,
              AI 페르소나 질답 게시판 중 필요한 기록으로 이동하세요.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <Link href="/" className="border border-pink-300/40 bg-pink-500/15 px-5 py-4 text-center text-xs uppercase tracking-[0.22em] text-white transition hover:bg-pink-500/25">
            Home
          </Link>
          <Link href="/company" className="border border-violet-300/30 bg-violet-500/10 px-5 py-4 text-center text-xs uppercase tracking-[0.22em] text-violet-100 transition hover:bg-violet-500/20">
            Company
          </Link>
          <Link href="/persona-board" className="border border-white/10 bg-white/[0.035] px-5 py-4 text-center text-xs uppercase tracking-[0.22em] text-zinc-200 transition hover:border-violet-300/40">
            Q&A Board
          </Link>
        </div>
      </section>
    </main>
  );
}

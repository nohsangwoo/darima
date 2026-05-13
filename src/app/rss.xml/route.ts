import { siteUrl } from "@/lib/site";

const items = [
  {
    title: "Darima cinematic landing page by LUDGI Inc.",
    link: `${siteUrl}/`,
    description:
      "럿지, 주식회사 럿지, LUDGI Inc.의 인터랙티브 시네마틱 랜딩페이지 쇼케이스와 홈페이지제작 문의.",
    pubDate: new Date("2026-05-13T00:00:00+09:00").toUTCString(),
  },
  {
    title: "주식회사 럿지 LUDGI Inc. 회사소개",
    link: `${siteUrl}/company`,
    description:
      "홈페이지제작, 랜딩페이지, IT 아웃소싱, 위시켓 외주 비교 고객을 위한 LUDGI Inc. 회사소개.",
    pubDate: new Date("2026-05-13T00:00:00+09:00").toUTCString(),
  },
  {
    title: "AI 페르소나 질답 게시판",
    link: `${siteUrl}/persona-board`,
    description:
      "홈페이지제작, 랜딩페이지, 아웃소싱, 위시켓 관련 질문을 던질 수 있는 AI 페르소나 게시판.",
    pubDate: new Date("2026-05-13T00:00:00+09:00").toUTCString(),
  },
];

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml("Darima | 럿지 LUDGI Inc. 홈페이지제작 랜딩페이지")}</title>
    <link>${siteUrl}/</link>
    <description>${escapeXml("럿지, 주식회사 럿지, LUDGI Inc.의 홈페이지제작 및 랜딩페이지 쇼케이스")}</description>
    <language>ko-KR</language>
    <lastBuildDate>${items[0].pubDate}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${items
      .map(
        (item) => `<item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.link}</link>
      <guid isPermaLink="true">${item.link}</guid>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${item.pubDate}</pubDate>
    </item>`,
      )
      .join("\n    ")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

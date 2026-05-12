const baseUrl = "https://www.darima.xyz";

const items = [
  {
    title: "Darima cinematic landing page by LUDGI Inc.",
    link: `${baseUrl}/`,
    description:
      "럿지, 주식회사 럿지, LUDGI Inc.의 인터랙티브 시네마틱 랜딩페이지 쇼케이스와 홈페이지 제작문의.",
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
    <title>${escapeXml("Darima | LUDGI Inc. Homepage Landing Page")}</title>
    <link>${baseUrl}/</link>
    <description>${escapeXml("럿지, 주식회사 럿지, LUDGI Inc.의 홈페이지 및 랜딩페이지 제작 쇼케이스")}</description>
    <language>ko-KR</language>
    <lastBuildDate>${items[0].pubDate}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
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

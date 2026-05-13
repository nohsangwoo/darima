import type { MetadataRoute } from "next";

const baseUrl = "https://www.darima.xyz";
const lastModified = new Date("2026-05-13T00:00:00+09:00");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${baseUrl}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}

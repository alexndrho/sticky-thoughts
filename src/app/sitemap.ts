import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://stickythoughts.alexanderho.dev",
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1.0,
    },
    {
      url: "https://stickythoughts.alexanderho.dev/about",
      lastModified: "2023-04-30",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://stickythoughts.alexanderho.dev/contact",
      lastModified: "2023-11-22",
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: "https://stickythoughts.alexanderho.dev/terms-and-conditions",
      lastModified: "2024-05-07",
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: "https://stickythoughts.alexanderho.dev/privacy-policy",
      lastModified: "2024-05-07",
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: "https://stickythoughts.alexanderho.dev/disclaimer",
      lastModified: "2024-05-07",
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}

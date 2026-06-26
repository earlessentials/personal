import type { MetadataRoute } from "next";
import { worlds } from "@/content/worlds";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap { const root = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"; return ["", "/about", "/pearls", "/drift", "/play", "/services", "/contact", ...worlds.map((w) => `/worlds/${w.id}`)].map((path) => ({ url: `${root}${path}`, lastModified: new Date() })); }

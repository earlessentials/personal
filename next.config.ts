import type { NextConfig } from "next";

function normalizeBasePath(value: string | undefined) {
  if (!value || value === "/") return "";
  return value.startsWith("/") ? value : `/${value}`;
}

const hasExplicitBasePath = Object.prototype.hasOwnProperty.call(process.env, "NEXT_PUBLIC_BASE_PATH");
const legacyGithubPagesBasePath = process.env.GITHUB_PAGES_REPO ? `/${process.env.GITHUB_PAGES_REPO}` : "";
const basePath = hasExplicitBasePath
  ? normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH)
  : normalizeBasePath(legacyGithubPagesBasePath);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  ...(basePath ? { basePath, assetPrefix: `${basePath}/` } : {}),
};

export default nextConfig;

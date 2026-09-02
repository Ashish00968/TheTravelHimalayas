import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  transpilePackages: ["framer-motion", "lucide-react"],
  serverExternalPackages: ["mapbox-gl"],
  images: {
    // AVIF first for maximum compression, WebP as fallback
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "cdn.pixabay.com" },
    ],
  },
  compress: true,
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: "/treks",
        destination: "/#regions",
        permanent: false,
      },
      {
        source: "/peaks",
        destination: "/#regions",
        permanent: false,
      },
      {
        source: "/regions",
        destination: "/#regions",
        permanent: false,
      },
      {
        source: "/treks/:slug",
        destination: "/explore/himachal-pradesh/kullu/:slug",
        permanent: false,
      },
      {
        source: "/peaks/:slug",
        destination: "/explore/himachal-pradesh/kullu/:slug",
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;

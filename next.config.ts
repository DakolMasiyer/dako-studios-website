import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },
  turbopack: {},

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ui.shadcn.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    // Cache optimized images for 30 days instead of the previous max-age=0,
    // so repeat visitors don't re-fetch every /_next/image response.
    minimumCacheTTL: 2592000,
  },

  // Headers for better security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://ui.shadcn.com https://images.unsplash.com https://res.cloudinary.com; font-src 'self' data:; media-src 'self' https://res.cloudinary.com; connect-src 'self' https://api.airtable.com https://api.resend.com https://vitals.vercel-insights.com;",
          },
        ],
      },
      {
        // Static media in /public was served max-age=0; give it real cache
        // lifetimes. Images use a renamable 30-day window; any residual video
        // assets get a long immutable lifetime (reels now ship from Cloudinary).
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=2592000' },
        ],
      },
      {
        source: '/videos/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },

  // Redirects for better SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/dashboard',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

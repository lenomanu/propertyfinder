const buildCalendarYear = String(new Date().getFullYear());

/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  output: "standalone",

  env: {
    NEXT_PUBLIC_BUILD_YEAR: buildCalendarYear,
  },

  poweredByHeader: false,

  async redirects() {
    return [
      {
        source: "/login",
        destination: "/auth/login",
        permanent: true,
      },
      {
        source: "/admin/approvals",
        destination: "/admin/properties/pending",
        permanent: true,
      },
      {
        source: "/agent/agency",
        destination: "/agent/team",
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

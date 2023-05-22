/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  // i18n: {
  //   locales: ["en"],
  //   defaultLocale: "en",
  // },
  experimental: {
    appDir: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        port: '',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/(signup|login)',
        has: [
          {
            type: 'cookie',
            key: 'movie-app-refresh-token',
          },
        ],
        permanent: true,
        destination: '/',
      },
    ];
  },
};
export default config;

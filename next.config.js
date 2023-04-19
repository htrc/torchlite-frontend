/**
 * @type {import('next').NextConfig}
 */

/* eslint-disable @typescript-eslint/no-var-requires */
const withTM = require('next-transpile-modules')(['@babel/preset-react']);

module.exports = withTM({
  reactStrictMode: true,
  images: {
    domains: ['flagcdn.com']
  },
  env: {
    REACT_APP_VERSION: process.env.REACT_APP_VERSION,
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true
  },
  async redirects() {
    // redirect - default first page should be `login` when root URL like http://example.com/
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true
      }
    ];
  }
});

/**
 * @type {import('next').NextConfig}
 */

/* eslint-disable @typescript-eslint/no-var-requires */
const withTM = require('next-transpile-modules')(['@babel/preset-react']);

module.exports = withTM({
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: ['flagcdn.com']
  },
  env: {
    // REACT_APP_VERSION: process.env.REACT_APP_VERSION,
    // GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
    // NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    // NEXT_PUBLIC_NEXTAUTH_URL: process.env.NEXT_PUBLIC_NEXTAUTH_URL,
    // JWT_SECRET: process.env.JWT_SECRET,
    // JWT_TIMEOUT: process.env.JWT_TIMEOUT,
    // TEST_ENV: 'test!!!!'
    // NEXT_PUBLIC_TEST_ENV: 'this is for client side'
    // NEXT_PUBLIC_JWT_TIMEOUT: process.env.NEXT_PUBLIC_JWT_TIMEOUT,
    // NEXT_PUBLIC_BASE_API_URI: process.env.NEXT_PUBLIC_BASE_API_URI,
    // NEXTAUTH_SECRET_KEY: process.env.NEXTAUTH_SECRET_KEY
    // NEXT_PUBLIC_NEXTAUTH_SECRET_KEY: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET_KEY
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

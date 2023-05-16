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
  env: {},
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

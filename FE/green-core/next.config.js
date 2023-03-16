/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // useEffect twice
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  // basePath: '',
  // assetPrefix: './',
};

module.exports = nextConfig;

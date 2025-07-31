/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
    ];
  },
  // Railway-specific optimizations
  experimental: {
    serverComponentsExternalPackages: ['puppeteer']
  },
  // Ensure API routes are not statically exported
  trailingSlash: false,
  generateEtags: false
};

module.exports = nextConfig; 
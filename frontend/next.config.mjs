/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval';
              style-src 'self' 'unsafe-inline';
              connect-src 'self' http://localhost:5000;
            `.replace(/\n/g, ''),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
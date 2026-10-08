/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [{ source: "/projects/ninhon", destination: "/projects/nihon", permanent: true }];
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const imageDomain = process.env.NEXT_PUBLIC_IMAGE_DOMAIN;
const nextConfig = {
  /* config options here */
  images: {
    domains: imageDomain ? [imageDomain] : [],
  },
  reactCompiler: true,
};

export default nextConfig;

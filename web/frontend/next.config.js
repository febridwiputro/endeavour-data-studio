/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.cache = false; // Disable cache
    return config;
  },
};

module.exports = nextConfig;


// module.exports = {
//     webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
//       config.cache = false; // Disable cache
//       return config;
//     },
//   };
  
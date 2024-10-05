module.exports = {
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
      config.cache = false; // Disable cache
      return config;
    },
  };
  
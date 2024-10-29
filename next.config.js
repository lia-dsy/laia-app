// next.config.js
module.exports = {
    productionBrowserSourceMaps: false,  // Disables source maps in production
    webpack: (config) => {
      config.devtool = false;  // Disables source maps in development
      return config;
    },
  };
  
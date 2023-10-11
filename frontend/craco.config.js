const path = require("path");
const crypto = require("crypto");
const os = require("os");
const stream = require("stream-browserify");
const buffer = require("buffer/");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Add fallbacks for 'path', 'crypto', 'os', 'stream', and 'buffer' modules
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        path: require.resolve("path-browserify"),
        crypto: require.resolve("crypto-browserify"),
        os: require.resolve("os-browserify/browser"),
        stream: require.resolve("stream-browserify"),
        buffer: require.resolve("buffer"),
      };

      return webpackConfig;
    },
  },
};

module.exports = {
  resolve: {
    fallback: {
      assert: require.resolve("assert"),
      crypto: require.resolve("crypto-browserify"),
      constants: require.resolve("constants-browserify"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      os: require.resolve("os-browserify/browser"),
      stream: require.resolve("stream-browserify"),
      util: require.resolve("util/"),
      url: require.resolve("url/"),
      path: require.resolve("path-browserify"),
      fs: require.resolve("fs"),
      zlib: require.resolve("browserify-zlib"),
    },
  },
};

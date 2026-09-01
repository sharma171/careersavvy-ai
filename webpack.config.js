module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        exclude: /node_modules\/monaco-editor/, // prevent source-map-loader from processing Monaco files
        use: ['source-map-loader'],
      },
    ],
  },
  ignoreWarnings: [
    {
      module: /node_modules\/monaco-editor/,
      message: /Failed to parse source map/,
    },
  ],
};

module.exports = function override(config, env) {
  const sourceMapLoaderRule = config.module.rules.find(rule =>
    Array.isArray(rule.oneOf)
  );

  if (sourceMapLoaderRule) {
    sourceMapLoaderRule.oneOf = sourceMapLoaderRule.oneOf.map(rule => {
      if (
        rule.enforce === 'pre' &&
        rule.use &&
        rule.use.includes('source-map-loader')
      ) {
        rule.exclude = /node_modules\/monaco-editor/;
      }
      return rule;
    });
  }

  config.ignoreWarnings = [
    {
      module: /node_modules\/monaco-editor/,
      message: /Failed to parse source map/,
    },
  ];

  return config;
};

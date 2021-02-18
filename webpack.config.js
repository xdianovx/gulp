module.exports = {
  entry: { main: './app/js/main.js' },
    output: {
      filename: 'build.js',
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /(node_modules)/,
          loader: 'babel-loader',
          query: {
            presets: [
              ['latest', { modules: false }],
            ],
          },
        },
      ],
    },
  };
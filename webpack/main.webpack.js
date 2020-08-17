const path = require('path');
const webpack = require('webpack');

module.exports = (env = {}) => {
  const isProduction = env.prod;
  const devServer = env.useDevServer;

  const sourceDir = path.join(process.cwd(), 'src');
  const mainDir = path.join(sourceDir, 'main');
  const mainEntry = path.join(mainDir, 'index.ts');

  const folder = isProduction ? 'release' : 'debug';

  const mainOutputDir = path.join(process.cwd(), 'build', folder);

  const config = {
    mode: isProduction ? 'production' : 'development',
    target: 'electron-main',
    entry: mainEntry,
    output: {
      path: mainOutputDir,
      filename: 'main.js',
      publicPath: '/',
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: ['/node_modules'],
          use: [
            { loader: 'babel-loader' },
            {
              loader: 'awesome-typescript-loader',
              options: {
                lib: ['esnext'],
                transpileOnly: true,
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.webpack.js', '.ts', '.js'],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.USE_DEV_SERVER': devServer,
        'pcocess.env.NODE_ENV': isProduction,
      }),
    ],
    devtool: 'cheap-module-eval-source-map',
  };

  return config;
};

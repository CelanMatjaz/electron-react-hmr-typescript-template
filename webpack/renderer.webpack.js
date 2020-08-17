const path = require('path');
const webpack = require('webpack');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = (env = {}) => {
  const isProduction = env.prod;
  const publicPath = 'http://localhost:8080/build/debug/';

  const sourceDir = path.join(process.cwd(), 'src');
  const rendererDir = path.join(sourceDir, 'renderer');

  const rendererEntry = path.join(rendererDir, 'index.tsx');
  const sassEntry = path.join(rendererDir, 'sass/index.scss');

  const folder = isProduction ? 'release' : 'debug';

  const rendererOutputDir = path.join(process.cwd(), 'build', folder, 'renderer');

  const config = {
    mode: isProduction ? 'production' : 'development',
    target: 'electron-renderer',
    entry: [rendererEntry, sassEntry],
    output: {
      path: rendererOutputDir,
      filename: 'bundle.js',
      publicPath,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: ['/node_modules'],
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  '@babel/preset-env',
                  '@babel/preset-react',
                  '@babel/preset-typescript',
                ],
                plugins: ['@babel/plugin-transform-template-literals'],
              },
            },
            {
              loader: 'awesome-typescript-loader',
              options: {
                lib: ['ES6'],
                transpileOnly: true,
              },
            },
          ],
        },
        {
          test: /\.(scss|sass)$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
          exclude: /node_modules/,
        },
      ],
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new MiniCssExtractPlugin(),
      new HtmlWebpackPlugin({
        template: path.join(process.cwd(), 'src/renderer', 'template.html'),
        filename: 'index.html',
      }),
      new webpack.DefinePlugin({
        'pcocess.env.NODE_ENV': isProduction,
      }),
      !isProduction && new ReactRefreshWebpackPlugin(),
    ].filter(Boolean),
    resolve: {
      extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.scss'],
      modules: ['node_modules'],
    },
    devtool: 'cheap-module-eval-source-map',
    devServer: {
      hot: true,
      contentBase: rendererOutputDir,
      publicPath,
    },
  };

  return config;
};

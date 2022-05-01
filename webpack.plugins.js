const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = [
  new ForkTsCheckerWebpackPlugin(),
  new CopyPlugin({
    patterns: [
      // Copy Shoelace assets to dist/shoelace
      {
        from: path.resolve(
          __dirname,
          'node_modules/@shoelace-style/shoelace/dist/assets'
        ),
        to: path.resolve(__dirname, '.webpack/renderer/public/shoelace/assets'),
      },
    ],
  }),
];

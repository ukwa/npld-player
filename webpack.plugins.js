const path = require('path');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

// Read from .env file
require('dotenv').config();

module.exports = [
  // Make env variables available with `process.env.ENV_VARIABLE`
  new webpack.EnvironmentPlugin([
    'NPLD_PLAYER_INITIAL_WEB_ADDRESS',
    'NPLD_PLAYER_ENABLE_PRINT',
  ]),
  new ForkTsCheckerWebpackPlugin(),
  new CopyPlugin({
    patterns: [
      // Copy Shoelace assets to public/shoelace
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

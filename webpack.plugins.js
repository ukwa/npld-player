const path = require('path');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

// Read from .env file
require('dotenv').config();

module.exports = [
  // Make env variables available with `process.env.ENV_VARIABLE`
  new webpack.EnvironmentPlugin([
    // Avoid hardcoding these configuration parameters:
    //'NPLD_PLAYER_PREFIX',
    //'NPLD_PLAYER_INITIAL_WEB_ADDRESS',
    'NPLD_PLAYER_AUTH_TOKEN_NAME',
    'NPLD_PLAYER_AUTH_TOKEN_VALUE',
    'NPLD_PLAYER_ENABLE_PRINT',
    'NPLD_PLAYER_ALLOW_DEVTOOLS'
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
        to: path.resolve(
          __dirname,
          '.webpack/renderer/main_window/public/shoelace/assets'
        ),
      },
    ],
  }),
];

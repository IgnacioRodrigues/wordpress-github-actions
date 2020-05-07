const path = require('path');
const glob = require("glob");
// This plugin extracts CSS into separate files. It creates a CSS file per JS file which contains CSS.
// It supports On-Demand-Loading of CSS and SourceMaps.
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// autoprefixer plugin to parse CSS and add vendor prefixes to CSS
const autoprefixer = require('autoprefixer');
// To copies individual files or entire directories, which already exist, to the build directory.
const CopyWebpackPlugin = require('copy-webpack-plugin');
// Compile the css pure and minify
const CssoWebpackPlugin = require('csso-webpack-plugin').default;
const webpack = require('webpack');
// Plugin for generate fonts from svg
const IconfontWebpackPlugin = require('iconfont-webpack-plugin');

module.exports = {
  externals: {
    jquery: 'jQuery'
  },
  entry: {
    app:'./js/src/app.js'
  },
  output: {
    path: __dirname,
    filename: './js/app.js'
  },
  stats: 'errors-only',
  module: {
    rules: [
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: 'postcss-loader',
            options: {
              plugins: (loader) => [
                new IconfontWebpackPlugin({
                  resolve: loader.resolve,
                  fontNamePrefix: 'academy-',
                  enforcedSvgHeight: 3000,
                  modules: false,
                })
              ]
            }
          },
          "postcss-loader",
          "sass-loader"
        ]
      },
      // url loader for fonts
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/',
            publicPath: url => `../fonts/${url}`
          }
        }]
      },
      // url loader for images
      {
        test: /\.(gif|png|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
          emitFile: false,
          publicPath: url => `../${url}`
        }
      },
    ]
  },
  plugins: [
    // extract css into min.css file
    new MiniCssExtractPlugin({
      filename: './css/style.min.css'
    }),
    new CssoWebpackPlugin(),
    new CopyWebpackPlugin([{
		from: './img/src/',
    	to: path.resolve(__dirname, './img/')
    }])
  ]
};

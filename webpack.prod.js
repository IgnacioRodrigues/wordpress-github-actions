const merge = require('webpack-merge');
const common = require('./webpack.common.js');
// This plugin uses uglify-js to minify your JavaScript.
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
// It supports On-Demand-Loading of CSS and SourceMaps.
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// It will search for CSS assets during the Webpack build and will optimize \ minimize the CSS
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
// This is a simple plugin that uses Imagemin to compress all images in your project.
const ImageminPlugin = require("imagemin-webpack-plugin").default;
// Plugin for minification the jpg images
const imageminMozjpeg = require('imagemin-mozjpeg');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // only enable hot in development
              hmr: process.env.NODE_ENV === 'production',
              // if hmr does not work, this is a forceful method.
              reloadAll: true,
            },
          },
        'css-loader',
       ],
      }
    ]
  },
  plugins: [
    // minification the images
    new ImageminPlugin({
      bail: false, // Ignore errors on corrupted images
      cache: true,
      imageminOptions: {
        // Before using imagemin plugins make sure you have added them in `package.json` (`devDependencies`) and installed them

        // Lossless optimization with custom option
        // Feel free to experiment with options for better result for you
        plugins: [
          ["gifsicle", { interlaced: true }],
          ["jpegtran", { progressive: true }],
          ["optipng", { optimizationLevel: 5 }],
          ["imageminMozjpeg", { quality: 50 }],
          ["svgo", { plugins: [ { removeViewBox: true }] }]
        ]
      }
    })
  ],
  // optimization the javascript and css
  optimization: {
    minimize: true,
    minimizer: [
      // enable the js minification plugin
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
      }),
      // enable the css minification plugin
      new OptimizeCSSAssetsPlugin({
        assetNameRegExp: /\.optimize\.css$/g,
        cssProcessor: require('cssnano'),
        cssProcessorPluginOptions: {
          preset: ['default', {
            discardComments: {
              removeAll: true
            }
          }],
        },
        canPrint: true
      })
    ]
  }
});

const merge = require('webpack-merge');
const common = require('./webpack.common.js');
// BrowserSync
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'source-map', // any "source-map"-like devtool is possible
  plugins: [
  new BrowserSyncPlugin({
    files: [{
            match: [
                './css/src/**/*.scss',
                './js/src/main.js',
                './img/',
                './layouts/'
            ],
            fn: function(event, file) {
                if (event === "change") {
                    const bs = require('browser-sync').get('bs-webpack-plugin');
                    bs.reload();
                }
            }
        }]
    }, {
        reload: false
    })
  ]
});

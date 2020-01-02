const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const MinifyPlugin = require('babel-minify-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  // plugins: [
  //   new MinifyPlugin({}, {
  //     comments: false,
  //     exclude: /(node_modules|bower_components)/,
  //   })
  // ]
});

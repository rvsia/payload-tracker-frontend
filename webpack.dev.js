const path = require('path');
const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || "3000";

module.exports = merge(common('development'), {
  module: {
    rules: [
      {
        test: /src\/.*\.js$/,
        exclude: /node_modules/,
        use: [{ loader: 'eslint-loader' }]
      }
    ]
  },
  mode: "development",
  devtool: "eval-source-map",
  devServer: {
    contentBase: "./dist",
    host: HOST,
    port: PORT,
    compress: true,
    inline: true,
    historyApiFallback: true,
    hot: true,
    overlay: true,
    open: true
  }
});

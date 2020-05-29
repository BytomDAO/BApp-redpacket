const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

let publicPath = '/'
if (process.env.NODE_ENV === 'production') {
  publicPath = '/redpacket/'
}

module.exports = {
  entry: ["babel-polyfill", "./src/index.js"],
  output: {
    path: path.join(__dirname, "/dist"),
    filename: "index-bundle.js",
    publicPath: publicPath
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /\.jpe?g$|\.gif$|\.png$|\.PNG$|\.svg$|\.woff(2)?$|\.ttf$|\.eot$/,
        loaders: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'static/img',
          },
        }],
      },
      {
        test:/\.(s*)css$/,
        use:['style-loader','css-loader', 'sass-loader']
      }
    ]
  },
  devServer: {
    historyApiFallback: true,
    port: 8888,
    // Send API requests on localhost to API server get around CORS.
  },
  resolve: {
    extensions: ['.scss', '.css', '.js', '.jsx', '.json'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    }),
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      jquery: 'jquery'
    })
  ],
  externals: {
    config:  "config",
  }
};
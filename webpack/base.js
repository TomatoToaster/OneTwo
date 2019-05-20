const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");


const ProjectRoot = path.resolve(__dirname, '..');


module.exports = {
  mode: "development",
  entry: path.resolve(ProjectRoot, 'src', 'main.js'),
  devtool: "eval-source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: [/\.vert$/, /\.frag$/],
        use: "raw-loader"
      },
      {
        test: /\.(gif|png|jpe?g|svg|xml|ttf)$/i,
        use: "file-loader"
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader"
        ]
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(["dist"], {
      root: ProjectRoot
    }),
    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true)
    }),
    new HtmlWebpackPlugin({
      template: "./index.html"
    }),
    new CopyWebpackPlugin([
      { 
        from: path.resolve(ProjectRoot, 'public'),
        to: path.resolve('dist')
      }
    ]),
  ]
};

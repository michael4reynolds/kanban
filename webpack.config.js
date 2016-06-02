const path = require('path')
const merge = require('webpack-merge')
const webpack = require('webpack')
const NpmInstallPlugin = require('npm-install-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const SourceMapDevToolPlugin = webpack.SourceMapDevToolPlugin
const CleanPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const autoprefixer = require("autoprefixer")
const flexbugs = require('postcss-flexbugs-fixes')

const TARGET = process.env.npm_lifecycle_event
const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build'),
  style: path.join(__dirname, 'app/main.css'),
  scss: path.join(__dirname, 'app/sass-styles.scss')
}

process.env.BABEL_ENV = TARGET;

const common = {
  context: PATHS.app,
  entry: {
    app: PATHS.app,
    style: PATHS.style,
    scss: PATHS.scss
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: PATHS.build,
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css!postcss'),
        include: PATHS.app
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css!postcss!sass')
      },
      {
        test: /\.jsx?$/,
        loaders: ['babel?cacheDirectory'],
        include: PATHS.app
      }
    ]
  },
  postcss: () => [
    autoprefixer({browsers: ['> 5%']}),
    flexbugs
  ]
}

if (TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    devServer: {
      contentBase: PATHS.build,
      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true,
      colors: true,
      stats: 'errors-only',
      host: process.env.HOST || '0.0.0.0',
      port: process.env.PORT || 8000
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new NpmInstallPlugin({
        save: true
      }),
      new ExtractTextPlugin('[name].css'),
      new HtmlWebpackPlugin({
        template: 'index.ejs',
        title: 'Kanban app',
        favicon: 'img/favicon.ico',
        inject: false
      }),
      new SourceMapDevToolPlugin({
        test: /\.js/,
        filename: '[file].map',
        columns: false
      })
    ]
  })
}

if(TARGET === 'build' || TARGET === 'stats') {
  module.exports = merge(common, {
    plugins: [
      new CleanPlugin([PATHS.build]),
      new ExtractTextPlugin('[name].css'),
      // Setting DefinePlugin affects React library size!
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"'
      }),
      new HtmlWebpackPlugin({
        template: 'index.ejs',
        title: 'Kanban app',
        favicon: 'img/favicon.ico',
        inject: false
      })
    ]
  });
}

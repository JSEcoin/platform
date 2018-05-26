'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('./config')
const vueLoaderConfig = require('./vue-loader.conf')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})

const webConfig = {
	context: path.resolve(__dirname, '../'),
	entry: {
	  app: '../src/renderer/main.js'
	},
	output: {
	  path: config.build.assetsRoot,
	  filename: '[name].js',
	  //libraryTarget: 'commonjs2',
	  //libraryTarget: 'amd',
	  publicPath: process.env.NODE_ENV === 'production'
		? config.build.assetsPublicPath
		: config.dev.assetsPublicPath
	},
	resolve: {
	  extensions: ['.js', '.vue', '.json'],
	  alias: {
		'vue$': 'vue/dist/vue.esm.js',
		'@': resolve('../src/renderer'),
	  }
	},
	module: {
	  rules: [
		...(config.dev.useEslint ? [createLintingRule()] : []),
		{
			test: /\.js?$/,
			//exclude: /node_modules/,
			loader: 'shebang-loader',
		},
		{
		  test: /\.vue$/,
		  loader: 'vue-loader',
		  exclude: /node_modules/,
		  options: vueLoaderConfig
		},
		{
		  test: /\.css$/,
		  use: ExtractTextPlugin.extract({
			fallback: 'style-loader',
			use: 'css-loader'
		  })
		},
		{
		  test: /\.html$/,
		  use: 'vue-html-loader'
		},
		{
		  test: /\.js$/,
		  loader: 'babel-loader',
		  //exclude: /node_modules/,
		  include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
		},
		{
		  test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
		  loader: 'url-loader',
		  options: {
			limit: 10000,
			name: utils.assetsPath('img/[name].[hash:7].[ext]')
		  }
		},
		{
		  test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
		  loader: 'url-loader',
		  options: {
			limit: 10000,
			name: utils.assetsPath('media/[name].[hash:7].[ext]')
		  }
		},
		{
		  test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
		  loader: 'url-loader',
		  options: {
			limit: 10000,
			name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
		  }
		}
	  ]
	},
	plugins: [
		new webpack.IgnorePlugin(/^electron/), //only used for desktop app
	],
	node: {
	  // prevent webpack from injecting useless setImmediate polyfill because Vue
	  // source contains it (although only uses it if it's native).
	  setImmediate: false,
	  // prevent webpack from injecting mocks to Node native modules
	  // that does not make sense for the client
	  dgram: 'empty',
	  fs: 'empty',
	  net: 'empty',
	  tls: 'empty',
	  child_process: 'empty',
	  __dirname: process.env.NODE_ENV !== 'production',
	  __filename: process.env.NODE_ENV !== 'production'
	}
  };

/**
 * Adjust rendererConfig for development settings
 */
if (process.env.NODE_ENV !== 'production') {
	webConfig.plugins.push(
		new webpack.DefinePlugin({
			'__static': `"${path.join(__dirname, '../../static').replace(/\\/g, '\\\\')}"`,
		}),
	);
}

module.exports = webConfig;

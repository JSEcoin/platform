'use strict';

process.env.BABEL_ENV = 'web';

const path = require('path');
const { dependencies } = require('../package.json');
const webpack = require('webpack');

const BabiliWebpackPlugin = require('babili-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

console.log('Loading Web Config');
console.log(process.env.NODE_ENV);
//console.log(dependencies);
/**
 * List of node_modules to include in webpack bundle
 *
 * Required for specific packages like Vue UI libraries
 * that provide pure *.vue files that need compiling
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/webpack-configurations.html#white-listing-externals
 */
const whiteListedModules = ['vue'];

const webConfig = {
	devtool: '#cheap-module-eval-source-map',
	entry: {
		web: path.join(__dirname, '../src/renderer/main.js'),
	},
	externals: [
	  ...Object.keys(dependencies || {}),
	],
	module: {
		rules: [
			{
				test: /\.js?$/,
				loader: 'shebang-loader',
			},
			{
				test: /\.(js|vue)$/,
				enforce: 'pre',
				exclude: /node_modules/,
				use: {
					loader: 'eslint-loader',
					options: {
						formatter: require('eslint-friendly-formatter'),
					},
				},
			},
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: 'css-loader',
				}),
			},
			{
				test: /\.html$/,
				use: 'vue-html-loader',
			},
			{
				test: /\.js$/,
				use: 'babel-loader',
				//include: [path.resolve(__dirname, '../src/renderer')],
				exclude: /node_modules/,
			},
			{
				test: /\.vue$/,
				use: {
					loader: 'vue-loader',
					options: {
						extractCSS: true,
						loaders: {
							sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax=1',
							scss: 'vue-style-loader!css-loader!sass-loader',
						},
					},
				},
			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				use: {
					loader: 'url-loader',
					query: {
						limit: 10000,
						name: 'imgs/[name].[ext]',
					},
				},
			},
			{
				test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
					loader: 'url-loader',
					options: {
						limit: 10000,
						name: 'media/[name]--[folder].[ext]',
				},
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				use: {
					loader: 'url-loader',
					query: {
						limit: 10000,
						name: 'fonts/[name].[ext]',
					},
				},
			},
		],
	},
	node: {
		fs: 'empty',
		__dirname: process.env.NODE_ENV !== 'production',
		__filename: process.env.NODE_ENV !== 'production',
	},
	plugins: [
		//new webpack.IgnorePlugin(/electron/), //only used for desktop app
		new ExtractTextPlugin('styles.css'),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: path.resolve(__dirname, '../src/index-web.ejs'),
			minify: {
				collapseWhitespace: true,
				removeAttributeQuotes: true,
				removeComments: true,
			},
			nodeModules: process.env.NODE_ENV !== 'production'
			  ? path.resolve(__dirname, '../node_modules')
			  : false,
		}),
		new webpack.DefinePlugin({
			'process.env.IS_WEB': 'true',
		}),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoEmitOnErrorsPlugin(),
	],
	output: {
		filename: '[name].js',
		//libraryTarget: 'commonjs2',
		path: path.join(__dirname, '../dist/web'),
	},
	resolve: {
		alias: {
			'@': path.join(__dirname, '../src/renderer'),
			vue$: 'vue/dist/vue.esm.js',
		},
		extensions: ['.js', '.vue', '.json', '.css', '.node'],
	},
	target: 'web',
};

/**
 * Adjust rendererConfig for development settings
 */
if (process.env.NODE_ENV !== 'production') {
	webConfig.plugins.push(
		new webpack.DefinePlugin({
			'__static': `"${path.join(__dirname, '../static').replace(/\\/g, '\\\\')}"`,
		}),
	);
}

/**
* Adjust webConfig for production settings
*/
if (process.env.NODE_ENV === 'production') {
	webConfig.devtool = '';

	webConfig.plugins.push(
		new BabiliWebpackPlugin(),
		new CopyWebpackPlugin([
			{
				from: path.join(__dirname, '../static'),
				to: path.join(__dirname, '../dist/web/static'),
				ignore: ['.*'],
			},
		]),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': '"production"',
		}),
		new webpack.LoaderOptionsPlugin({
			minimize: true,
		}),
	);
}

module.exports = webConfig;

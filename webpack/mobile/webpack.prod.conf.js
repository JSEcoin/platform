const fs = require('fs');
const path = require('path');
const utils = require('./utils');
const webpack = require('webpack');
const config = require('./config');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const loadMinified = require('./load-minified');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const env = process.env.NODE_ENV === 'testing' ?
	require('./config/test.env') :
	config.build.env;

env.ISGOOGLE = (process.env.ISGOOGLE === 'TRUE');

const webpackConfig = merge(baseWebpackConfig, {
	//mode: 'production',
	module: {
		rules: utils.styleLoaders({
			sourceMap: config.build.productionSourceMap,
			extract: true,
		}),
	},
	devtool: config.build.productionSourceMap ? '#source-map' : false,
	output: {
		path: config.build.assetsRoot,
		filename: utils.assetsPath('js/[name].[chunkhash:15].js'),
		chunkFilename: utils.assetsPath('js/[id].[chunkhash:15].js'),
	},/*
	optimization: {
		minimizer: [
			// we specify a custom UglifyJsPlugin here to get source maps in production
			new UglifyJsPlugin({
				cache: true,
				parallel: true,
				uglifyOptions: {
					compress: false,
					ecma: 6,
					mangle: true,
				},
				sourceMap: true,
			}),
		],
	},*/
	plugins: [
		new webpack.LoaderOptionsPlugin({
			options: {},
		}),
		// http://vuejs.github.io/vue-loader/en/workflow/production.html
		new webpack.DefinePlugin({
			'process.env': env,
			'process.platform': '"mobile"',
		}),
		// extract css into its own file
		new ExtractTextPlugin({
			filename: utils.assetsPath('css/[name].[md5:contenthash:hex:15].css'),
		}),
		// Compress extracted CSS. We are using this plugin so that possible
		// duplicated CSS from different components can be deduped.
		new OptimizeCSSPlugin({
			cssProcessorOptions: {
				safe: true,
			},
		}),
		// generate dist index.html with correct asset hash for caching.
		// you can customize output by editing /index.html
		// see https://github.com/ampedandwired/html-webpack-plugin
		new HtmlWebpackPlugin({
			filename: process.env.NODE_ENV === 'testing' ?
				'index.html' :
				config.build.index,
			template: path.resolve(__dirname, '../../src/index-mobile.ejs'),
			inject: true,
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeAttributeQuotes: true,
				// more options:
				// https://github.com/kangax/html-minifier#options-quick-reference
			},
			// necessary to consistently work with multiple chunks via CommonsChunkPlugin
			chunksSortMode: 'dependency',
			serviceWorkerLoader: `<script>${loadMinified(path.join(__dirname, './service-worker-prod.js'))}</script>`,
		}),
		// copy custom static assets
		new CopyWebpackPlugin([{
			from: path.resolve(__dirname, '../../static'),
			to: config.build.assetsSubDirectory,
			ignore: ['.*'],
		}]),
		// service worker caching
		new SWPrecacheWebpackPlugin({
			cacheId: 'my-vue-app',
			filename: 'service-worker.js',
			staticFileGlobs: ['dist/**/*.{js,html,css}'],
			minify: true,
			stripPrefix: 'dist/',
		}),
	],
});

if (config.build.productionGzip) {
	const CompressionWebpackPlugin = require('compression-webpack-plugin');

	webpackConfig.plugins.push(new CompressionWebpackPlugin({
		asset: '[path].gz[query]',
		algorithm: 'gzip',
		test: new RegExp('\\.(' + config.build.productionGzipExtensions.join('|') + ')$'),
		threshold: 10240,
		minRatio: 0.8,
	}));
}

if (config.build.bundleAnalyzerReport) {
	const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
	webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpackConfig;

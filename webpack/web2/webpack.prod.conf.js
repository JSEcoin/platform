'use strict';

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
const PrerenderSpaPlugin = require('prerender-spa-plugin');
const Renderer = PrerenderSpaPlugin.PuppeteerRenderer;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const env = process.env.NODE_ENV === 'testing'
	? require('./config/test.env')
	: config.build.env;

const webpackConfig = merge(baseWebpackConfig, {
	module: {
		rules: utils.styleLoaders({
			sourceMap: config.build.productionSourceMap,
			extract: true,
		}),
	},
	devtool: config.build.productionSourceMap ? '#source-map' : false,
	output: {
		path: config.build.assetsRoot,
		filename: utils.assetsPath('js/[name].[chunkhash].js'),
		chunkFilename: utils.assetsPath('js/[id].[chunkhash].js'),
	},
	plugins: [
		// http://vuejs.github.io/vue-loader/en/workflow/production.html
		new webpack.DefinePlugin({
			'process.env': env,
			'process.platform': '"web"',
			STATIC_PATH: JSON.stringify(config.build.assetsPublicPath + config.build.assetsSubDirectory),
		}),
		new UglifyJsPlugin({
			uglifyOptions: {
				compress: {
					warnings: false,
				},
				sourceMap: true,
			},
			sourceMap: true,//config.build.productionSourceMap,
			//parallel: true,
		}),
		// extract css into its own file
		new ExtractTextPlugin({
			filename: utils.assetsPath('css/[name].[contenthash].css'),
		}),
		// Compress extracted CSS. We are using this plugin so that possible
		// duplicated CSS from different components can be deduped.
		new OptimizeCSSPlugin({
			cssProcessorOptions: {
				safe: true,
			},
		}),
		new PrerenderSpaPlugin({
			// Required - The path to the webpack-outputted app to prerender.
			staticDir: path.join(__dirname, '../../dist/web'),
			//outputDir: path.join(__dirname, '../../dist/alpha'),
			//indexPath: path.join(__dirname, '../../dist/web', 'index.html'),
			//define renderer to use
			renderer: new Renderer({
				headless: false, // Display the browser window when rendering. Useful for debugging.
				maxConcurrentRoutes: 4,
				timeout: 20000,
				renderAfterTime: 20000,
			}),

			// Optional minification.
			//https://github.com/kangax/html-minifier
			minify: {
				collapseBooleanAttributes: true,
				collapseWhitespace: true,
				decodeEntities: true,
				keepClosingSlash: true,
				sortAttributes: true,
				removeComments: true,
			},

			/*postProcess (renderedRoute) {
				// Ignore any redirects.
				renderedRoute.path = renderedRoute.originalPath
				// Basic whitespace removal. (Don't use this in production.)
				//renderedRoute.html = renderedRoute.html.split(/>[\s]+</gmi).join('><')

				return renderedRoute;
			},*/

			// Required - Routes to render.
			routes: [
				//'/',

				//redirects
				//'/upgradeApp',
				'/login',
				//'/enterSecurityPin',
				'/register',
				//'/dashboard',
				//'/dashboard/account',
				//'/wallet',
				//'/wallet/transactions',
				//'/wallet/export',
				//'/wallet/import',
				//'/mine',
				//'/mine/earnings',
				//'/settings',
				//'/ico',
			],
		}),
		// generate dist index.html with correct asset hash for caching.
		// you can customize output by editing /index.html
		// see https://github.com/ampedandwired/html-webpack-plugin
		new HtmlWebpackPlugin({
			filename: process.env.NODE_ENV === 'testing'
				? 'index.html'
				: config.build.index,
			template: path.resolve(__dirname, '../../src/index-web.ejs'),
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
			serviceWorkerLoader: `<script>${loadMinified(path.join(__dirname,
				'./service-worker-prod.js'))}</script>`,
		}),
		// split vendor js into its own file
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			minChunks: (module, count) => {
				// any required modules inside node_modules are extracted to vendor
				return (
					module.resource &&
					/\.js$/.test(module.resource) &&
					module.resource.indexOf(
						path.join(__dirname, '../../node_modules'),
					) === 0
				);
			},
		}),
		// extract webpack runtime and module manifest to its own file in order to
		// prevent vendor hash from being updated whenever app bundle is updated
		new webpack.optimize.CommonsChunkPlugin({
			name: 'manifest',
			chunks: ['vendor'],
		}),
		// copy custom static assets
		new CopyWebpackPlugin([
			{
				from: path.resolve(__dirname, '../../static'),
				to: config.build.assetsSubDirectory,
				ignore: ['.*'],
			},
		]),
		// service worker caching
		new SWPrecacheWebpackPlugin({
			cacheId: 'jse-platform_120818',
			filename: 'jse-platform-worker.js',
			//staticFileGlobs: ['dist/**/*.{js,html,css}'],
			staticFileGlobsIgnorePatterns: [/\.map$/], // use this to ignore sourcemap files
			staticFileGlobs: [
				'dist/web/*.{js,css}',
				'dist/web/index.html',
			],
			minify: true,
			stripPrefix: 'dist/web/',
		}),
	],
});

if (config.build.productionGzip) {
	const CompressionWebpackPlugin = require('compression-webpack-plugin');

	webpackConfig.plugins.push(
		new CompressionWebpackPlugin({
			asset: '[path].gz[query]',
			algorithm: 'gzip',
			test: new RegExp(
				'\\.(' +
				config.build.productionGzipExtensions.join('|') +
				')$',
			),
			threshold: 10240,
			minRatio: 0.8,
		}),
	);
}

if (config.build.bundleAnalyzerReport) {
	const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
	webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpackConfig;

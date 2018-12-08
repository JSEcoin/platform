const path = require('path');
const PrerenderSpaPlugin = require('prerender-spa-plugin');

//supported language base dir
const langSupport = [
	'',
//	'/en',
//	'/ar',
//	'/bg',
//	'/zh',
//	'/de',
//	'/es',
//	'/fi',
//	'/fr',
//	'/id',
//	'/it',
//	'/ja',
//	'/ko',
//	'/ms',
//	'/nl',
//	'/no',
//	'/pt',
//	'/ro',
//	'/ru',
//	'/si',
//	'/se',
//	'/th',
//	'/tw',
];

//core web pages
const coreRoutes = [
	//redirects
	'/login',
];

const siteRoutes = ['/'];
//add local support for all routes
langSupport.forEach((lang) => {
	coreRoutes.forEach((route) => {
		siteRoutes.push(`${lang}${route}`);
	});
});
const allSiteRoutes = siteRoutes;//.concat(extraRoutes);

const productionPlugins = [
	new PrerenderSpaPlugin({
		staticDir: path.join(__dirname, 'dist'),
		routes: allSiteRoutes,
		minify: {
			collapseBooleanAttributes: true,
			collapseWhitespace: true,
			decodeEntities: true,
			keepClosingSlash: true,
			sortAttributes: true,
			removeComments: true,
		},
		postProcess(renderedRoute) {
			renderedRoute.html = renderedRoute.html
				.replace(/<script (.*?)>/g, '<script $1 defer>')
				.replace('id="JSEA-desktop"', 'id="JSEA-desktop" data-server-rendered="true"');

			return renderedRoute;
		},
		//renderer: new Renderer({
		renderer: new PrerenderSpaPlugin.PuppeteerRenderer({
			//headless: false // Display the browser window when rendering. Useful for debugging.
			maxConcurrentRoutes: 4,
			timeout: 0,
			// We need to inject a value so we're able to
			// detect if the page is currently pre-rendered.
			inject: {},
			// Our view component is rendered after the API
			// request has fetched all the necessary data,
			// so we create a snapshot of the page after the
			// `data-view` attribute exists in the DOM.
			//renderAfterElementExists: '[data-view]',
		}),
	}),
];

module.exports = {
	pluginOptions: {
		electronBuilder: {
			noAppProtocol: true,
			builderOptions: {
				files: [
					'!node_modules',
				],
				productName: 'JSECoin',
				appId: 'com.jsecoin.desktop',
				//asarUnpack: [
				//	'**/static/**/*',
				//],
				//directories: {
				//	'output': 'build',
				//},
				//files: [
				//	'dist/desktop/**/*',
				//],
				dmg: {
					contents: [
						{
							x: 375,
							y: 60,
							type: 'link',
							path: '/Applications',
						},
						{
							x: 125,
							y: 60,
							type: 'file',
						},
					],
					window: {
						x: 200,
						y: 120,
						width: 500,
						height: 300,
					},
					background: 'src/main/mac/background.png',
					internetEnabled: true,
				},
				mac: {
					icon: 'src/main/mac/icon.icns',
				},
				win: {
					icon: 'src/main/win/icon.ico',
					target: [
						{
							target: 'nsis',
							arch: [
								'ia32',
								'x64',
							],
						},
					],
				},
				linux: {
					icon: 'src/main/linux',
				},
			},
			removeElectronJunk: true, // True by default
			//outputDir: 'electron-builder-output-dir',
			chainWebpackRendererProcess: (config) => {
				// Chain webpack config for electron renderer process only
				// The following will set IS_ELECTRON to true within the app
				config.plugin('define').tap((args) => {
					args[0].IS_ELECTRON = true;
					return args;
				});
			},
		},
	},
	pwa: {
		cacheId: 'JSEPlatform',
		name: 'JSECoin Ltd Official Platform',
		themeColor: '#4DBA87',
		msTileColor: '#000000',
		appleMobileWebAppCapable: 'yes',
		appleMobileWebAppStatusBarStyle: 'black',

		// configure the workbox plugin
		workboxPluginMode: 'GenerateSW',//'InjectManifest',
		workboxOptions: {
			exclude: [/\.psd$/, /\.jpg$/, /\.png$/, /\.json$/, /\.gitkeep$/, /\.svg$/, /\.html$/, /\.htm$/, /\.css$/, /\.js$/, /\.txt$/, /\.mp4$/, /\.ico$/, /\.xml$/, /\.pdf$/, /\.woff$/, /\.ttf$/, /\.woff2$/, /\.eot$/, /\.zip$/],
			// swSrc is required in InjectManifest mode.
			//swSrc: 'dev/sw.js',
			// ...other Workbox options...
		},
	},
	configureWebpack: (config) => {
		/*config.resolve = {
			alias: {
				'@': path.resolve(__dirname, 'src/'),
			},
		};*/
		if (process.env.NODE_ENV === 'production') {
			config.plugins.push(...productionPlugins);
		}
	},/*
	chainWebpack: (config) => {
		config.plugin('preload').include = ['header'];
	},*/
    /*
	chainWebpack: (config) => {
		if (process.env.NODE_ENV === 'production') {
			config
				.plugin('prerender-spa-plugin')
				.use(PrerenderSPAPlugin, [{
					staticDir: path.join(__dirname, 'dist'),
					routes: [
						'/',
						'/about',
					],
				}]);
		}
	},*/
    /*
	configureWebpack: {
		plugins: [
			new PrerenderSPAPlugin({
				staticDir: path.join(__dirname, 'dist'),
				//define renderer to use
				renderer: new Renderer({
					//headless: false // Display the browser window when rendering. Useful for debugging.
					maxConcurrentRoutes: 4,
					timeout: 0,
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
				routes: allSiteRoutes,
			}),
		],
	},*/

	baseUrl: undefined,
	outputDir: undefined,
	assetsDir: 'assets',
	runtimeCompiler: undefined,
	productionSourceMap: false,
	parallel: undefined,
	css: undefined,
};

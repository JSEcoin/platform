const path = require('path');
//const webpack = require('webpack');

module.exports = {
	title: 'JSECoin Platform Guide',
	//defaultExample: true,
	components: './src/components/**/*.vue',
	usageMode: 'expand',//showUsage: true,
	exampleMode: 'expand',//showCode: true,
	showSidebar: true,
	styleguideDir: './dist_styleguide',
	//navigation: true,
	//vuex: './src/store/index',
	renderRootJsx: path.join(__dirname, 'docs/styleguide.root.js'),
	ribbon: {
		url: 'https://github.com/jsecoin',
		text: 'JSECoin on GitHub',
	},
	styleguideComponents: {
		'@': path.join(__dirname, './src'),
	},
	//load in additional required images
	require: [
		path.join(__dirname, './docs/global.requires.js'),
		path.join(__dirname, './docs/css/styles.css'),
		path.join(__dirname, 'public/static/styleguide/dashboard-overview.png'),
		path.join(__dirname, 'public/static/styleguide/dashboard-account.png'),
		path.join(__dirname, 'public/static/styleguide/mine-earnings.png'),
		path.join(__dirname, 'public/static/styleguide/mine-platform.png'),
		path.join(__dirname, 'public/static/styleguide/settings.png'),
		path.join(__dirname, 'public/static/styleguide/wallet-export.png'),
		path.join(__dirname, 'public/static/styleguide/wallet-import.png'),
		path.join(__dirname, 'public/static/styleguide/wallet-transactions.png'),
		path.join(__dirname, 'public/static/styleguide/wallet-transfer.png'),
		path.join(__dirname, 'public/static/styleguide/login.png'),
	],
	sections: [
		{
			name: 'Project Overview',
			content: './docs/Getting-Started.md',
		},
		{
			name: 'Pages',
			content: './docs/Pages.md',
			components: () => [
				'./src/components/SplashLoadingScreen-Page.vue',
				'./src/components/UpgradeApp-Page.vue',
				'./src/components/Login-Page.vue',
				'./src/components/dashboard/Overview-Page.vue',
				'./src/components/dashboard/Account-Page.vue',
				//'./src/components/wallet/Export-Page.vue',
				'./src/components/wallet/Import-Page.vue',
				'./src/components/wallet/Transfer-Page.vue',
				'./src/components/wallet/WalletTransactions-Page.vue',
				'./src/components/mine/PlatformMiner-Page.vue',
				'./src/components/mine/Earnings-Page.vue',
				'./src/components/settings/Settings-Page.vue',
			],
		},
		{
			name: 'Widgets',
			content: './docs/Widgets.md',
			components: () => [
				'./src/components/widgets/AppWrapperWidget.vue',
				'./src/components/widgets/ButtonWidget.vue',
				'./src/components/widgets/Coin.vue',
				//'./src/components/widgets/ChartWidget.vue',
				'./src/components/widgets/CoinCodeWidget.vue',
				'./src/components/widgets/CoinStatusWidget.vue',
				'./src/components/widgets/ConsoleWidget.vue',
				'./src/components/widgets/ContentWidget.vue',
				'./src/components/widgets/FormErrorDisplayWidget.vue',
				'./src/components/widgets/GenerateBookletWidget.vue',
				'./src/components/widgets/InputWidget.vue',
				'./src/components/widgets/LoadingDelayMaskWidget.vue',
				'./src/components/widgets/MiningAcceleratorWidget.vue',
				'./src/components/widgets/MiningChartWidget.vue',
				'./src/components/widgets/MiningOverviewPanelWidget.vue',
				'./src/components/widgets/NavWidget.vue',
				'./src/components/widgets/OptionsListWrapperWidget.vue',
				'./src/components/widgets/OverviewCoinDispayWidget.vue',
				'./src/components/widgets/QRCoinCodeWidget.vue',
				'./src/components/widgets/ScrollWidget.vue',
				'./src/components/widgets/SettingsItemRowWidget.vue',
				'./src/components/widgets/SpinnerWidget.vue',
				'./src/components/widgets/Splash.vue',
				'./src/components/widgets/ToggleSwitchWidget.vue',
				'./src/components/widgets/TwoFA.vue',
			],
		},
	],
	/*
	webpackConfig: {
		plugins: [
			new webpack.IgnorePlugin(/electron/), //only used for desktop app
			new webpack.IgnorePlugin(/nav/), //not needed for documentation
		],
		resolve: {
			alias: {
				'@': path.join(__dirname, './src'),
			},
		},
		module: {
			rules: [
				{
					test: /\.vue$/,
					loader: 'vue-loader',
				},
				{
					test: /\.js?$/,
					loader: 'shebang-loader',
				},
				{
					test: /\.js?$/,
					exclude: /node_modules/,
					loader: 'babel-loader',
				},
				{
					test: /\.css$/,
					use: ['style-loader', 'css-loader'],
				},
				{
					test: /\.scss$/,
					use: ['style-loader', 'css-loader', 'sass-loader'],
				},
				{
					test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
					use: {
						loader: 'url-loader',
						query: {
							limit: 10000,
							name: 'imgs/[name]--[folder].[ext]',
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
							name: 'fonts/[name]--[folder].[ext]',
						},
					},
				},
			],
		},
	},*/
};

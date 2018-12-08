const path = require('path');
const webpack = require('webpack');

module.exports = {
	title: 'JSECoin Platform Guide',
	components: '../../src/renderer/components/**/*.vue',
	showUsage: true,
	showCode: true,
	showSidebar: true,
	styleguideDir: '../../styleguide',
	//navigation: true,
	vuex: '../../src/renderer/store/index',
	ribbon: {
		url: 'https://github.com/jsecoin',
		text: 'JSECoin on GitHub',
	},
	styleguideComponents: {
		'@': path.join(__dirname, '../../src/renderer'),
	},
	//load in additional required images
	require: [
		path.join(__dirname, '../../docs/global.requires.js'),
		path.join(__dirname, '../../docs/css/styles.css'),
		path.join(__dirname, '../../static/styleguide/dashboard-overview.png'),
		path.join(__dirname, '../../static/styleguide/dashboard-account.png'),
		path.join(__dirname, '../../static/styleguide/mine-earnings.png'),
		path.join(__dirname, '../../static/styleguide/mine-platform.png'),
		path.join(__dirname, '../../static/styleguide/settings.png'),
		path.join(__dirname, '../../static/styleguide/wallet-export.png'),
		path.join(__dirname, '../../static/styleguide/wallet-import.png'),
		path.join(__dirname, '../../static/styleguide/wallet-transactions.png'),
		path.join(__dirname, '../../static/styleguide/wallet-transfer.png'),
		path.join(__dirname, '../../static/styleguide/login.png'),
	],
	sections: [
		{
			name: 'Project Overview',
			content: '../../docs/Getting-Started.md',
		},
		{
			name: 'Pages',
			content: '../../docs/Pages.md',
			components: () => [
				'../../src/renderer/components/SplashLoadingScreen-Page.vue',
				'../../src/renderer/components/UpgradeApp-Page.vue',
				'../../src/renderer/components/Login-Page.vue',
				'../../src/renderer/components/dashboard/Overview-Page.vue',
				'../../src/renderer/components/dashboard/Account-Page.vue',
				'../../src/renderer/components/wallet/Export-Page.vue',
				'../../src/renderer/components/wallet/Import-Page.vue',
				'../../src/renderer/components/wallet/Transfer-Page.vue',
				'../../src/renderer/components/wallet/WalletTransactions-Page.vue',
				'../../src/renderer/components/mine/PlatformMiner-Page.vue',
				'../../src/renderer/components/mine/Earnings-Page.vue',
				'../../src/renderer/components/settings/Settings-Page.vue',
			],
		},
		{
			name: 'Widgets',
			content: '../../docs/Widgets.md',
			components: () => [
				'../../src/renderer/components/widgets/AppWrapperWidget.vue',
				'../../src/renderer/components/widgets/ButtonWidget.vue',
				'../../src/renderer/components/widgets/Coin.vue',
				'../../src/renderer/components/widgets/ChartWidget.vue',
				'../../src/renderer/components/widgets/CoinCodeWidget.vue',
				'../../src/renderer/components/widgets/CoinStatusWidget.vue',
				'../../src/renderer/components/widgets/ConsoleWidget.vue',
				'../../src/renderer/components/widgets/ContentWidget.vue',
				'../../src/renderer/components/widgets/FormErrorDisplayWidget.vue',
				'../../src/renderer/components/widgets/GenerateBookletWidget.vue',
				'../../src/renderer/components/widgets/InputWidget.vue',
				'../../src/renderer/components/widgets/LoadingDelayMaskWidget.vue',
				'../../src/renderer/components/widgets/MiningAcceleratorWidget.vue',
				'../../src/renderer/components/widgets/MiningChartWidget.vue',
				'../../src/renderer/components/widgets/MiningOverviewPanelWidget.vue',
				'../../src/renderer/components/widgets/NavWidget.vue',
				'../../src/renderer/components/widgets/OptionsListWrapperWidget.vue',
				'../../src/renderer/components/widgets/OverviewCoinDispayWidget.vue',
				'../../src/renderer/components/widgets/QRCoinCodeWidget.vue',
				'../../src/renderer/components/widgets/ScrollWidget.vue',
				'../../src/renderer/components/widgets/SettingsItemRowWidget.vue',
				'../../src/renderer/components/widgets/SpinnerWidget.vue',
				'../../src/renderer/components/widgets/Splash.vue',
				'../../src/renderer/components/widgets/ToggleSwitchWidget.vue',
				'../../src/renderer/components/widgets/TwoFA.vue',
			],
		},
	],
	webpackConfig: {
		plugins: [
			new webpack.IgnorePlugin(/electron/), //only used for desktop app
			new webpack.IgnorePlugin(/nav/), //not needed for documentation
		],
		resolve: {
			alias: {
				'@': path.join(__dirname, '../../src/renderer'),
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
	},
};

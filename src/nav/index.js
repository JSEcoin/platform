import Vue from 'vue';
import Router from 'vue-router';

//store
import store from '@/store';

//splashLoadingScreen
import splashLoadingScreen from '@/components/SplashLoadingScreen-Page';

//upgradeApp\
const upgradeApp = () => import(/* webpackChunkName: "upgradeApp" */ '@/components/UpgradeApp-Page');

//login
const login = () => import(/* webpackChunkName: "login" */ '@/components/Login-Page');
const resetPassword = () => import(/* webpackChunkName: "login" */ '@/components/Reset-Password-Page');
const restore2FA = () => import(/* webpackChunkName: "login" */ '@/components/Restore2FA-Page');

//Security Pin Setup
const enterSecurityPin = () => import(/* webpackChunkName: "enterSecurityPin" */ '@/components/EnterSecurityPin-Page');

//Register
const register = () => import(/* webpackChunkName: "login" */ '@/components/Register-Page');

//settings
const settings = () => import(/* webpackChunkName: "settings" */ '@/components/settings/Settings-Page');

//dashboard
const overview = () => import(/* webpackChunkName: "overview" */ '@/components/dashboard/Overview-Page');
const desktopOverview = () => import(/* webpackChunkName: "overview" */ '@/components/desktop/dashboard/Overview-Page');
const account = () => import(/* webpackChunkName: "overview" */ '@/components/dashboard/Account-Page');

//wallet
const transfer = () => import(/* webpackChunkName: "wallet" */ '@/components/wallet/Transfer-Page');
const walletTransactions = () => import(/* webpackChunkName: "wallet" */ '@/components/wallet/WalletTransactions-Page');
const exportJSE = () => import(/* webpackChunkName: "wallet" */ '@/components/wallet/Export-Page');
const importJSE = () => import(/* webpackChunkName: "wallet" */ '@/components/wallet/Import-Page');

//mine
const platformMiner = () => import(/* webpackChunkName: "mine" */ '@/components/mine/PlatformMiner-Page');
const earnings = () => import(/* webpackChunkName: "mine" */ '@/components/mine/Earnings-Page');

//Block Explorer
//import Charts from '@/components/blockchain/Charts';
const Blocks = () => import(/* webpackChunkName: "block" */ '@/components/blockchain/Blocks');
const Ledger = () => import(/* webpackChunkName: "block" */ '@/components/blockchain/Ledger');
const APIs = () => import(/* webpackChunkName: "block" */ '@/components/blockchain/APIs');
const Block = () => import(/* webpackChunkName: "block" */ '@/components/blockchain/Block');
const Transaction = () => import(/* webpackChunkName: "block" */ '@/components/blockchain/Transaction');
const AllBlocks = () => import(/* webpackChunkName: "block" */ '@/components/blockchain/AllBlocks');
const AllTransactions = () => import(/* webpackChunkName: "block" */ '@/components/blockchain/AllTransactions');
const Search = () => import(/* webpackChunkName: "block" */ '@/components/blockchain/Search');
const Stats = () => import(/* webpackChunkName: "block" */ '@/components/blockchain/Stats');

//import Wall from '@/components/crypto/Wall';
const JSEStats = () => import(/* webpackChunkName: "crypto" */ '@/components/crypto/Stats');

Vue.use(Router);

const router = new Router({
	mode: (process.env.CORDOVA_PLATFORM) ? 'hash' : 'history', //((typeof (process) !== 'undefined') && (typeof (process.browser) === 'undefined')) ? 'hash' : 'history',
	base: process.env.BASE_URL,
	routes: [
		{
			path: '/',
			name: 'splash',
			component: splashLoadingScreen,
		},
		{
			path: '/upgradeApp',
			name: 'upgradeApp',
			component: upgradeApp,
		},
		{
			path: '/login',
			name: 'login',
			component: login,
		},
		{
			path: '/resetPassword',
			name: 'resetPassword',
			component: resetPassword,
		},
		{
			path: '/restore2FA',
			name: 'restore2FA',
			component: restore2FA,
		},
		{
			path: '/enterSecurityPin',
			name: 'enterSecurityPin',
			component: enterSecurityPin,
			meta: {
				requiresAuth: true,
			},
		},
		{
			path: '/register',
			name: 'register',
			component: register,
		},
		{
			path: '/settings',
			name: 'settings',
			component: settings,
			meta: {
				requiresAuth: true,
			},
		},
		{
			path: '/dashboard',
			name: 'overview',
			component: overview,
			meta: {
				requiresAuth: true,
				hasDesktopInterface: true,
			},
		},
		{
			path: '/dashboard/account',
			name: 'account',
			component: account,
			meta: {
				requiresAuth: true,
			},
		},
		//desktop
		{
			path: '/desktop/dashboard',
			name: 'Desktop Overview',
			component: desktopOverview,
			meta: {
				requiresAuth: true,
			},
		},
		{
			path: '/wallet',
			name: 'transfer',
			component: transfer,
			meta: {
				requiresAuth: true,
			},
		},
		{
			path: '/wallet/transactions',
			name: 'walletTransactions',
			component: walletTransactions,
			meta: {
				requiresAuth: true,
			},
		},
		{
			path: '/wallet/export',
			name: 'export',
			component: exportJSE,
			meta: {
				requiresAuth: true,
			},
		},
		{
			path: '/wallet/import',
			name: 'import',
			component: importJSE,
			meta: {
				requiresAuth: true,
			},
		},
		{
			path: '/mine',
			name: 'platformMiner',
			component: platformMiner,
			meta: {
				requiresAuth: true,
			},
		},
		{
			path: '/mine/earnings',
			name: 'earnings',
			component: earnings,
			meta: {
				requiresAuth: true,
			},
		},
		{
			path: '/blockchain/',
			name: 'Blocks',
			component: Blocks,
		},
		{
			path: '/blockchain/Ledger',
			name: 'Ledger',
			component: Ledger,
		},
		{
			path: '/blockchain/APIs',
			name: 'APIs',
			component: APIs,
		},
		{
			path: '/blockchain/Block/:id',
			name: 'Block',
			component: Block,
		},
		{
			path: '/blockchain/Transaction/:blockLvl/:blockVal/:key',
			name: 'Transaction',
			component: Transaction,
		},
		{
			path: '/blockchain/AllBlocks/:blockLvl/:blockVal',
			name: 'AllBlocks',
			component: AllBlocks,
		},
		{
			path: '/blockchain/AllTransactions',
			name: 'AllTransactions',
			component: AllTransactions,
		},
		{
			path: '/blockchain/Search/:val',
			name: 'Search',
			component: Search,
		},
		{
			path: '/blockchain/Stats',
			name: 'Stats',
			component: Stats,
		},
		{
			path: '/crypto/tats',
			name: 'JSEStats',
			component: JSEStats,
		},
	],
});

/**
 * Before each route check user is authenticated on next path else redirect to login
 */
router.beforeEach((to, from, next) => {
	const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
	const hasDesktopInterface = to.matched.some(record => record.meta.hasDesktopInterface);
	if ((requiresAuth) && (!store.state.user.loggedIn)) {
		next('login');
	} else if ((hasDesktopInterface) && (store.state.app.platformURL === '/desktop')) {
		next(`${store.state.app.platformURL}${to.path}`);
	} else {
		next();
	}
});

export default router;

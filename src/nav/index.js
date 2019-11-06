import Vue from 'vue';
import Router from 'vue-router';

//store
import store from '@/store';

//splashLoadingScreen
import splashLoadingScreen from '@/views/SplashLoadingScreen-Page';

const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

//upgradeApp
const upgradeApp = () => import(/* webpackChunkName: "upgradeApp" */ '@/views/UpgradeApp-Page');

//login
const login = () => import(/* webpackChunkName: "login" */ '@/views/Login-Page');
const resetPassword = () => import(/* webpackChunkName: "login" */ '@/views/Reset-Password-Page');
const restore2FA = () => import(/* webpackChunkName: "login" */ '@/views/Restore2FA-Page');

//Security Pin Setup
const enterSecurityPin = () => import(/* webpackChunkName: "enterSecurityPin" */ '@/views/EnterSecurityPin-Page');

//Register
const register = () => import(/* webpackChunkName: "login" */ '@/views/Register-Page');

//settings
const settings = () => import(/* webpackChunkName: "settings" */ '@/views/settings/Settings-Page');

//dashboard
const overview = () => import(/* webpackChunkName: "overview" */ '@/views/dashboard/Overview-Page');
const desktopOverview = () => import(/* webpackChunkName: "overview" */ '@/views/desktop/dashboard/Overview-Page');
const account = () => import(/* webpackChunkName: "overview" */ '@/views/dashboard/Account-Page');

//wallet
const transfer = () => import(/* webpackChunkName: "wallet" */ '@/views/wallet/Transfer-Page');
const walletTransactions = () => import(/* webpackChunkName: "wallet" */ '@/views/wallet/WalletTransactions-Page');
const exportJSE = () => import(/* webpackChunkName: "wallet" */ '@/views/wallet/Export-Page');
const importJSE = () => import(/* webpackChunkName: "wallet" */ '@/views/wallet/Import-Page');

//mine
const platformMiner = () => import(/* webpackChunkName: "mine" */ '@/views/mine/PlatformMiner-Page');
const earnings = () => import(/* webpackChunkName: "mine" */ '@/views/mine/Earnings-Page');

//Block Explorer
//import Charts from '@/views/blockchain/Charts';
const Blocks = () => import(/* webpackChunkName: "block" */ '@/views/blockchain/Blocks-Page');
const Ledger = () => import(/* webpackChunkName: "block" */ '@/views/blockchain/Ledger-Page');
const APIs = () => import(/* webpackChunkName: "block" */ '@/views/blockchain/APIs-Page');
const Block = () => import(/* webpackChunkName: "block" */ '@/views/blockchain/Block-Page');
const Transaction = () => import(/* webpackChunkName: "block" */ '@/views/blockchain/Transaction-Page');
const AllBlocks = () => import(/* webpackChunkName: "block" */ '@/views/blockchain/AllBlocks-Page');
const AllTransactions = () => import(/* webpackChunkName: "block" */ '@/views/blockchain/AllTransactions-Page');
const Search = () => import(/* webpackChunkName: "block" */ '@/views/blockchain/Search-Page');
const Stats = () => import(/* webpackChunkName: "block" */ '@/views/blockchain/Stats-Page');

//import Wall from '@/views/crypto/Wall';
const JSEStats = () => import(/* webpackChunkName: "crypto" */ '@/views/crypto/Stats-Page');

//if (typeof (__static) !== 'undefined')  {
	upgradeApp();
	login();
	resetPassword();
	restore2FA();
	enterSecurityPin();
	register();
	settings();
	overview();
	desktopOverview();
	account();
	transfer();
	walletTransactions();
	exportJSE();
	importJSE();
	platformMiner();
	earnings();
	Blocks();
//}

Vue.use(Router);

const router = new Router({
	mode: ((process.env.CORDOVA_PLATFORM) || (typeof (__static) !== 'undefined')) ? 'hash' : 'history', //((typeof (process) !== 'undefined') && (typeof (process.browser) === 'undefined')) ? 'hash' : 'history',
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
			name: 'desktopOverview',
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
			path: '/blockchain',
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
	const routeName = to.name;
	if (routeName !== 'splash') {
		store.commit('updateAppState', {
			val: ((routeName === 'upgradeApp') || (routeName === 'resetPassword') || (routeName === 'upgradeApp') || (routeName === 'restore2FA') || (routeName === 'register'))?`${to.path}` : '/login',
			state: 'initLander',
		});
	}
	const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
	const hasDesktopInterface = to.matched.some(record => record.meta.hasDesktopInterface) || false;
	//console.log('has', hasDesktopInterface);
	if ((requiresAuth) && (!store.state.user.loggedIn)) {
		next('/login');
	} else if (hasDesktopInterface) {
		next('/desktop/dashboard');
	} else {
		next();
	}
});

export default router;

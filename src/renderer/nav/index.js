import Vue from 'vue';
import Router from 'vue-router';

//splashLoadingScreen
import splashLoadingScreen from '@/components/SplashLoadingScreen-Page';

//login
import login from '@/components/Login-Page';

//Register
import register from '@/components/Register-Page';

//Security Pin Setup
import enterSecurityPin from '@/components/EnterSecurityPin-Page';

//upgradeApp
import upgradeApp from '@/components/UpgradeApp-Page';

//dashboard
import overview from '@/components/dashboard/Overview-Page';
import account from '@/components/dashboard/Account-Page';

//wallet
import transfer from '@/components/wallet/Transfer-Page';
import walletTransactions from '@/components/wallet/WalletTransactions-Page';
import exportJSE from '@/components/wallet/Export-Page';
import importJSE from '@/components/wallet/Import-Page';

//mine
import platformMiner from '@/components/mine/PlatformMiner-Page';
import earnings from '@/components/mine/Earnings-Page';

//settings
import settings from '@/components/settings/Settings-Page';

//ICO
import ICO from '@/components/ICO/ICO-Page';

//store
import store from '../store';

Vue.use(Router);

const router = new Router({
	mode: ((typeof (process) !== 'undefined') && (typeof (process.browser) === 'undefined'))?'hash':'history',
	routes: [/*{
			path: '*',
			redirect: '/',
	},*/
		{
			path: '/upgradeApp',
			name: 'upgradeApp',
			component: upgradeApp,
		},
		{
			path: '/',
			name: 'splash',
			component: splashLoadingScreen,
		},
		{
			path: '/login',
			name: 'login',
			component: login,
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
			path: '/dashboard',
			name: 'overview',
			component: overview,
			meta: {
				requiresAuth: true,
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
			path: '/settings',
			name: 'settings',
			component: settings,
			meta: {
				requiresAuth: true,
			},
		},
		{
			path: '/ico',
			name: 'ICO',
			component: ICO,
			meta: {
				requiresAuth: true,
			},
		},
	],
});

/**
 * Before each route check user is authenticated on next path else redirect to login
 */
router.beforeEach((to, from, next) => {
	const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

	if ((requiresAuth) && (!store.state.user.loggedIn)) {
		next('login');
	} else {
		next();
	}
});

export default router;

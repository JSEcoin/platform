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
import desktopOverview from '@/components/desktop/dashboard/Overview-Page';
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

//Block Explorer
import Blocks from '@/components/blockchain/Blocks';
//import Charts from '@/components/blockchain/Charts';
import Ledger from '@/components/blockchain/Ledger';
import APIs from '@/components/blockchain/APIs';
import Block from '@/components/blockchain/Block';
import Transaction from '@/components/blockchain/Transaction';
import AllBlocks from '@/components/blockchain/AllBlocks';
import AllTransactions from '@/components/blockchain/AllTransactions';
import Search from '@/components/blockchain/Search';
import Stats from '@/components/blockchain/Stats';

import Wall from '@/components/crypto/Wall';
import JSEStats from '@/components/crypto/Stats';


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
			path: '/desktop/dashboard/account',
			name: 'Desktop account',
			component: account,
			meta: {
				requiresAuth: true,
			},
		},
		{
			path: '/desktop/wallet',
			name: 'Desktop transfer',
			component: transfer,
			meta: {
				requiresAuth: true,
			},
		},
		{
			path: '/desktop/wallet/transactions',
			name: 'Desktop walletTransactions',
			component: walletTransactions,
			meta: {
				requiresAuth: true,
			},
		},
		{
			path: '/desktop/wallet/export',
			name: 'Desktop export',
			component: exportJSE,
			meta: {
				requiresAuth: true,
			},
		},
		{
			path: '/desktop/wallet/import',
			name: 'Desktop import',
			component: importJSE,
			meta: {
				requiresAuth: true,
			},
		},
		{
			path: '/desktop/mine',
			name: 'Desktop platformMiner',
			component: platformMiner,
			meta: {
				requiresAuth: true,
			},
		},
		{
			path: '/desktop/mine/earnings',
			name: 'Desktop earnings',
			component: earnings,
			meta: {
				requiresAuth: true,
			},
		},
		{
			path: '/desktop/settings',
			name: 'Desktop settings',
			component: settings,
			meta: {
				requiresAuth: true,
			},
		},
		{
		  path: '/desktop/blockchain/',
		  name: 'Blocks',
		  component: Blocks,
		},/*
		{
		  path: '/desktop/blockchain/Charts',
		  name: 'Charts',
		  component: Charts,
		},*/
		{
		  path: '/desktop/blockchain/Ledger',
		  name: 'Ledger',
		  component: Ledger,
		},
		{
		  path: '/desktop/blockchain/APIs',
		  name: 'APIs',
		  component: APIs,
		},
		{
		  path: '/desktop/blockchain/Block/:id',
		  name: 'Block',
		  component: Block,
		},
		{
		  path: '/desktop/blockchain/Transaction/:blockLvl/:blockVal/:key',
		  name: 'Transaction',
		  component: Transaction,
		},
		{
		  path: '/desktop/blockchain/AllBlocks/:blockLvl/:blockVal',
		  name: 'AllBlocks',
		  component: AllBlocks,
		},
		{
		  path: '/desktop/blockchain/AllTransactions',
		  name: 'AllTransactions',
		  component: AllTransactions,
		},
		{
		  path: '/desktop/blockchain/Search/:val',
		  name: 'Search',
		  component: Search,
		},
		{
		  path: '/desktop/blockchain/Stats',
		  name: 'Stats',
		  component: Stats,
		},
		{
		  path: '/desktop/crypto/Wall',
		  name: 'Wall',
		  component: Wall,
		},
		{
		  path: '/desktop/crypto/tats',
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

	if ((requiresAuth) && (!store.state.user.loggedIn)) {
		next('login');
	} else {
		next();
	}
});

export default router;

const state = {
	version: process.env.VUE_APP_VERSION, //app version no
	major: process.env.VUE_APP_MJRVERSION, //support only this server release
	base: 'platformWeb', //[platformWeb, platformDesktop]
	platform: 'web', //platform type [desktop, mobile, web] // [electron, cordova, web]
	platformURL: '/desktop', // for router
	screen: 'med', //screen size [min, med, max]
	isDev: true, //is in development mode
	loading: true, //app loading indicator
	theme: 'light', //app theme ['light','night]
	autoLaunch: true, //on boot autolaunch app
	showCaptcha: false, //display captcha security check
	captchaUrl: 'https://jsecoin.com/iCaptcha/iCaptcha.html?JSE=alphax1', //captcha url
	autoMine: false, //on login start mining
	mobileBackgroundMode: false, //allows mobile to mine in the background
	silentMode: false, //enables mobile background mining in silent mode
	autoLogin: true, //try to login on app load
	storeUsername: true, //on login store username for quick login
	jseCoinServer: 'https://server.jsecoin.com', //app server connection address
	isGoogle: false, //is app hosted on google then disable miner
	initLander: '/login', //set initial landing page for splash screen
	mineWhenpluggedIn: false, //for mobile - mine only when device plugged into power
	notifications: false, //enable desktop notifications
};

const mutations = {
	/**
	 * Loading
	 * Set app loading status
	 * @param {*} state
	 * @param {*} status
	 */
	loading(state, status) {
		state.loading = status;
	},
	/**
	 * updateAppState
	 * Updates state value
	 * @param {*} state
	 * @param {*} update
	 */
	updateAppState(state, update) {
		state[update.state] = update.val;
	},
};

const actions = {};

const getters = {
	whichPlatform: state => state.platform,
	isAppGoogle: state => state.isGoogle,
	whichLandingPage: state => state.initLander,
	notificationsEnabled: state => state.notifications,
};


export default {
	state,
	mutations,
	actions,
	getters,
};

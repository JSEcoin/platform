const state = {
	version: '0.5.1', //app version no
	major: 51, //support only this server release
	platform: 'web', //platform type [desktop, mobile web]
	isDev: true, //is in development mode
	loading: true, //app loading indicator
	theme: 'light', //app theme ['light','night]
	autoLaunch: true, //on boot autolaunch app
	autoMine: true, //on login start mining
	mobileBackgroundMode: false, //allows mobile to mine in the background
	silentMode: false, //enables mobile background mining in silent mode
	autoLogin: true, //try to login on app load
	storeUsername: true, //on login store username for quick login
	jseCoinServer: 'https://server.jsecoin.com', //app server connection address
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
};


export default {
	state,
	mutations,
	actions,
	getters,
};
